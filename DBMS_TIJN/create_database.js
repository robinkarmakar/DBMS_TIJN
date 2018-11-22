const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('TIJN.db');


db.serialize(() => {
    // create a new database table:
    db.run("CREATE TABLE BANK_ACCOUNT (BankID INT NOT NULL, BANumber INT NOT NULL,  PRIMARY KEY (BankID, BANumber))");
    db.run("CREATE TABLE HAS_ADDITIONAL (SSN INT PRIMARY KEY NOT NULL, BANumber INT, BankID INT,Verified INT, FOREIGN KEY(BANumber) REFERENCES BANK_ACCOUNT(BANumber), FOREIGN KEY(BankID) REFERENCES BANK_ACCOUNT(BankID))");
    db.run("CREATE TABLE USER_ACCOUNT(SSN INT PRIMARY KEY NOT NULL, Name TEXT, Balance INT, BankID INT, BANumber INT, PBVerified INT,FOREIGN KEY(BANumber) REFERENCES BANK_ACCOUNT(BANumber), FOREIGN KEY(BankID) REFERENCES BANK_ACCOUNT(BankID))");
    db.run("CREATE TABLE ELECTRONIC_ADDRESS (Identifier TEXT PRIMARY KEY NOT NULL , SSN INT NOT NULL,Type TEXT, Verified NOT NULL,FOREIGN KEY(SSN) REFERENCES USER_ACCOUNT(SSN))");

    db.run("CREATE TABLE SEND_TRANSACTION (STid INTEGER PRIMARY KEY AUTOINCREMENT, Amount INT NOT NULL, Date TEXT, Month TEXT, Memo TEXT, Cancelled INT, SSN INT, Identifier TEXT,FOREIGN KEY(SSN) REFERENCES USER_ACCOUNT(SSN), FOREIGN KEY(Identifier) REFERENCES ELECTRONIC_ADDRESS(Identifier))");
    db.run("CREATE TABLE REQUEST_TRANSACTION (RTid INTEGER PRIMARY KEY AUTOINCREMENT, Amount INT NOT NULL, Date TEXT, Memo TEXT, SSN INT, FOREIGN KEY(SSN) REFERENCES USER_ACCOUNT(SSN))");

    // insert 3 rows of data:
    db.run("INSERT INTO BANK_ACCOUNT VALUES (1, 1)");
    db.run("INSERT INTO BANK_ACCOUNT VALUES (2,2)");
    db.run("INSERT INTO BANK_ACCOUNT VALUES (3,3)");

    db.run("INSERT INTO HAS_ADDITIONAL VALUES (123456789, 1,1,1)");
    db.run("INSERT INTO HAS_ADDITIONAL VALUES (123456799,2,2,0)");
    db.run("INSERT INTO HAS_ADDITIONAL VALUES (123456779,3,3,1)");

    db.run("INSERT INTO USER_ACCOUNT VALUES (123456789, 'Robin',20,1,1,1)");
    db.run("INSERT INTO USER_ACCOUNT VALUES (123456799,'Xi',200,2,2,0)");
    db.run("INSERT INTO USER_ACCOUNT VALUES (123456779,'Rishi',2,3,3,1)");


    db.run("INSERT INTO ELECTRONIC_ADDRESS VALUES ('6096133150',123456789,'phone',1)");
    db.run("INSERT INTO ELECTRONIC_ADDRESS VALUES ('robinkarmakar@yahoo.com',123456799,'email',1)");
    db.run("INSERT INTO ELECTRONIC_ADDRESS VALUES ('karmakar.robin@gmail.com',123456779,'email',1)");

    db.run("INSERT INTO REQUEST_TRANSACTION(Amount,Date,Memo,SSN) VALUES (20,'Jan 7','owe me',123456789)");
    db.run("INSERT INTO REQUEST_TRANSACTION(Amount,Date,Memo,SSN) VALUES (20,'Jan 8','here',123456789)");
    db.run("INSERT INTO REQUEST_TRANSACTION(Amount,Date,Memo,SSN) VALUES (30,'Jan 9','test',123456789)");

    db.run("INSERT INTO SEND_TRANSACTION(Amount,Date,Month,Memo,cancelled,SSN,Identifier) VALUES (20,'5','5','hello',1,123456789,'6096133150')");
    db.run("INSERT INTO SEND_TRANSACTION(Amount,Date,Month,Memo,cancelled,SSN,Identifier) VALUES (200,'5','5','greetings',0,123456789,'6096133150')");
    db.run("INSERT INTO SEND_TRANSACTION(Amount,Date,Month,Memo,cancelled,SSN,Identifier) VALUES (300,'6','6','njit',0,123456789,'6096133150')");



    console.log('successfully created the bank table in TIJN.db');

    // print them out to confirm their contents:;
    db.each("SELECT BankID,BANumber FROM BANK_ACCOUNT", (err, row) => {
        console.log(row.BankID + ": " + row.BANumber);
    });


    db.each("SELECT SSN, Name, Balance,BankID,BANumber,PBVerified FROM USER_ACCOUNT", (err, row) => {
        console.log(row.SSN + ": " +row.Name+": "+ row.Balance + ": " + row.BankID + ": " + row.BANumber + ": " + row.PBVerified);
    });


    db.each("SELECT SSN,BANumber,BankID,Verified FROM HAS_ADDITIONAL", (err, row) => {
        console.log(row.SSN + ": " +row.BANumber+": "+ row.BankID + ": " + row.Verified);
    });


    db.each("SELECT RTid, Amount, Date ,Memo,SSN FROM REQUEST_TRANSACTION", (err, row) => {
        console.log(row.RTid + ": " +row.Amount+": "+ row.Date + ": " + row.Memo+ ": " + row.SSN );
    });

    db.each("SELECT STid, Amount,Date,Memo,Cancelled,SSN,Identifier FROM SEND_TRANSACTION", (err, row) => {
        console.log(row.STid + ": " +row.Amount+": "+ row.Date + ": " + row.Memo+ ": " + row.Cancelled + ": " + row.SSN+ ": " + row.Identifier );
    });

    db.each("SELECT Identifier,SSN,Type,Verified FROM ELECTRONIC_ADDRESS", (err, row) => {
        console.log(row.Identifier+ ": " +row.SSN+": "+ row.Type + ": " + row.Verified );
    });

});

db.close();
