
const router = require('express').Router();
const jwt = require('jsonwebtoken');
const Teller = require('../models/Teller');
const {compare, hash, genSalt}= require('bcryptjs');
const {tellerAuth}  = require('../auth/auth');

router.post('/login', async (req,res) =>{

    let {
        userId,
        password
    } = req.body;

    const existingAccount = await Teller.findOne({userId});

    if(!existingAccount) {
       return res.status(409).json({msg: "account does not exists!"});
    }
    
    let isSame = await compare(password,existingAccount.password); 
    
    if(!isSame) {
        return res.status(409).json({msg: "Password is incorrect!"});
    }
    

    if(existingAccount.isClockedIn) {
        return res.status(409).json({msg: "Teller is logged in somewhere else. you have to logout first"});
    }


    existingAccount.isClockedIn = true;

    const token = jwt.sign({
        user: existingAccount._id,
        type: 'teller'
    },process.env.SECRET,{expiresIn: '8h'});

    //let older_token = jwt.sign({ type: 'teller', iat: Math.floor(Date.now() / 1000) - 30 }, process.env.SECRET, {expiresIn: 1});

    try {
        let response =  await existingAccount.save();

        console.log(response._id);
    } catch (error) {
        console.log(error);
        return res.status(500).json({msg: "An error occurred when trying to login. please try again in a few minutes",error});
    }

    return res.status(200).json(token);
});

router.post('/logout', tellerAuth ,async (req,res) =>{

    let _id = req.user.user;

    const existingAccount = await Teller.findOne({_id});

    console.log(existingAccount);
    
    if(!existingAccount || !existingAccount.isClockedIn) {
       return res.status(409).json({msg: "account does not exists or is not logged in!"});
    }

    existingAccount.isClockedIn = false;

   let response =  await existingAccount.save();

    console.log("logged out");
    return res.status(200).json({response});
});


router.post('/create_account', async (req,res) =>{

    let {
        firstName,
        lastName,
        userId,
        password
    } = req.body;
  const existingAccount = await Teller.findOne({userId});

    if(existingAccount) {
        return res.status(409).json({
            msg: `an existing user with the id ${userId} already exists`
        });
    }

    let salt = await genSalt(15);
    let ePassword = await hash(password,salt);


    const newAccount = new Teller({
        firstName,
        lastName,
        userId,
        password: ePassword
    });

    const savedAccount = await newAccount.save();

   return res.status(201).json({
        msg: 'success',
        savedAccount
    });

});

module.exports= router;