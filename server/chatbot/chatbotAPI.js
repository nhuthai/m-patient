const request = require('request');
const _ = require('lodash');

const chatbotApi = {
    handleMessage: function(senderPSID, receivedMessage) {
        let response;
        if (receivedMessage.nlp && !_.isEmpty(receivedMessage.nlp.entities)) {
            
            const entities = receivedMessage.nlp.entities;
            console.log(entities);
            
            if (entities.intent && entities.intent.length > 0) {
                const intent = entities.intent[0];
                if (intent.value === "talk_action" && intent.confidence > 0.6)
                    // Create the payload for a basic text message
                    response = {
                        "text": `Ok, set up the chat with ${entities.person[0].value}`
                    };
            }
        }
        else {
            if (receivedMessage.text) {
                response = {
                    "text": `You said: "${receivedMessage.text}"`
                };
            }
    
        }
    
        // Sends the response message
        callSendAPI(senderPSID, response);
    },

    callSendAPI: function(senderPSID, response) {
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
    }
}

module.exports = chatbotApi;