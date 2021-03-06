const axios = require('axios');

const { Patient } = require('./../models/patient');

const newsFetcher = {
    fetch: function (user) {
        const disease = encodeURIComponent(user.disease);

        const address = `https://api.cognitive.microsoft.com/bing/v7.0/search?q=${disease}+stories&count=5&mkt=\"en-us\"`;

        var config = {
            headers: { "Ocp-Apim-Subscription-Key": process.env.MICROSOFT_KEY }
        };

        return axios.get(address, config)
            .then((response) => {
                console.log(response.data);
                return response.data.webPages.value;
            })
            .catch((err) => {
                console.log(err);
            });
    }
};

module.exports = newsFetcher;