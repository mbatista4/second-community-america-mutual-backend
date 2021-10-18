if (process.env.NODE_ENV !== "production") {
	require("dotenv").config();
}

const express = require("express");
const mongoose = require("mongoose");
const app = express();

app.use(express.json());

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
app.use("/member", memberRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Starting server on port ${PORT}`));
