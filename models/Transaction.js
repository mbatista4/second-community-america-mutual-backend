const {Schema, model} = require('mongoose');

const transactionSchema = new Schema({
    amount: {
        type: Number,
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'BankAccount'
    } ,
    description: {
        type: String,
        required: true
    },
    DateCreated: {
        type: Date,
        required: true,
        default: Date.now()
    }
});


const Transaction = model('Transaction', transactionSchema);
module.exports = Transaction;