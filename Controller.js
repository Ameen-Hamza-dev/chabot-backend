const mongoose = require("mongoose");
const studentDB = require('./model')
const dialogflow = require("@google-cloud/dialogflow");
const nodemailer = require("nodemailer");
require('dotenv').config()
var Mailgen = require('mailgen');

const getData = (req, res) => {
    res.send("Welcome to Dawood UET chatbot backend")
}

const details = async (agent, name, email, phone, number, depart, id) => {

    await agent.add(`${name[0]} ${name[1] ? name[1] : ''} your form request for admission test is submitted successfully 👋 for (${depart}) depart your email is (${email}), phone number (${phone}) and your marks is (${number}) . Check portal after 24 Hours. Please connect with portal for further details. From server side`);
    await agent.add(`Your tracking id is ${id}. Please keep this id for further details`);
    await agent.add(`Check your email for further details!`);
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
    }
    else {
        try {

            await mongoose.connect(process.env.MONGO_URI);
            console.log("Database Connect Successfully");

            await studentDB.create({ name: name[0] + " " + name[1], email: email[0], phone: phone[0], number: number[0], depart: depart[0] });

            const track_id = await studentDB.findOne({ email })

            const config = {
                service: "gmail",
                auth: {
                    user: process.env.NODEMAILER_EMAIL,
                    pass: process.env.NODEMAILER_PASS,
                },
            }

            console.log("Run")
            const transporter = nodemailer.createTransport(config);

            var mailGenerator = new Mailgen({
                theme: 'default',
                product: {
                    name: 'Dawood University Of Engineering & Technology',
                    link: 'https://duet.edu.pk/',
                    logo: 'https://download.logo.wine/logo/Shoppers_Drug_Mart/Shoppers_Drug_Mart-Logo.wine.png'
                }
            });

            var mailgenEmail = {
                body: {
                    name: name,
                    intro: 'Welcome to Dawood University! We\'re very excited to have you on board.',
                    table: {
                        data: [
                            {
                                name: name,
                                email: email,
                                phone: phone,
                                depart: depart,
                                tracking_id: track_id._id
                            }
                        ]
                    },
                }
            };

            const response = {
                from: process.env.NODEMAILER_EMAIL,
                to: email,
                subject: "Hello ✔",
                text: "Congratulation 🙌 your form submitted successfully keep connect with portal for further details",
                html: mailGenerator.generate(mailgenEmail),
            }

            console.log("first")

            details(agent, name, email, phone, number, depart, track_id._id)

            await transporter.sendMail(response);

        } catch (error) {
            console.log(error.message);
            console.log("Error")
        }

    }
}


module.exports = { book, getData }