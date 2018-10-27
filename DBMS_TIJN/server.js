
// Prerequisites - first run:
//   npm install
//
// which will look in package.json and install all dependencies
// (e.g., express, sqlite3)
//
// To start the server, run:
//   node server.js
//
// and open the frontend webpage at http://localhost:3000/TIJN.html
//
//
// [optional] you can use nodemon to automatically restart your Node.js
// server whenever your backend files change. https://nodemon.io/
//
// Install globally using:
//
// sudo npm install -g nodemon
//
// and then start the server using:
//   nodemon server.js

const express = require('express');
const app = express();


// use this library to interface with SQLite databases: https://github.com/mapbox/node-sqlite3
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('TIJN.db');



app.use(express.static('static_files'));





// GET a list of all Bank Accounts
//
// To test, open this URL in your browser:
//   http://localhost:3000/bankaccounts
app.get('/bankaccounts', (req, res) => {
  // db.all() fetches all results from an SQL query into the 'rows' variable:
  db.all('SELECT BankID FROM BANK_ACCOUNT', (err, rows) => {
    console.log(rows);
    const allBankIds = rows.map(e => e.BankID);
    console.log(allBankIds);
    res.send(allBankIds);
  });
});


// POST data about a user to insert into the database
// (note that this will insert duplicate entries!)
//
// To test, use the web frontend interface at:
//   http://localhost:3000/TIJN.html
// use this library to parse HTTP POST requests
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true})); // hook up with your app
app.post('/bank', (req, res) => {
  console.log(req.body);

  db.run(
    'INSERT INTO BANK_ACCOUNT VALUES ($name, $id)',
    // parameters to SQL query:
    {
      $name: req.body.name,
      $id: req.body.id
    },
    // callback function to run when the query finishes:
    (err) => {
      if (err) {
        res.send({message: 'error in app.post(/bank)'});
      } else {
        res.send({message: 'successfully run app.post(/bank)'});
      }
    }
  );
});


// GET profile data for a user
//
// To test, open these URLs in your browser:
//   http://localhost:3000/banks/1
//   http://localhost:3000/banks/2
//   http://localhost:3000/banks/3
app.get('/banks/:bankid', (req, res) => {
  const nameToLookup = req.params.bankid; // matches ':bankid' above

  // db.all() fetches all results from an SQL query into the 'rows' variable:
  db.all(
    'SELECT * FROM BANK_ACCOUNT WHERE BankID=$name',
    // parameters to SQL query:
    {
      $name: nameToLookup
    },
    // callback function to run when the query finishes:
    (err, rows) => {
      console.log(rows);
      if (rows.length > 0) {
        res.send(rows[0]);
      } else {
        res.send({}); // failed, so return an empty object instead of undefined
      }
    }
  );
});


// start the server at URL: http://localhost:3000/
app.listen(3000, () => {
  console.log('Server started at http://localhost:3000/');
});
