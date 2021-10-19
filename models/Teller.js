const mongoose = require('mongoose');

const tellerSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        require: true
    },
    isClockedIn: {
        type: Boolean,
        required: true,
        default: false
    }
});


const Teller = mongoose.model('Teller', tellerSchema);
module.exports = Teller;