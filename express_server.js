const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cookieSession = require('cookie-session');
const {generateRandomString, emailLookup, urlsForUser} = require('./helpers');

const app = express();
const PORT = 8080;

app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2'],
}));

const usersDb = {
  "bVx3n2": {
    id: "bVx3n2",
    email: "teste@hotmail.com",
    password: bcrypt.hashSync("123", 10)
  },
  "t9m5sK": {
    id: "t9m5sK",
    email: "user2@example.com",
    password: bcrypt.hashSync("test2", 10)
  }
};

const urlDatabase = {
  b6UTx3: {longURL: "https://www.tsn.ca", userID: "bVx3n2"},
  b6UTx4: {longURL: "https://www.tsn1.ca", userID: "bVx3n2"},
  b6UTx5: {longURL: "https://www.tsn2.ca", userID: "bVx3n2"},
  b6UTxQ: {longURL: "https://www.tsn3.ca", userID: "bVx3n2"},
  i3BoGr: {longURL: "https://www.google.ca", userID: "aJ48lW"}
};

//Home page
app.get('/', (req, res) => {
  res.redirect('/urls');
});

//URLS page
app.get('/urls', (req, res) => {
  const user = usersDb[req.session["user_id"]];
  if (user) {
    const filteredURLS = urlsForUser(user.id, urlDatabase);
    const templateVars = {
      urls: filteredURLS,
      user,
    };
    res.render('urls_index', templateVars);
  } else {
    res.render('error_403')
  }
});

//New URL Form
app.get('/urls/new', (req, res) => {
  const user = usersDb[req.session["user_id"]];
  const templateVars = {
    user,
  };
  if (!user) {
    res.redirect('/login');
  } else {
    res.render('urls_new', templateVars);
  }
});

//New URL Creation
app.post('/urls', (req, res) => {
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = {longURL: req.body.longURL, userID: req.session["user_id"]};
  res.redirect(`/urls/${shortURL}`);
});

//URL Deletion
app.post('/urls/:shortURL/delete', (req, res) => {
  const urlToDelete = req.params.shortURL;
  const user = usersDb[req.session["user_id"]];
  if (urlDatabase[urlToDelete] && user && urlDatabase[urlToDelete].userID === user.id) {
    delete urlDatabase[urlToDelete];
    res.redirect('/urls');
  } else {
    res.render('error_403');
  }
});

//EDIT Long URL
app.post('/urls/:shortURL/edit', (req, res) => {
  if (req.session["user_id"]) {
    const shortURL = req.params.shortURL;
    urlDatabase[shortURL].longURL = req.body.longURL;
    res.redirect('/urls');
  } else {
    res.render('error_403');
  }
});

//Sign in cookie register
app.get("/login", (req, res) => {
  const user = usersDb[req.session["user_id"]];
  const templateVars = {user_id: req.session["user_id"], user};
  if (user) {
    res.redirect('/urls')
  } else {
    res.render("user_login", templateVars);
  }
});
app.post('/login', (req, res) => {
  const user = emailLookup(req.body.email, usersDb);
  if (!user) {
    res.render('error_email');
  } else {
    if (bcrypt.compareSync(req.body.password, user.password)) {
      req.session["user_id"] = user.id;
      res.redirect('/urls');
    } else {
      res.render('error_password')
    }
  }
});

//Logout, cookie deletion
app.post('/logout', (req, res) => {
  req.session['user_id'] = null;
  res.redirect('/urls');
});

//Link to redirect from short URL
app.get("/u/:shortURL", (req, res) => {
  if (!urlDatabase[req.params.shortURL]) {
    res.render('error_404')
  } const longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);
});

//URL show page
app.get('/urls/:shortURL', (req, res) => {
  if (!urlDatabase[req.params.shortURL]) {
    res.render('error_404')
  }
  if (urlDatabase[req.params.shortURL].userID !== req.session["user_id"]) {
    res.render('error_403')
  }
  const user = usersDb[req.session["user_id"]];
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL].longURL,
    user,
  };
  if (!user) {
    res.status(403).send("You do not have access.")
  } else {
    res.render('urls_show', templateVars);
  }
});

//Register user form
app.get('/register', (req, res) => {
  const user = usersDb[req.session["user_id"]];
  const templateVars = {user_id: req.session["user_id"], user};
  res.render("user_register", templateVars);
});
app.post('/register', (req, res) => {
  if (!req.body.email || !req.body.password) {
    res.status(400).send("Email and password are mandatory!");
    return;
  }
  let {email, password} = req.body;
  const newUser = {email, password};
  password = bcrypt.hashSync(password, 10);
  if (emailLookup(newUser.email, usersDb)) {
    res.render('error_emailExists');
    res.redirect("/register");
  } else {
    const id = generateRandomString();
    usersDb[id] = {id, email, password};
    req.session["user_id"] = id;
    res.redirect('/urls');
  }
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
