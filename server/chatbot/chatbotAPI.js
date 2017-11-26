const request = require('request');
const { Patient } = require('./../models/patient');
const _ = require('lodash');

const chatbotApi = {
    handleMessage: function (senderPSID, receivedMessage) {
        console.log(receivedMessage);

        Patient.findByFbId(senderPSID)
            .then((doc) => {
                if (!doc) {
                    const patient = new Patient({
                        fbId: senderPSID
                    });

                    return patient.save();
                }
            })
            .then((doc) => {
                console.log('Save successfully', doc);
            })
            .catch((err) => {
                console.log('Unable to save', err);
            });

        let response;
        if (receivedMessage.nlp && !_.isEmpty(receivedMessage.nlp.entities)) {

            const entities = receivedMessage.nlp.entities;
            console.log(entities);

            if (entities.intent && entities.intent.length > 0) {
                const intent = entities.intent[0];
                if (intent.value === "talk_action" && intent.confidence > 0.6) {
                    // Create the payload for a basic text message
                    response = {
                        "text": `Ok, set up the chat with ${entities.person[0].value}`
                    };
                }
            }
        }
        else {
            if (receivedMessage.text) {
                if (receivedMessage.text === "Show me") {
                    response = {
                        "attachment": {
                            "type": "template",
                            "payload": {
                                "template_type": "button",
                                "text": "What do you want to do next?",
                                "buttons": [
                                    {
                                        "type": "web_url",
                                        "url": "https://www.messenger.com",
                                        "title": "Visit Messenger"
                                    },

                                    {
                                        "type": "postback",
                                        "title": "Connect you with someone",
                                        "payload": "CONNECT_PAYLOAD"
                                    }
                                ]
                            }
                        }
                    };
                } else {
                    response = {
                        "text": `You said: "${receivedMessage.text}"`
                    };
                }
            }
        }

        // Sends the response message
        this.callSendAPI(senderPSID, response);
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

    // Handles messaging_postbacks events
    handlePostback: function (senderPSID, received_postback) {
        let response;

        console.log(received_postback);

        if (received_postback.payload === 'CONNECT_PAYLOAD') {
            Patient.findMatchingPatients(senderPSID)
                .then((patients) => {
                    if (!patients) {
                        return;
                    }

                    console.log('Num', patients.length);

                    response = {
                        "attachment": {
                            "type": "template",
                            "payload": {
                                "template_type": "generic",
                                "elements": [
                                    {
                                        "title": "Welcome to Peter\'s Hats",
                                        "subtitle": "We\'ve got the right hat for everyone.",
                                        "buttons": [
                                            {
                                                "type": "postback",
                                                "title": "Start Chatting",
                                                "payload": "CHAT " + patients[0].fbId
                                            }
                                        ]
                                    },
                                    {
                                        "title": "Another person",
                                        "subtitle": "We\'ve got the right hat for everyone.",
                                        "buttons": [
                                            {
                                                "type": "postback",
                                                "title": "Start Chatting",
                                                "payload": "CHAT " + patients[0].fbId
                                            }
                                        ]
                                    }
                                ]
                            }
                        }
                    };

                    console.log(response);

                    // Sends the response message
                    this.callSendAPI(senderPSID, response);
                }).catch((err) => {
                    console.log(err);
                });
        }
    },

    buildListReponse: function (list = []) {
        return list.map((item) => {
            return {
                "title": item.nickname,
                "image_url": "https://petersfancybrownhats.com/company_image.png",
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
