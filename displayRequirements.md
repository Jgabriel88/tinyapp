## Display Requirements
-<del> Site Header
- <del>if a user is logged in, the header shows:
  - the user's email
  - a logout button which makes a POST request to /logout
- <del>if a user is not logged in, the header shows:
  - a link to the login page (/login)
  - a link to the registration page (/register)

## Behaviour Requirements

- GET /

  - <del>if user is logged in:
    - (Minor) redirect to /urls
  - <del>if user is not logged in:
    - (Minor) redirect to /login
- GET /urls

  - if user is logged in:
    - <del>returns HTML with:
    - <del>the site header (see Display Requirements above)
    - a list (or table) of URLs the user has created, each list item containing:
      - <del>a short URL
      - <del>the short URL's matching long URL
      - <del>an edit button which makes a GET request to /urls/:id
      - <del>a delete button which makes a POST request to /urls/:id/delete
      - (Stretch) the date the short URL was created
      - (Stretch) the number of times the short URL was visited
      - (Stretch) the number number of unique visits for the short URL
    - <del>(Minor) a link to "Create a New Short Link" which makes a GET request to /urls/new
  - <del>if user is not logged in:
    - returns HTML with a relevant error message
- GET /urls/new

  - <del>if user is logged in:
    - returns HTML with:
    - the site header (see Display Requirements above)
    - a form which contains:
      - a text input field for the original (long) URL
      - a submit button which makes a POST request to /urls
  - <del>if user is not logged in:
    - redirects to the /login page
- GET /urls/:id
  - if user is logged in and owns the URL for the given ID:
    - <del>returns HTML with:
    - <del>the site header (see Display Requirements above)
    - <del>the short URL (for the given ID)
    - <del>a form which contains:
      - the corresponding long URL
      - an update button which makes a POST request to /urls/:id
    - (Stretch) the date the short URL was created
    - (Stretch) the number of times the short URL was visited
    - (Stretch) the number of unique visits for the short URL
  - <del>if a URL for the given ID does not exist:
    - (Minor) returns HTML with a relevant error message
  - <del>if user is not logged in:
    - returns HTML with a relevant error message
  - <del>if user is logged it but does not own the URL with the given ID:
    - returns HTML with a relevant error message
- GET /u/:id

  - <del>if URL for the given ID exists:
    - redirects to the corresponding long URL
  - if URL for the given ID does not exist:
    - <del>(Minor) returns HTML with a relevant error message
- POST /urls

  - <del>if user is logged in:
    - generates a short URL, saves it, and associates it with the user
    - redirects to /urls/:id, where :id matches the ID of the newly saved URL
  - if user is not logged in:
    - <del>(Minor) returns HTML with a relevant error message

- POST /urls/:id

  - <del>if user is logged in and owns the URL for the given ID:
    - updates the URL
    - redirects to /urls
  - <del>if user is not logged in:
    - (Minor) returns HTML with a relevant error message
  - <del>if user is logged it but does not own the URL for the given ID:
    - (Minor) returns HTML with a relevant error message
  - POST /urls/:id/delete
  - <del>if user is logged in and owns the URL for the given ID:
    - deletes the URL
    - redirects to /urls
  - <del>if user is not logged in:
    - (Minor) returns HTML with a relevant error message
  - <del>if user is logged it but does not own the URL for the given ID:
    - (Minor) returns HTML with a relevant error message

- GET /login

  - <del>if user is logged in:
    - (Minor) redirects to /urls
  - <del>if user is not logged in:
    - returns HTML with:
    - a form which contains:
      - input fields for email and password
      - submit button that makes a POST request to /login
- GET /register

  - <del>if user is logged in:
    - (Minor) redirects to /urls
  - <del>if user is not logged in:
    - returns HTML with:
    - a form which contains:
      - input fields for email and password
      - a register button that makes a POST request to /register

- POST /login

  - <del>if email and password params match an existing user:
    - sets a cookie
    - redirects to /urls
  - <del>if email and password params don't match an existing user:
    - returns HTML with a relevant error message
- POST /register

  - <del>if email or password are empty:
    - returns HTML with a relevant error message
  - <del>if email already exists:
    - returns HTML with a relevant error message
  - <del>otherwise:
    - creates a new user
    - encrypts the new user's password with bcrypt
    - sets a cookie
    - redirects to /urls
- POST /logout

  - <del>deletes cookie
  - <del>redirects to /urls