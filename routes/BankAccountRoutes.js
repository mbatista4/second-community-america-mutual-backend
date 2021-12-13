const router = require('express').Router();
const BankAccount = require('../models/BankAccount');
const Member = require('../models/Member');
const Transaction = require('../models/Transaction');
const {memberAuth,tellerAuth} = require('../auth/auth');

//This returns all of the bank accounts linked to a Member
router.get('/get',memberAuth,async (req,res) =>{

    let {owner} = req.query;

    if(!owner) {
        let user = await Member.findById(req.user.user);
        owner = user.userId;
        console.log(owner);
    }

    let member = await Member.findOne({userId: owner});

    if(!member){
        return res.status(404).json({msg : "Account does not exisit"});
    }

    let list = await BankAccount.find({owner: member._id});

    let bankList = [];

    if(list.length> 0){
        bankList = list.map(mutateAccount);
    }

    res.status(200).send(bankList);
});


// this method returns a single bank account 
router.get('/get-detailed', memberAuth,async (req,res) =>{

    const {owner} = req.query;

    let bankAccount = await BankAccount.findOne({_id:owner});

    let transactionList = [];

    transactionList = await Transaction.find({owner: bankAccount._id});
    let mutatedAccount = mutateAccount(bankAccount);
    mutatedAccount = {... mutatedAccount, transactionList }
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

    return res.status(201).json(savedAccount);

});

router.post('/transaction/new', tellerAuth,async (req,res) => {
    const {amount, description,id} = req.body;

    let bankAccount = await BankAccount.findOne({_id:id});
    bankAccount.balance +=  Number.parseInt(amount);

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

    return number; 
}

// this function mutates the account data to just show basic information
function mutateAccount(account) {

    let dollarUSLocale = Intl.NumberFormat('en-US');
    
    let temp = {};
    temp.accountNumber = account.accountNumber;
    temp.balance = dollarUSLocale.format(account.balance);
    temp._id = account._id;
    temp.accountType = account.accountType;
    return temp;
}


module.exports = router;