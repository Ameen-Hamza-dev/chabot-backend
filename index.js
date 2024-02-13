const { WebhookClient } = require("dialogflow-fulfillment");
const express = require("express");
const cors = require("cors");
const { book, getData } = require('./Controller');
require('dotenv').config()

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.SERVER_PORT || 4000;

const intentMap = new Map();
intentMap.set('Take Admission', book);

app.post("/webhook", async (req, res) => {
    const agent = new WebhookClient({ request: req, response: res });
    var id = (res.req.body.session).substr(43);

    agent.handleRequest(intentMap);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});



