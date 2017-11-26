const { Patient } = require('./../models/patient');

const getCurrentPatient = (req, res, next) => {
    let body = req.body;

    if (body.object === 'page') {

        // Iterate over each entry - there may be multiple if batched
        body.entry.forEach(function (entry) {

            // Get the webhook event. entry.messaging is an array, but 
            // will only ever contain one event, so we get index 0
            let webhookEvent = entry.messaging[0];

            // Get the sender PSID
            let senderId = webhookEvent.sender.id;

            Patient.findByFbId(senderId)
            .then((doc) => {
                if (!doc) {
                    const patient = new Patient({
                        fbId: senderPSID
                    });

                    return patient.save();
                }

                req.user = doc;
                req.webhookEvent = webhookEvent;
                next();
            })
            .then((doc) => {
                console.log('Save successfully', doc);
                req.user = doc;
                req.webhookEvent = webhookEvent;
                next();
            })
            .catch((err) => {
                console.log('Unable to save', err);
                res.sendStatus(400);
            });
        });
    } else {
        // Return a '404 Not Found' if event is not from a page subscription
        res.sendStatus(404);
    }
};

module.exports = { getCurrentPatient }