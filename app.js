require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
mongoose.set("strictQuery", true);
const encrypt = require('mongoose-encryption');




const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

mongoose.connect("mongodb://0.0.0.0:27017/userDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
});


userSchema.plugin(encrypt,{secret:process.env.SECRET ,encryptedFields:['password']})

const User = new mongoose.model("User", userSchema);

app.get("/", (req, res) => {
  res.render("home");
});

app
  .route("/login")
  .get((req, res) => {
    res.render("login");
  })
  .post((req, res) => {
    const email = req.body.username;
    const password = req.body.password;
    User.findOne({email:email}, (err, foundUser) => {
      if (err) {
        console.log(err);
      } else {
        if (foundUser.password === password) {
            res.render("secrets");
        }
        res.send("Wrong password/Username");
    }
      });
    });


app
  .route("/register")
  .get((req, res) => {
    res.render("register");
  })
  .post((req, res) => {
    const newUser = new User({
      email: req.body.username,
      password: req.body.password,
    });
    newUser.save((err) => {
      if (err) {
        console.log(err);
      } else {
        res.render("secrets");
      }
    });
  });

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
