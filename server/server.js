const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');

const app = express();

const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});