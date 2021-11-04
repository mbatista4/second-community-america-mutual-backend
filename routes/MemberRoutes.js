const bcryptjs = require("bcryptjs");
const router = require("express").Router();
const Member = require('../models/Member');
const jwt = require('jsonwebtoken');


router.get("/", (req, res) => {
	res.status(200).json({ msg: "Connection established." });
});

module.exports = router;

router.post('/register_member', async (req,res)=>{

	let {
		firstName,
		lastName,
		address,
		userId,
		password,
		socialSecurityNumber,
		dateOfBirth,
	} = req.body;

	
	const ssnInUse = await Member.findOne({socialSecurityNumber});

	if(ssnInUse)
	{
		return res.status(409).json({msg: "SSN already in use!"});
	}

	if(socialSecurityNumber.length != 9)
	{
		return res.status(409).json({msg: "SSN invalid!"});
	}

	const idInUse = await Member.findOne({userId});

	if(idInUse){
		//console.log(userId);
		return res.status(409).json({msg: "Account id already exists!"});
	}

	
	if(password.length < 8){
		return res.status(409).json({msg: "Password not compliant!"});
	}
	
	const salt = await bcryptjs.genSalt();
	const hashedPassword = await bcryptjs.hash(password, salt);


	const newmember = new Member({

		firstName,
		lastName,
		address,
		userId,
		password : hashedPassword,
		socialSecurityNumber,
		dateOfBirth

	});

	await newmember.save();
	return res.status(201).json({msg: "success"})
});


router.post('/login_member', async (req,res)=>{

	let {
		userId,
		password,
	} = req.body;

    const existingAccount = await Member.findOne({userId});

	console.log(existingAccount)

	let isPassword = await bcryptjs.compare(password,existingAccount.password);

    if(!existingAccount || !isPassword) {
       return res.status(409).json({msg: "account does not exists or password is inccorrect!"});
    }


 	const token = jwt.sign({
        user: existingAccount._id,
	},process.env.SECRET,{expiresIn: '1h'});

	return res.status(200).json(token);

});
