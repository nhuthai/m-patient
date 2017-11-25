const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
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
        type: Number
    }
});

const Patient = mongoose.model('Patient', PatientSchema);

PatientSchema.statics.findByFbId = function(fbId) {
    return this.findOne({fbId})
                .then((patient) => {
                    return !!patient;
                });
};

module.exports = { Patient };