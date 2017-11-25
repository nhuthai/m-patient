const mongoose = require('mongoose');

const Patient = mongoose.model('Patient', {
    fbId: {
        type: String,
        required: true
    },
    nickname: {
        type: String,
        minlength: 1,
        trim: true
    },
    disease: {
        type: String
    },
    location: {
        type: String
    },
    personalityScore: {
        type: number
    }
});

module.exports = { Patient };