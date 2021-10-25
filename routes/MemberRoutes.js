const router = require("express").Router();
const Member = require('../models/Member');


router.get("/", (req, res) => {
	res.status(200).json({ msg: "hello world" });
});

module.exports = router;

router.post('/member', async (req,res)=>{

	let {
		firstName,
		lastName,
		address,
		userId,
		password,
		socialSecurityNumber,
		dateOfBirth
	} = req.body;

	
	// check if ssn is already in use or bad length
	const ssnInUse = await Member.findOne({socialSecurityNumber});

	if(ssnInUse)
	{
		return res.status(409).json({msg: "SSN already in use!"});
	}

	if(socialSecurityNumber.length != 9)
	{
		return res.status(409).json({msg: "SSN invalid!"});
	}

		//		if not check if userid is in use
	const idInUse = await Member.findOne({userId});

	if(idInUse){
		//console.log(userId);
		return res.status(409).json({msg: "Account id already exists!"});
	}

		//			if not check if pwrd is not compliant
	if(password.length < 8){
		return res.status(409).json({msg: "Password not compliant!"});
	}
		//				else add to db

	const newmember = new Member({

		firstName,
		lastName,
		address,
		userId,
		password,
		socialSecurityNumber,
		dateOfBirth

	});

	await newmember.save();
	return res.status(201).json({msg: "success"})
});