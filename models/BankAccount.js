const {Schema,model} = require('mongoose');

const tellerSchema = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Member'
    },
    accountNumber: {
        type: String,
        required: true,
        unique: true
    },
    accountType: {
        type: Number,
        required: true,
        minlength: 9,
        maxlength: 10
    },
    balance: {
        type: Number,
        required: true,
        default: 0.0
    },
    dateOpened: {
        type: Date,
        required: true,
        default: Date.now()
    }
});

const BankAccount = model('BankAccount', tellerSchema);
module.exports = BankAccount;
