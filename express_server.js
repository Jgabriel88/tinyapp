const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 8080;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

const usersDb = {
  "bVx3n2": {
    id: "bVx3n2",
    email: "user@example.com",
    password: "test1"
  },
  "t9m5sK": {
    id: "t9m5sK",
    email: "user2@example.com",
    password: "test2"
  }
}

const urlDatabase = {
  'b2xVn2': 'http://www.lighthouselabs.ca',
  '9sm5xK': 'http://www.google.com'
};

const generateRandomString = () => {
  let string = Math.random().toString(36).substring(2, 8);
  return string;
};

const emailLookup = (user, userDatabase) => {
  const {email} = user
  for (const key in userDatabase) {
    if (email === userDatabase[key].email) {
      return userDatabase[key]
    }
  }
  return false
}




//Home page
app.get('/', (req, res) => {
  res.send('Hello!');
});

//URLS page
app.get('/urls', (req, res) => {
  const user = usersDb[req.cookies["user_id"]]
  const templateVars = {
    urls: urlDatabase,
    user,
  };
  res.render('urls_index', templateVars);
});

//New URL Form
app.get('/urls/new', (req, res) => {
  const user = usersDb[req.cookies["user_id"]]
  const templateVars = {
    user,
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
  const urlToDelete = req.params.shortURL;
  delete urlDatabase[urlToDelete];
  res.redirect('/urls');
});

//EDIT Long URL
app.post('/urls/:shortURL/edit', (req, res) => {
  const shortURL = req.params.shortURL;
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect('/urls');
});

//Sign in cookie register
app.get('/login', (req, res) => {
  res.render('user_login')
})
app.post('/login', (req, res) => {
  const user = emailLookup(req.body, usersDb)
  if (!user) {
    res.status(403).send("user not found")
  } else {
    if (user.password === req.body.password) {
      res.cookie('user_id', user.id).redirect('/urls')
    } else {res.status(403).send("wrong password!")}
  }
});


//Logout, cookie deletion
app.post('/logout', (req, res) => {
  res.clearCookie("user_id");
  res.redirect('/urls');
});

//Link to redirect from short URL
app.get('/u/:shortURL', (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

//URL show page
app.get('/urls/:shortURL', (req, res) => {
  const user = usersDb[req.cookies["user_id"]]
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    user,
  };
  res.render('urls_show', templateVars);
});

//Register user form
app.get('/register', (req, res) => {
  res.render('user_register')
})
app.post('/register', (req, res) => {
  newUser = {email, password} = req.body

  if (emailLookup(newUser, usersDb)) {
    res.status(400).send('Email already exists!')
  } else {
    id = generateRandomString()
    usersDb[id] = {id, email, password}
    res.cookie('user_id', id)
    res.redirect('/urls')

  }
})





app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
