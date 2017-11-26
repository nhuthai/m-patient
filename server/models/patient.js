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

PatientSchema.statics.findByFbId = function(fbId) {
    return this.findOne({fbId});
};

PatientSchema.statics.findMatchingPatients = function(user) {
    return this.find({_id: {$ne: user._id}})
                .then((patients) => {
                    console.log(patients);
                    const filterPatients = patients.map((patient) =>  JSON.stringify(_.pick(patient, ['fbId', 'disease', 'psyScore'])));
                    
                    console.log(filterPatients);

                    const res = server.getUser(user.answers, filterPatients);
                    console.log(res);
                })
                .catch((err) => {
                    console.log(err);
                });
    /* return this.findByFbId(fbId)
                .then((patient) => {
                    if (!patient) {
                        return Promise.reject();
                    }

                    // find all patients with the same disease, but not the current user
                    return this.find({
                        disease: patient.disease,
                        fbId: {$ne: patient.fbId} 
                    });
                }); */
}

const Patient = mongoose.model('Patient', PatientSchema);

module.exports = { Patient };