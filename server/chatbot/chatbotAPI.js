const request = require('request');
const _ = require('lodash');

const templateGenerator = require('./templateGenerator');
const questionGenerator = require('./questionGenerator');
const { Patient } = require('./../models/patient');
const newsFetcher = require('./newsFetcher');

const chatbotApi = {
    handleMessage: function (user, receivedMessage) {
        console.log(receivedMessage);
        
        let response;

        if (user.chatWith) {
            response = {
                "text": `${user.nickname}> ${receivedMessage.text}`
            };

            this.callSendAPI(user.chatWith, response);
            return;
        }
        else if (receivedMessage.nlp && !_.isEmpty(receivedMessage.nlp.entities)) {

            const entities = receivedMessage.nlp.entities;

            if (entities.intent && entities.intent.length > 0) {
                const intent = entities.intent[0];
                if (intent.value === "talk_action" && intent.confidence > 0.6) {
                    // Create the payload for a basic text message
                    if (entities.person) {
                        response = {
                            "text": `Ok, set up the chat with ${entities.person[0].value}`
                        };
                    }
                }
            }
        }
        else {
            if (receivedMessage.text) {
                if (receivedMessage.text === "Show me") {
                    const buttons = [
                        {
                            "type": "postback",
                            "title": "See news",
                            "payload": "SEE_NEWS"
                        },

                        {
                            "type": "postback",
                            "title": "Connect you with someone",
                            "payload": "CONNECT_PAYLOAD"
                        }
                    ];
                    response = {
                        "attachment": templateGenerator.getButtonTemplate("How can I help you with?", buttons)
                    };
                } else {
                    response = {
                        "text": `You said: "${receivedMessage.text}"`
                    };
                }
            }
        }

        // Sends the response message
        this.callSendAPI(user.fbId, response);
    },

    callSendAPI: function (senderPSID, response) {
        let requestBody = {
            "recipient": {
                "id": senderPSID
            },
            "message": response
        };

        // Send the HTTP request to the Messenger Platform
        request({
            "uri": "https://graph.facebook.com/v2.6/me/messages",
            "qs": { "access_token": process.env.PAGE_ACCESS_TOKEN },
            "method": "POST",
            "json": requestBody
        }, (err, res, body) => {
            if (!err) {
                console.log('message sent!')
            } else {
                console.error("Unable to send message:" + err);
            }
        });
    },

    askQuestion: function (user) {
        response = questionGenerator.generate(user.answers.length);

        this.callSendAPI(user.fbId, response);
    },

    // Handles messaging_postbacks events
    handlePostback: function (user, received_postback) {
        let response;

        const payload = received_postback.payload;
        const senderPSID = user.fbId;

        if (payload === 'CONNECT_PAYLOAD') {
            if (user.answers.length !== questionGenerator.numberOfQuestions) {
                this.askQuestion(user);
                return;
            }

            this.findMatchingPatients(user);
        } else if (_.startsWith(payload, "CHAT")) {
            const partnerId = payload.split(" ")[1];

            Patient.findByFbId(partnerId)
                .then((partner) => {
                    const buttons = [
                        {
                            "type": "postback",
                            "title": "Accept",
                            "payload": "ACCEPT " + senderPSID
                        },

                        {
                            "type": "postback",
                            "title": "Decline",
                            "payload": "DECLINE " + senderPSID
                        }
                    ];
                    response = {
                        "attachment": templateGenerator.getButtonTemplate(`${user.nickname} wants to talk to you`, buttons)
                    };

                    this.callSendAPI(partnerId, response);
                })
                .catch(() => {
                    console.log(err);
                });
        } else if (_.startsWith(payload, "ACCEPT")) {
            const partnerId = payload.split(" ")[1];

            Patient.findOneAndUpdate({
                fbId: partnerId
            }, {
                    $set: {
                        chatWith: user.fbId
                    }
                }).then((doc) => {
                    return Patient.findOneAndUpdate({
                        fbId: user.fbId
                    }, {
                            $set: {
                                chatWith: partnerId
                            }
                        });
                }).then((doc) => {
                    response = {
                        "text": "You can start chatting now"
                    };

                    this.callSendAPI(user.fbId, response);
                    this.callSendAPI(partnerId, response);
                }).catch((err) => {
                    console.log(err);
                });
        } else if (_.startsWith(payload, "Question")) {
            Patient.findByIdAndUpdate(user._id, {
                $push: {
                    answers: payload.split(" ")[1]
                }
            }, { new: true }).then((patient) => {
                if (patient.answers.length === questionGenerator.numberOfQuestions) {
                    this.findMatchingPatients(patient);
                    return;
                }
                this.askQuestion(patient);
            }).catch((err) => {
                console.log(err);
            });
        } else if (payload === 'SEE_NEWS') {
            this.displayNews(user);
        }
    },

    displayNews: function (user) {
        newsFetcher.fetch()
            .then((news) => {
                let response = {
                    "attachment": {
                        "type": "template",
                        "payload": {
                            "template_type": "generic",
                            "elements": news.map((theNew) => {
                                return {
                                    "title": theNew.name,
                                    "subtitle": theNew.snippet,
                                    "buttons": [
                                        {
                                            "type": "web_url",
                                            "url": theNew.url,
                                            "title": "View Website"
                                        }
                                    ]
                                }
                            })
                        }
                    }
                };

                this.callSendAPI(user.fbId, response);
            })
            .catch((err) => {
                console.log(err);
            });

    },

    findMatchingPatients: function (user) {
        Patient.findMatchingPatients(user)
            .then((patients) => {
                console.log('Returned', patients);

                response = {
                    "attachment": {
                        "type": "template",
                        "payload": {
                            "template_type": "generic",
                            "elements": patients.map((patient) => {
                                return {
                                    "title": patient.nickname,
                                    "subtitle": "He is a good match for you",
                                    "buttons": [
                                        {
                                            "type": "postback",
                                            "title": "Request to chat",
                                            "payload": "CHAT " + patient.fbId
                                        }
                                    ]
                                }
                            })
                        }
                    }
                };

                this.callSendAPI(user.fbId, response);
            })
            .catch((err) => {
                console.log(err);
            });

    },

    buildListReponse: function (list) {
        return list.map((item) => {
            return {
                "title": item.nickname,
                "subtitle": "We\'ve got the right hat for everyone.",
                "buttons": [
                    {
                        "type": "postback",
                        "title": "Start Chatting",
                        "payload": {
                            type: "CHAT_PAYLOAD",
                            partnerId: item.fbId
                        }
                    }
                ]
            };
        })
    }
}

module.exports = chatbotApi;
