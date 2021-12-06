//create_admin, login_admin, logout_admin
const router = require("express").Router();
const Teller = require('../models/Admin');
const bcryptjs = require("bcryptjs");
const {compare}= require('bcryptjs');

router.get("/", (req, res) => {
	res.status(200).json({ msg: "Connection established." });
});

module.exports = router;



router.post('/create_admin', async (req,res)=>{

    let {
        firstName,
        lastName,
        userId,
        password
    } = req.body;

    const userIdInUse = await Admin.findOne({userId});

	if(userIdInUse)
	{
		return res.status(409).json({msg: "Error: UserId already in use!"});
	}
	if(password.length < 1){
		return res.status(409).json({msg: "Error: Password empty!"});
	}
    if(firstName.length < 1){
		return res.status(409).json({msg: "Error: First name empty!"});
	}
    if(lastName.length < 1){
		return res.status(409).json({msg: "Error: Last name empty!"});
	}

    const newAdmin = new Admin({
		firstName,
		lastName,
		userId,
		password,
	});

	await newAdmin.save();
	return res.status(201).json({msg: "Success"})

});

router.post('/login', async (req,res) =>{

    let {
        userId,
        password
    } = req.body;

    const existingAccount = await Admin.findOne({userId});

    if(!existingAccount) {
       return res.status(409).json({msg: "account does not exists!"});
    }
    
    let isSame = await compare(password,existingAccount.password); 
    
    if(!isSame) {
        return res.status(409).json({msg: "Password is incorrect!"});
    }
    

    if(existingAccount.isClockedIn) {
        return res.status(409).json({msg: "Error: You are logged in somewhere else. you have to logout first"});
    }


    existingAccount.isClockedIn = true;

    const token = jwt.sign({
        user: existingAccount._id,
        type: 'Admin'
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

    const existingAccount = await Admin.findOne({_id: id});
    
    if(!existingAccount || !existingAccount.isClockedIn) {
       return res.status(409).json({msg: "account does not exists or or is not logged in!"});
    }

    existingAccount.isClockedIn = false;

   let response =  await existingAccount.save();

    console.log("logged out");
    return res.status(200).json({response});
});
