/********************************
* File name: Model.js 			*
* Author: Ameen Hamza			*
* Output: Model for orders 	*
********************************/

const { Schema, model } = require('mongoose');

const studentForm = new Schema(
    {
        name: {
            type: Array,
            required: true
        },
        email: {
            type: Array,
            required: true
        },
        phone: {
            type: Array,
            required: true
        },
        number: {
            type: Array,
            required: true
        },
        depart: {
            type: Array,
            required: true
        },
    })

const studentDB = model('DUETForm', studentForm)
module.exports = studentDB
