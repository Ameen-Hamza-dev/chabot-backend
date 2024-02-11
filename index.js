const dialogflow = require("@google-cloud/dialogflow");
const { WebhookClient } = require("dialogflow-fulfillment");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose"); // Import mongoose for database operations
const studentDB = require('./model')
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.SERVER_PORT || 4000;

// Define intent handlers
function hi(agent) {
    console.log(`intent  =>  hi`);
    agent.add("Hi👋, welcome to Dawood University how can i assist you today? From Server");
}

async function book(agent) {
    const { name, email, phone, number, depart } = agent.parameters;
    console.log(name);
    console.log(email);
    console.log(phone);
    console.log(number)
    console.log(depart)


    if (!name || !email || !phone || !number || !depart) {
        console.log("Please fill all the fields!")
    } else {
        try {
            // Connect to the database (you should replace this with your actual database connection)
            await mongoose.connect(process.env.MONGO_URI);

            console.log("Database Connect Successfully");

            await studentDB.create({ name, email, phone, number, depart });

            agent.add(`${name[0]} ${name[1] ? name[1] : ''} your form request is submitted successfully 👋 for (${depart}) depart your email is (${email}), phone number (${phone}) and your marks is (${number}) . Check portal after 24 Hours. Please connect with portal for further details. From server side`);

        } catch (error) {
            console.log(error.message);
        }

    }
}

// Create the intentMap
const intentMap = new Map();
intentMap.set('Default Fallback Intent', hi);
intentMap.set('Take Admission', book);

app.post("/webhook", async (req, res) => {
    const agent = new WebhookClient({ request: req, response: res });
    var id = (res.req.body.session).substr(43);
    console.log(id);

    agent.handleRequest(intentMap); // Handle the request using the intentMap
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});



