const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');

const { mongoose } = require('./db/mongoose');
const { getCurrentPatient } = require('./middleware/getCurrentPatient');
const chatbotAPI = require('./chatbot/chatbotAPI');
const app = express();

const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get('/webhook', (req, res) => {

    const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

    // Parse params from the webhook verification request
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];

    // Check if a token and mode were sent
    if (mode && token) {

        // Check the mode and token sent are correct
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {

            // Respond with 200 OK and challenge token from the request
            console.log('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);

        } else {
            // Responds with '403 Forbidden' if verify tokens do not match
            res.sendStatus(403);
        }
    }
});

app.post('/webhook', getCurrentPatient, (req, res) => {
    const { user, webhookEvent } = req.body;

    if (webhookEvent.message) {
        chatbotAPI.handleMessage(user, webhookEvent.message);
    } else if (webhookEvent.postback) {
        chatbotAPI.handlePostback(user, webhookEvent.postback);
    }

    res.status(200).send('EVENT_RECEIVED');
});

app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});
