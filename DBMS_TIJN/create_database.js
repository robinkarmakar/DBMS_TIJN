const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('TIJN.db');


db.serialize(() => {
  // create a new database table:
  db.run("CREATE TABLE BANK_ACCOUNT (BankID INT, BANumber INT PRIMARY KEY NOT NULL)");

  // insert 3 rows of data:
  db.run("INSERT INTO BANK_ACCOUNT VALUES (1, 1)");
  db.run("INSERT INTO BANK_ACCOUNT VALUES (2,2)");
  db.run("INSERT INTO BANK_ACCOUNT VALUES (3,3)");

  console.log('successfully created the bank table in TIJN.db');

  // print them out to confirm their contents:
  db.each("SELECT BankID,BANumber FROM BANK_ACCOUNT", (err, row) => {
      console.log(row.BankID + ": " + row.BANumber);
  });
});

db.close();
