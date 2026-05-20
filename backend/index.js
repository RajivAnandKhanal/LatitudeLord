const express = require("express");
const { connectToMongoDb } = require("./connection");
const app = express();
const PORT = 8080;

// routes
const userAuthRoute = require("./routes/userRoute");

connectToMongoDb("mongodb://127.0.0.1:27017/LatitudeLord-database").then(() => {
  console.log("Server connected to Database");
});
app.use(express.json());

// registered routes
app.use("/signup", userAuthRoute);

app.listen(PORT, () => console.log(`server started @ ${PORT}`));
