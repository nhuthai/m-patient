const axios = require('axios');

const newsFetcher = {
    fetch: function () {
        const address = "https://api.cognitive.microsoft.com/bing/v7.0/search?q=lung+cancer+stories&count=5&mkt=\"en-us\"";

        var config = {
            headers: { "Ocp-Apim-Subscription-Key": process.env.MICROSOFT_KEY }
        };

        return axios.get(address, config)
            .then((response) => {
                console.log(response.data);
                return response.data.value;
            })
            .catch((err) => {
                console.log(err);
            });
    }
};

module.exports = newsFetcher;