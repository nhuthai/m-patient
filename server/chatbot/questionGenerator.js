const questions = [{
    "attachment": {
        "type": "template",
        "payload": {
            "template_type": "generic",
            "elements": [
                {
                    "title": "Question 1",
                    "subtitle": "What do you think when you go to bed?",
                    "buttons": [
                        {
                            "type": "postback",
                            "title": "Tired",
                            "payload": "Question1 1"
                        },
                        {
                            "type": "postback",
                            "title": "Tomorrow is another bad day",
                            "payload": "Question1 2"
                        },
                        {
                            "type": "postback",
                            "title": "Fine",
                            "payload": "Question1 3"
                        }
                    ]
                }
            ]
        }
    }
},{
    "attachment": {
        "type": "template",
        "payload": {
            "template_type": "generic",
            "elements": [
                {
                    "title": "Question 2",
                    "subtitle": "What do you think about the hospital?",
                    "buttons": [
                        {
                            "type": "postback",
                            "title": "Important",
                            "payload": "Question2 1"
                        },
                        {
                            "type": "postback",
                            "title": "Accept but boring",
                            "payload": "Question2 2"
                        },
                        {
                            "type": "postback",
                            "title": "I'm scared",
                            "payload": "Question2 3"
                        }
                    ]
                }
            ]
        }
    }
}, {
    "attachment": {
        "type": "template",
        "payload": {
            "template_type": "generic",
            "elements": [
                {
                    "title": "Question 3",
                    "subtitle": "How do you feel when you’re sick and your friends are okay?",
                    "buttons": [
                        {
                            "type": "postback",
                            "title": "Unfair",
                            "payload": "Question3 1"
                        },
                        {
                            "type": "postback",
                            "title": "Best wishes for them",
                            "payload": "Question3 2"
                        },
                        {
                            "type": "postback",
                            "title": "I want to meet them",
                            "payload": "Question3 3"
                        }
                    ]
                }
            ]
        }
    }
}, {
    "attachment": {
        "type": "template",
        "payload": {
            "template_type": "generic",
            "elements": [
                {
                    "title": "Question 4",
                    "subtitle": "If a friend of yours asks to you to help then,",
                    "buttons": [
                        {
                            "type": "postback",
                            "title": "Sure",
                            "payload": "Question4 1"
                        },
                        {
                            "type": "postback",
                            "title": "Okay, but just once",
                            "payload": "Question4 2"
                        },
                        {
                            "type": "postback",
                            "title": "Never",
                            "payload": "Question4 3"
                        }
                    ]
                }
            ]
        }
    }
}, {
    "attachment": {
        "type": "template",
        "payload": {
            "template_type": "generic",
            "elements": [
                {
                    "title": "Question 5",
                    "subtitle": "What do you think?",
                    "image_url": "https://image.ibb.co/h5afNm/5_test.png",
                    "buttons": [
                        {
                            "type": "postback",
                            "title": "Unnecessary",
                            "payload": "Question5 1"
                        },
                        {
                            "type": "postback",
                            "title": "Half empty",
                            "payload": "Question5 2"
                        },
                        {
                            "type": "postback",
                            "title": "Half full",
                            "payload": "Question5 3"
                        }
                    ]
                }
            ]
        }
    }
}, {
    "attachment": {
        "type": "template",
        "payload": {
            "template_type": "generic",
            "elements": [
                {
                    "title": "Question 6",
                    "subtitle": "What do you think?",
                    "image_url": "https://image.ibb.co/mEt0Nm/6_test.png",
                    "buttons": [
                        {
                            "type": "postback",
                            "title": "A hole",
                            "payload": "Question6 1"
                        },
                        {
                            "type": "postback",
                            "title": "A pyramid",
                            "payload": "Question6 2"
                        }
                    ]
                }
            ]
        }
    }
}, {
    "attachment": {
        "type": "template",
        "payload": {
            "template_type": "generic",
            "elements": [
                {
                    "title": "Question 7",
                    "subtitle": "What is your favorite image",
                    "image_url": "https://image.ibb.co/dsNANm/7_test.png",
                    "buttons": [
                        {
                            "type": "postback",
                            "title": "1",
                            "payload": "Question7 1"
                        },
                        {
                            "type": "postback",
                            "title": "2",
                            "payload": "Question7 2"
                        }, 
                        {
                            "type": "postback",
                            "title": "3",
                            "payload": "Question7 3"
                        },
                        {
                            "type": "postback",
                            "title": "4",
                            "payload": "Question7 4"
                        }
                    ]
                }
            ]
        }
    }
}, {
    "attachment": {
        "type": "template",
        "payload": {
            "template_type": "generic",
            "elements": [
                {
                    "title": "Question 8",
                    "subtitle": "Which box is bigger",
                    "image_url": "https://image.ibb.co/nPipF6/8_test.png",
                    "buttons": [
                        {
                            "type": "postback",
                            "title": "Box 1",
                            "payload": "Question8 1"
                        },
                        {
                            "type": "postback",
                            "title": "Box 2",
                            "payload": "Question8 2"
                        }
                    ]
                }
            ]
        }
    }
}];

const questionGenerator = {
    generate: function (numberOfAnsweredQuestions) {
        return questions[numberOfAnsweredQuestions];
    }
}

module.exports = questionGenerator;