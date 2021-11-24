const router = require('express').Router();
const BankAccount = require('../models/BankAccount');
const Member = require('../models/Member');
const Transaction = require('../models/Transaction');
const {memberAuth,tellerAuth} = require('../auth/auth');

//This returns all of the bank accounts linked to a Member
router.get('/get', memberAuth, async (req,res) =>{

    let {user} = req.user;
    let list = await BankAccount.find({owner:user});

    let bankList = [];

    bankList = list.map(mutateData);
    
    console.log(bankList);

    res.send(bankList);
});


// this method returns a single bank account 
router.get('/get/:id', async (req,res) =>{

    const {id} = req.params;
    let bankAccount = await BankAccount.findOne({_id:id});

    let transactionList = [];

    transactionList = await Transaction.find({owner: id});
    let mutatedAccount = mutateData(bankAccount);
    mutatedAccount = {... mutatedAccount, transactionList }

    console.log(transactionList);

    // if(req.user.user != bankAccount.owner){
    //    return res.status(409).json({
    //        msg: "the logged in user is not the owner of this account!"
    //    });
    // }

    res.status(200).json(mutatedAccount);
});

// this method creates a bank account and links it to a Member
router.post('/create_account', tellerAuth,async (req,res) =>{

    let {
        userId,
        accountType,
    } = req.body;
    
    let accountOwner = await Member.findOne({userId});

    if(!accountOwner) {
        return res.status(409).json({msg:`account with userId: ${userId} not found`});
    }

    let accountNumber = generate(9);
    let accountFound = await BankAccount.findOne({accountNumber});
    
    while(accountFound) {
        accountNumber = generate(9);
        accountFound = await BankAccount.findOne({accountNumber});
    }

    let newAccount = new BankAccount({
        owner: accountOwner._id,
        accountNumber,
        accountType
    });


    let savedAccount = await newAccount.save();

    console.log(savedAccount);

    return res.status(201).json({savedAccount});

});

router.post('/transaction/new/:id', tellerAuth,async (req,res) => {

    const {id} = req.params;
    const {amount, description} = req.body;

    console.log(id);

    let bankAccount = await BankAccount.findOne({_id:id});
    bankAccount.balance = bankAccount.balance + amount;

    console.log(bankAccount);

    if(bankAccount.balance < 0) {
        return res.status(409).json({msg: "insuficient funds. deposit money before attempting this transaction again"});
    }

    const newTransaction  = new Transaction({owner: id, amount, description});


    await newTransaction.save();
    await bankAccount.save();

    res.status(200).json({msg: "Transaction was sucessful"});
});

// this function generates a random number to be used as an Account number
function generate(n) {
    var add = 1, max = 12 - add;   // 12 is the min safe number Math.random() can generate without it starting to pad the end with zeros.   

    if ( n > max ) {
            return generate(max) + generate(n - max);
    }

    max        = Math.pow(10, n+add);
    var min    = max/10; // Math.pow(10, n) basically
    var number = Math.floor( Math.random() * (max - min + 1) ) + min;

    console.log(number + " here");

    return number; 
}

// this function mutates the account data to just show basic information
function mutateData(account) {
    let temp = {};
    temp.accountNumber = account.accountNumber;
    temp.balance = account.balance;
    temp._id = account._id;
    return temp;
}


module.exports = router;