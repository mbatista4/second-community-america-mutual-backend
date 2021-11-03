
const router = require('express').Router();
const jwt = require('jsonwebtoken');
const Teller = require('../models/Teller');
const {compare}= require('bcryptjs');

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
        return res.status(500).json({msg: "An error occured when trying to login. please try again in a few minutes",error});
    }

    return res.status(200).json(token);
});

router.post('/logout/:id',async (req,res) =>{

    let {id} = req.params;

    const existingAccount = await Teller.findOne({_id: id});
    
    if(!existingAccount || !existingAccount.isClockedIn) {
       return res.status(409).json({msg: "account does not exists or or is not logged in!"});
    }

    existingAccount.isClockedIn = false;

   let response =  await existingAccount.save();

    console.log("logged out");
    return res.status(200).json({response});
});


router.post('/create_account', async (req,res) =>{

    let {
        userId,
        password
    }  = req.body;

    return res.status(200).json({token: jwt.sign({userId},process.env.SECRET,{expiresIn: '1h'})});
});
//     let {
//         firstName,
//         lastName,
//         userId,
//         password
//     } = req.body;
//   const exisitingAccount = await Teller.findOne({userId});

//     if(exisitingAccount) {
//         return res.status(409).json({
//             msg: `an existing user with the id ${userId} already exists`
//         });
//     }

//     let salt = bcryptjs.genSalt(15);
//     let ePassword = bcryptjs.hash(password,salt);


//     const newAccount = new Teller({
//         firstName,
//         lastName,
//         userId,
//         password: ePassword
//     });

//     const savedAccount = await newAccount.save();

//    return res.status(201).json({
//         msg: 'success',
//         savedAccount
//     });

// });

module.exports= router;