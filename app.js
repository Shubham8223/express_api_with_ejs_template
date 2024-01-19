const express = require('express');
const app = express();
const asyncwWrapper = require("./middleware/async.js");
const isauthenticated = require("./middleware/authenticated.js");
const notfound = require("./middleware/notfound.js");
const errorHandling = require("./middleware/errorHandling.js");
const path = require("path");
const mongoose = require('mongoose');
const {signup,alluser,login,logout}=require('./controller/auth.js')
const cookieParser = require('cookie-parser');

require("dotenv").config();
// Set the view engine before defining routes that render views
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(path.resolve(), "public")));
app.use(cookieParser());

async function connectToDB() {
    try {
      await mongoose.connect(process.env.MONGO_URI);
      console.log('Connected to MongoDB');
       } 
    catch (error) {
      console.error('Error connecting to MongoDB:', error.message);}
  }
  
  // Call the function to connect
  connectToDB();

app.route("/login")
  .get((req, res) => {
    res.render('login');
  })
  .post(login);
  
app.route("/signup")
  .get((req, res) => {
    res.render('signup');
  })
  .post(signup);
 
app.route('/logout').get(isauthenticated,logout)

app.use(notfound);
app.use(errorHandling);

app.listen(5000, () => {
  console.log("Server Running on Port 5000");
});