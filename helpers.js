const generateRandomString = () => {
  let string = Math.random().toString(36).substring(2, 8);
  return string;
};


//receives the req.body object after the login submission, the user data base, and check if the email entered in the form exists in the database.
//if so, it returns the full user ubject, if not false.
const emailLookup = (user, userDatabase) => {
  const email = user;
  for (const key in userDatabase) {
    if (email === userDatabase[key].email) {
      return userDatabase[key];
    }
  }
  return false;
};

//find all the urls created by an user and return an object with it.
const urlsForUser = (id, urlDatabase) => {
  const filteredURL = {};
  for (let url in urlDatabase) {
    if (urlDatabase[url].userID === id) {
      filteredURL[url] = urlDatabase[url];
    }
  } return filteredURL;
};


module.exports = {generateRandomString, emailLookup, urlsForUser};