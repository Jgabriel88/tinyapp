const express = require('express');
const bodyParser = require("body-parser");
const app = express();
const PORT = 8080;

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));


const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

function generateRandomString() {
  let string = Math.random().toString(36).substring(7);
  return string;
};




//Home page
app.get("/", (req, res) => {
  res.send("Hello!");
});

//URLS page
app.get("/urls", (req, res) => {
  const templateVars = {urls: urlDatabase};
  res.render("urls_index", templateVars);
})

//New URL Form
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

//New URL Creation
app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`/urls/${shortURL}`);
});


app.get("/u/:shortURL", (req, res) => {

  res.redirect(`${urlDatabase.shortURL}`);
});

//URL show page
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = {shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL]};
  res.render("urls_show", templateVars);
});






app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
