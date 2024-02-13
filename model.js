/********************************
* File name: Model.js 			*
* Author: Ameen Hamza			*
* Output: Model for orders 	*
********************************/

const { Schema, model } = require('mongoose');

const studentForm = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        },
        number: {
            type: String,
            required: true
        },
        depart: {
            type: String,
            required: true
        },
    })

const studentDB = model('DUETForm', studentForm)
module.exports = studentDB
