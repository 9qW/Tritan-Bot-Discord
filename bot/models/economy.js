const mongoose = require("mongoose");

const economySchema = mongoose.Schema({
    userId:{
        type: String,
        required: true
    },
    balance: {
        type: Number,
        required: true
    },
    daily:{
        type: Number
    }
});

module.exports = mongoose.model("Economy", economySchema, "Economy");
