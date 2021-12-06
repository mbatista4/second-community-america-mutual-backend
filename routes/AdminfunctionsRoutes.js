const router = require("express").Router();
const Teller = require('../models/Teller');
const bcryptjs = require("bcryptjs");
const {compare}= require('bcryptjs');

router.get("/", (req, res) => {
	res.status(200).json({ msg: "Connection established." });
});

module.exports = router;

router.get('/get_all_tellers', async (req,res)=>{

	const all_tellers = await Teller.find();
	return res.status(200).json(all_tellers);

});

router.post('/create_teller', async (req,res)=>{

    let {
        firstName,
        lastName,
        userId,
        password
    } = req.body;

    const userIdInUse = await Teller.findOne({userId});

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

    const newteller = new Teller({
		firstName,
		lastName,
		userId,
		password,
	});

	await newteller.save();
	return res.status(201).json({msg: "Success"})

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
		return res.status(409).json({msg: "Error: Account does not exists"});
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

	if(!userIdInUse){	
		return res.status(409).json({msg: "Error: Account does not exists!"});
	}



 	if(firstName == userIdInUse.firstName && lastName == userIdInUse.lastName){//add password check
			//all is same do nothing 
			return res.status(409).json({msg: "Error: Nothing to change"});
 	}

//else edit the collection
	if(password.length < 1){
		return res.status(409).json({msg: "Error: Password empty!"});
	}
	if(firstName.length < 1){
		return res.status(409).json({msg: "Error: First name empty!"});
	}
	if(lastName.length < 1){
		return res.status(409).json({msg: "Error: Last name empty!"});
	}

	userIdInUse.firstName = firstName;
	userIdInUse.lastName = lastName;

		//userIdInUse.password = bcryptjs.password;

		//edit the record
		await userIdInUse.save();
		return res.status(200).json({userIdInUse});
		
});


router.delete('/remove_teller', async (req,res)=>{

    let {
        userId,
    } = req.body;

	const userIdInUse = await Teller.findOne({userId});

	if(!userIdInUse){	
		return res.status(409).json({msg: "Error: Account does not exists."});
	}

	if(userIdInUse.isClockedin){
		return res.status(409).json({msg: "Error: Account is clocked in. must be clocked out to be deleted."});
	}

	await userIdInUse.delete();
	return res.status(200).json({msg: "Deleted."});
}); 
