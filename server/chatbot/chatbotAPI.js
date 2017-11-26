const request = require('request');
const _ = require('lodash');

const templateGenerator = require('./templateGenerator');
const { Patient } = require('./../models/patient');

const chatbotApi = {
    handleMessage: function (user, receivedMessage) {
        console.log(receivedMessage);

        let response;

        if (user.chatWith) {
            response = {
                "text": `${user.chatWith}> ${receivedMessage.text}`
            };

            this.callSendAPI(user.chatWith, response);
            return;
        }
        else if (receivedMessage.nlp && !_.isEmpty(receivedMessage.nlp.entities)) {

            const entities = receivedMessage.nlp.entities;
            console.log(entities);

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
                            "type": "web_url",
                            "url": "https://www.messenger.com",
                            "title": "Visit Messenger"
                        },

                        {
                            "type": "postback",
                            "title": "Connect you with someone",
                            "payload": "CONNECT_PAYLOAD"
                        }
                    ];
                    response = {
                        "attachment": templateGenerator.getButtonTemplate("What do you want to do next?", buttons)
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

    // Handles messaging_postbacks events
    handlePostback: function (user, received_postback) {
        let response;

        const payload = received_postback.payload;
        const senderPSID = user.fbId;

        if (payload === 'CONNECT_PAYLOAD') {
            Patient.findMatchingPatients(user.fbId)
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
                                        "image_url": "https://lh3.googleusercontent.com/lPyBqqsCQ9MObJJk-WA67WpOre3mMaEV_FY_CKkpypXfBD1y7OFIKtPdidrQTvBusNnobdf0LH0oLLi_CPD4ISXEvsbIIAbq4cBrBK0HeFUqpoH792cz0sXLBAou_UcMfzEc8vtdN239BqveA38VvimvMam69TEIU_HoncSSGE5lkmF0n1tYOOytBBAsotE82YTqbJnMeQqVTknRLC2xkdP04GGEZenAFSzaMqm-_yTeQFxuufA4eFkHh2_jwRvoLyFONe_JgcCV1dqofd9wqvqwB-t4Gi0YcpazdLZ58TV6mLimgjY6bZ3NBEbkfiUMiaOOJ3dImmEylOGiBcavvHBv5lYLzyEQvY1T-LTW4p1RphskBGWE6ECwSaBZR4MA5gZEq5JDYnaOeC7y0CQouyEajFVH-z5eioKwFuofslXFeNoyMUuYjIid4X8b1RLZPfKBwObB9uNwKPoYM3TaP4uO_Iny7Iu0FJhaRr8UxvaN0y4YFJmycMB3M_SriC-iQMjtWvNWAkMZUgrD6V9CkzF7-NCkjzBqGKYQJ-VS6wyoIE_Qzn-tCfPSn99k1FyfvKiD5X-n11FfvToPpYQurIoYW5Llsb5bREf5-lPWRhyOs9UAyv6UYrd3cfTv_tifiUlWaW6xWvvfR33UY77TB-FQ6iTjhsOTFEM=w307-h126-no",
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
                    this.callSendAPI(user.fbId, response);
                }).catch((err) => {
                    console.log(err);
                });
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
                console.log(doc);

                response = {
                    "text": "You can start chatting now"
                };

                this.callSendAPI(user.fbId, response);
                this.callSendAPI(partnerId, response);
            }).catch((err) => {
                console.log(err);
            });
        }
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
