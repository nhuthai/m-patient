const mongoose = require('mongoose');

const server = require('./../ml/server');
const _ = require('lodash');

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
    },
    chatWith: {
        type: String
    },
    answers: {
        type: [Number],
        default: []
    },
    psyScore: {
        type: String
    }
});

PatientSchema.statics.findByFbId = function (fbId) {
    return this.findOne({ fbId });
};

PatientSchema.statics.findMatchingPatients = function (user) {
    return this.find({ _id: { $ne: user._id } })
        .then((patients) => {
            console.log(patients);
            //const filterPatients = patients.map((patient) =>  JSON.stringify(_.pick(patient, ['fbId', 'disease', 'psyScore'])));

            const filterPatients = patients.map((patient) => _.pick(patient, ['fbId', 'disease', 'nickname', 'psyScore']));


            return server.getUser(user.answers, filterPatients);
        })
        .catch((err) => {
            console.log(err);
        });
}

const Patient = mongoose.model('Patient', PatientSchema);

module.exports = { Patient };