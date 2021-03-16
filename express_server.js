const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const app = express();
const PORT = 8080;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser())


const urlDatabase = {
  'b2xVn2': 'http://www.lighthouselabs.ca',
  '9sm5xK': 'http://www.google.com'
};

function generateRandomString() {
  let string = Math.random().toString(36).substring(2, 8);
  return string;
}




//Home page
app.get('/', (req, res) => {
  res.send('Hello!');
});

//URLS page
app.get('/urls', (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    username: req.cookies["username"]
  };
  res.render('urls_index', templateVars);
});

//New URL Form
app.get('/urls/new', (req, res) => {
  const templateVars = {
    username: req.cookies["username"]
  };
  res.render('urls_new', templateVars);
});

//New URL Creation
app.post('/urls', (req, res) => {
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`/urls/${shortURL}`);
});

//URL Deletion
app.post('/urls/:shortURL/delete', (req, res) => {
  const urlToDelete = req.params.shortURL
  delete urlDatabase[urlToDelete]
  res.redirect('/urls')
})

//EDIT Long URL
app.post('/urls/:shortURL/edit', (req, res) => {
  const shortURL = req.params.shortURL;
  urlDatabase[shortURL] = req.body.longURL
  res.redirect('/urls');
});

//Sign in cookie register
app.post('/login', (req, res) => {
  res.cookie('username', req.body.username)
  res.redirect('/urls')
})
//Logout, cookie deletion
app.post('/logout', (req, res) => {
  console.log(req.cookies)
  res.clearCookie("username")
  res.redirect('/urls')
})

//Link to redirect from short URL
app.get('/u/:shortURL', (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

//URL show page
app.get('/urls/:shortURL', (req, res) => {
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    username: req.cookies["username"]
  };
  res.render('urls_show', templateVars);
});






app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
