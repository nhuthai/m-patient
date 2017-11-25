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

PatientSchema.statics.findByFbId = function(fbId) {
    return this.findOne({fbId})
                .then((patient) => {
                    return !!patient;
                });
};

const Patient = mongoose.model('Patient', PatientSchema);

module.exports = { Patient };