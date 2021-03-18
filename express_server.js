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
    email: "teste@hotmail.com",
    password: "123"
  },
  "t9m5sK": {
    id: "t9m5sK",
    email: "user2@example.com",
    password: "test2"
  }
};


const urlDatabase = {
  b6UTx3: {longURL: "https://www.tsn.ca", userID: "bVx3n2"},
  b6UTx4: {longURL: "https://www.tsn1.ca", userID: "bVx3n2"},
  b6UTx5: {longURL: "https://www.tsn2.ca", userID: "bVx3n2"},
  b6UTxQ: {longURL: "https://www.tsn3.ca", userID: "bVx3n2"},
  i3BoGr: {longURL: "https://www.google.ca", userID: "aJ48lW"}
};

const generateRandomString = () => {
  let string = Math.random().toString(36).substring(2, 8);
  return string;
};

const emailLookup = (user, userDatabase) => {
  const {email} = user;
  for (const key in userDatabase) {
    if (email === userDatabase[key].email) {
      return userDatabase[key];
    }
  }
  return false;
};

const urlsForUser = (id) => {
  const filteredURL = {};
  for (let url in urlDatabase) {
    if (urlDatabase[url].userID === id) {
      filteredURL[url] = urlDatabase[url];
    }
  } return filteredURL;
};




//Home page
app.get('/', (req, res) => {
  res.send('Hello!');
});

//URLS page
app.get('/urls', (req, res) => {
  const user = usersDb[req.cookies["user_id"]];
  if (user) {
    const filteredURLS = urlsForUser(user.id);
    const templateVars = {
      urls: filteredURLS,
      user,
    };
    res.render('urls_index', templateVars);
  } else {
    res.redirect('/login')
  }
});

//New URL Form
app.get('/urls/new', (req, res) => {
  const user = usersDb[req.cookies["user_id"]];
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
  urlDatabase[shortURL] = {longURL: req.body.longURL, userID: req.cookies["user_id"]};
  console.log(urlDatabase);
  res.redirect(`/urls/${shortURL}`);
});

//URL Deletion
app.post('/urls/:shortURL/delete', (req, res) => {
  const urlToDelete = req.params.shortURL;
  const user = usersDb[req.cookies["user_id"]];
  if (urlDatabase[urlToDelete] && user && urlDatabase[urlToDelete].userID === user.id) {
    delete urlDatabase[urlToDelete];
    res.redirect('/urls');
  } else {
    res.status(403).send("You are not allowed!");
  }
});

//EDIT Long URL
app.post('/urls/:shortURL/edit', (req, res) => {
  if (req.cookies["user_id"]) {
    const shortURL = req.params.shortURL;
    urlDatabase[shortURL].longURL = req.body.longURL;
    console.log(urlDatabase);
    res.redirect('/urls');
  } else {
    res.status(403).send("You are not allowed!");
  }

});

//Sign in cookie register
app.get('/login', (req, res) => {
  res.render('user_login');
});
app.post('/login', (req, res) => {
  const user = emailLookup(req.body, usersDb);
  if (!user) {
    res.status(403).send("user not found");
  } else {
    if (user.password === req.body.password) {
      res.cookie('user_id', user.id).redirect('/urls');
    } else {
      res.status(403).send("wrong password!");
    }
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
  const user = usersDb[req.cookies["user_id"]];
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL].longURL,
    user,
  };

  res.render('urls_show', templateVars);
});

//Register user form
app.get('/register', (req, res) => {
  res.render('user_register');
});
app.post('/register', (req, res) => {
  const newUser = {email, password} = req.body;

  if (emailLookup(newUser, usersDb)) {
    res.status(400).send('Email already exists!');
  } else {
    const id = generateRandomString();
    usersDb[id] = {id, email, password};
    res.cookie('user_id', id);
    res.redirect('/urls');

  }
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
