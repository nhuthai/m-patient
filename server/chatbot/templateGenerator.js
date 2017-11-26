

const templateGenerator = {
    getButtonTemplate: function(text, buttons) {
        return {
            "type": "template",
            "payload": {
                "template_type": "button",
                "text": text,
                "buttons": buttons
            }
        };
    }
};

module.exports = templateGenerator;