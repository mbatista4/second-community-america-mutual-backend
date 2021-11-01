const router = require('express').Router();
const BankAccount = require('../models/BankAccount');
const Member = require('../models/Member');
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
router.get('/get/:id', memberAuth, async (req,res) =>{

    const {id} = req.params;
    let bankAccount = await BankAccount.findOne({_id:id});

    if(req.user.user != bankAccount.owner){
       return res.status(409).json({
           msg: "the logged in user is not the owner of this account!"
       });
    }

    res.status(200).json(bankAccount);
});

// this method creates a bank account and links it to a Member
router.post('/create_account',  tellerAuth, async (req,res) =>{

    let {
        id,
        accountType,
    } = req.body;
    
    let accountNumber = generate(9);
    let accountFound = await BankAccount.findOne({accountNumber});
    
    while(accountFound) {
        accountNumber = generate(9);
        accountFound = await BankAccount.findOne({accountNumber});
    }


    let newAccount = new BankAccount({
        owner: id,
        accountNumber,
        accountType
    });


    let savedAccount = await newAccount.save();

    console.log(savedAccount);

    return res.status(201).json({savedAccount});


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