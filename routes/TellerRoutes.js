
const router = require('express').Router();
const Teller = require('../models/Teller');

router.get('/', (req,res) =>{

});

router.post('/login', async (req,res) =>{

    let {
        userId,
        password
    } = req.body;

    const existingAccount = await Teller.findOne({userId});
    
    console.log(existingAccount.password);

    if(!existingAccount || existingAccount.password.localeCompare(password) != 0) {
       return res.status(409).json({msg: "account does not exists or password is inccorrect!"});
    }


    existingAccount.isClockedIn = true;

   let response =  await existingAccount.save();

    console.log(response);
    return res.status(200).json({response});

});

router.post('/logout/:id',async (req,res) =>{

    let {id} = req.params;

    const existingAccount = await Teller.findOne({_id: id});
    
    console.log(existingAccount);

    if(!existingAccount || !existingAccount.isClockedIn) {
       return res.status(409).json({msg: "account does not exists or or is not logged in!"});
    }

    existingAccount.isClockedIn = false;

   let response =  await existingAccount.save();

    console.log(response);
    return res.status(200).json({response});

});

// router.post('/create_account', async (req,res) =>{

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

//     const newAccount = new Teller({
//         firstName,
//         lastName,
//         userId,
//         password
//     });

//     const savedAccount = await newAccount.save();

//    return res.status(201).json({
//         msg: 'success',
//         savedAccount
//     });

// });

module.exports= router;