if (process.env.NODE_ENV !== "production") {
	require("dotenv").config();
}

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

//connection to DB
mongoose.connect(
	process.env.MONGO_URI,
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
	},
	() => console.log("Connected To mongoDB server")
);

const memberRoutes = require("./routes/MemberRoutes");
const tellerRoutes = require("./routes/TellerRoutes");
app.use("/member", memberRoutes);
app.use("/teller",tellerRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Starting server on port ${PORT}`));
