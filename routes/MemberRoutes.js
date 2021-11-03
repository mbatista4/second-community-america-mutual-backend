const router = require("express").Router();
const Member = require('../models/Member');


router.get("/", (req, res) => {
	res.status(200).json({ msg: "Connection established." });
});

module.exports = router;

router.post('register_member', async (req,res)=>{

	let {
		firstName,
		lastName,
		address,
		userId,
		password,
		socialSecurityNumber,
		dateOfBirth,
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


router.post('/login_member', async (req,res)=>{


	let {

		userId,
		password,

	} = req.body;


    const existingAccount = await Member.findOne({userId});





    if(!existingAccount || existingAccount.password.localeCompare(password) != 0) {
       return res.status(409).json({msg: "account does not exists or password is inccorrect!"});
    }



    existingAccount.isLoggdIn = true;

 const token = jwt.sign({
        user: existingAccount._id,
	},process.env.SECRET,{expiresIn: '8h'});



	try {
        let response =  await existingAccount.save();

        console.log(response._id);
    } catch (error) {
        console.log(error);
        return res.status(500).json({msg: "An error occured when trying to login. please try again in a few minutes",error});
    }


	return res.status(200).json(token);


});






router.post('logout_member/:id', async (req,res)=>{

    let {id} = req.params;

    const Account = await Member.findOne({_id: id});

	Account.isClockedIn = false;

	let response =  await Account.save();
 
	 console.log("logged out");
	 return res.status(200).json({response});
});
