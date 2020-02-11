


const mongoose = require("mongoose");

const paySchema = new mongoose.Schema({
    fullName: {
        type: String,

        required: true,
    },

    email: {
        type: String,

        required: true,
    },

    amount: {
        type: Number,

        required: true,
    },

    reference: {
        type: String,

        required: true
    }
});

const Pay = mongoose.model('Pay', paySchema);

module.exports = { Pay }   