const router = require("express").Router();
const Teller = require('../models/Teller');
const bcryptjs = require("bcryptjs");
const {compare}= require('bcryptjs');

router.get("/", (req, res) => {
	res.status(200).json({ msg: "Connection established." });
});

module.exports = router;

router.post('/create_teller', async (req,res)=>{

    let {
        firstName,
        lastName,
        userId,
        password
    } = req.body;

    const userIdInUse = await Member.findOne({userId});

	if(userIdInUse)
	{
		return res.status(409).json({msg: "userId already in use!"});
	}
	if(password.length < 1){
		return res.status(409).json({msg: "Password empty!"});
	}
    if(firstName.length < 1){
		return res.status(409).json({msg: "First name empty!"});
	}
    if(lastName.length < 1){
		return res.status(409).json({msg: "Last name empty!"});
	}

    const newteller = new Teller({
		firstName,
		lastName,
		userId,
		password,
	});

	await newteller.save();
	return res.status(201).json({msg: "success"})

});


				//workflow for edit teller

//admin types in userid the presses a button named find

//we find the record and then auto fiill the other 3 values


//admin edits firstname and or lastname and or password then presses a button labled change 

// we save changes 

				//workflow for retire teller

//admin types in teller user id
// admin presses button labled retier this account

router.post('/find_tellerByUserId', async (req,res)=>{

    let {
        userId,
    } = req.body;

    const userIdInUse = await Teller.findOne({userId});


	if(!userIdInUse) {
		return res.status(409).json({msg: "account does not exists"});
	 }

	 //return the tellers info
	 
	 return res.status(200).json(userIdInUse);
});


router.put('/edit_teller', async (req,res)=>{

	let {
        firstName,
        lastName,
        userId,
        password
    } = req.body;

	const userIdInUse = await Teller.findOne({userId});

 	if(firstName == userIdInUse.firstName && lastName == userIdInUse.lastName){//add password check
			//all is same do nothing 
			return res.status(409).json({msg: "nothing to change"});
 	}

//else edit the collection
	if(password.length < 1){
		return res.status(409).json({msg: "Password empty!"});
	}
	if(firstName.length < 1){
		return res.status(409).json({msg: "First name empty!"});
	}
	if(lastName.length < 1){
		return res.status(409).json({msg: "Last name empty!"});
	}

	userIdInUse.firstName = firstName;
	userIdInUse.lastName = lastName;

    const token = jwt.sign({
        id: user._id,
        type: 'admin'
    },process.env.SECRET,{expiresIn: '8h'}); 
	
	//userIdInUse.password = bcryptjs.password;

		//edit the record
		userIdInUse.save();
		return res.status(200).json({token: jwt.sign({userId},process.env.SECRET,{expiresIn: '1h'})});
		
});


router.delete('/remove_teller', async (req,res)=>{

//set password to empty. add if password is empty you may not log in.

}); 

