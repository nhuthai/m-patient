

const templateGenerator = {
    getButtonTemplate: function (text, buttons) {
        return {
            "type": "template",
            "payload": {
                "template_type": "button",
                "text": text,
                "buttons": buttons
            }
        };
    },
    getGenericTemplate: function (title, subtitle, image, buttons) {
        return {
            "payload": {
                "template_type": "generic",
                "elements": [
                    {
                        "title": title,
                        "image_url": image,
                        "subtitle": subtitle,
                        "buttons": buttons
                    }
                ]
            }
        }
    }
};

module.exports = templateGenerator;