
const express = require('express');
const app = express();
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('TIJN.db');
app.use(express.static('static_files'));

app.get('/bankaccounts', (req, res) => {
    db.all('SELECT BankID FROM BANK_ACCOUNT', (err, rows) => {
        console.log(rows);
        const allBankIds = rows.map(e => e.BankID);
        console.log(allBankIds);
        res.send(allBankIds);
    });
});

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.post('/bank', (req, res) => {
    console.log(req.body);
    db.run(
        'INSERT INTO BANK_ACCOUNT VALUES ($name, $id)',
        
        {
            $name: req.body.name,
            $id: req.body.id
        },
        
        (err) => {
            if (err) {
                res.send({message: 'error in app.post(/bank)'});
            } else {
                res.send({message: 'successfully run app.post(/bank)'});
            }
        }
    );
});

app.get('/bank/:bankid', (req, res) => {
    const nameToLookup = req.params.bankid; 
    db.all(
        'SELECT * FROM BANK_ACCOUNT WHERE BankID=$name',
        
        {
            $name: nameToLookup
        },
        
        (err, rows) => {
            console.log(rows);
            if (rows.length > 0) {
                res.send(rows);
            } else {
                res.send({}); 
            }
        }
    );
});

app.listen(3000, () => {
    console.log('Server started..');
});

app.get('/searchAccount/:ssn', (req, res) => {
    const nameToLookup = req.params.ssn;

    db.all(
        "SELECT * FROM USER_ACCOUNT WHERE SSN=$ssn",
        
        {
            $ssn: nameToLookup
        },
        
        (err, rows) => {
            console.log(rows);
            if (rows.length > 0) {
                res.send(rows);
            } else {
                console.log("fail");
                console.log(req.params.ssn);
                res.send({}); 
            }
        }
    );
});



app.use(bodyParser.urlencoded({extended: true}));
app.post('/bankRemove', (req, res) => {
    console.log(req.body);
    db.run(
        'DELETE FROM BANK_ACCOUNT WHERE BankID = $BankID ',
        
        {
            $BankID: req.body.name
        },
        
        (err) => {
            if (err) {
                res.send({message: 'error in app.post(/bankRemove1)'});
            } else {
                res.send({message: 'successfully run app.post(/removeUserBank)'});
            }
        }
    );
    db.run(
        'DELETE FROM HAS_ADDITIONAL WHERE SSN= $SSN ',
        
        {
            $SSN: req.body.ssn
        },
        
        (err) => {
            if (err) {
                console.log({message: 'error in app.post(/bankRemove2)'});
            } else {
                console.log({message: 'successfully run has_additional deletion' + req.body.ssn});
            }
        }
    );
    db.run(
        "UPDATE USER_ACCOUNT SET BankID = 0 , BANumber = 0 WHERE SSN = $SSN ",
        
        {
            $SSN: req.body.ssn
        },
        
        (err) => {
            if (err) {
                console.log({message: 'error in app.post(/bankRemove3'});
            } else {
                console.log({message: 'successfully updated useraccount' + req.body.ssn});
            }
        }
    );
});

app.use(bodyParser.urlencoded({extended: true}));
app.post('/bankAdd', (req, res) => {
    console.log(req.body);
    db.run(
        'INSERT INTO BANK_ACCOUNT VALUES($BankID,$BANumber)',
        
        {
            $BankID: req.body.id,
            $BANumber: req.body.number
        },
        
        (err) => {
            if (err) {
                res.send({message: 'The bank already exists.'});
            } else {
                res.send({message: 'successfully run app.post(/bankAdd)'});
            }
        }
    );
    db.run(
        'INSERT INTO HAS_ADDITIONAL VALUES($ssn,$NUMBER,$ID,1)',
        
        {
            $ssn: req.body.ssn,
            $NUMBER: req.body.number,
            $ID: req.body.id
        },
        
        (err) => {
            if (err) {
                console.log({message: 'error in app.post(/bankAdd2) ' + err});
            } else {
                console.log({message: 'successfully run has_additional addition ' + req.body.ssn});
            }
        }
    );
    if(req.body.primary ==1) {
        db.run(
            "UPDATE USER_ACCOUNT SET BankID = $ID , BANumber = $NUMBER WHERE SSN = $ssn",
            
            {
                $ssn: req.body.ssn,
                $NUMBER: req.body.number,
                $ID: req.body.id
            },
            
            (err) => {
                if (err) {
                    console.log({message: 'error in app.post(/bankAdd3)' +err + req.body.ssn + req.body.number + req.body.id});
                } else {
                    console.log({message: 'successfully run app.post(/addBankAccount) ' + req.body.ssn});
                }
            }
        );
    }
});

app.use(bodyParser.urlencoded({extended: true}));
app.post('/removeUserPhone', (req, res) => {
    console.log(req.body);
    db.run(
        'DELETE FROM ELECTRONIC_ADDRESS WHERE SSN = $ssn and Type= "phone"',
        
        {
            $ssn: req.body.ssn
        },
        
        (err) => {
            if (err) {
                res.send({message: 'error in app.post(/userphone)'});
            } else {
                res.send({message: 'successfully run app.post(/removeuserphone)'});
            }
        }
    );
});

app.use(bodyParser.urlencoded({extended: true}));
app.post('/addUserPhone', (req, res) => {
    console.log(req.body);
    db.run(
        'INSERT INTO ELECTRONIC_ADDRESS VALUES($PHONE,$SSN,"phone",1)',
        
        {
            $SSN: req.body.ssn,
            $PHONE: req.body.phone
        },
        
        (err) => {
            if (err) {
                res.send({message: 'error in app.post(/adduserphone)' + err});
            } else {
                res.send({message: 'successfully run app.post(/adduserphone)' +req.body.ssn});
            }
        }
    );
});

app.get('/getUserPhone/:ssn', (req, res) => {
    const nameToLookup = req.params.ssn; // matches ':bankid' above
    // db.all() fetches all results from an SQL query into the 'rows' variable:
    db.all(
        "SELECT * FROM ELECTRONIC_ADDRESS WHERE SSN=$ssn and Type='phone'",
        
        {
            $ssn: nameToLookup
        },
        
        (err, rows) => {
            console.log(rows);
            if (rows.length > 0) {
                res.send(rows);
            } else {
                res.send({}); 
            }
        }
    );
});

app.use(bodyParser.urlencoded({extended: true}));
app.post('/removeUserEmail', (req, res) => {
    console.log(req.body);
    db.run(
        'DELETE FROM ELECTRONIC_ADDRESS WHERE SSN = $ssn and Type= "email"',
        
        {
            $ssn: req.body.ssn
        },
        
        (err) => {
            if (err) {
                res.send({message: 'error in app.post(/useremail)'});
            } else {
                res.send({message: 'successfully run app.post(/removeuseremail)'});
            }
        }
    );
});

app.use(bodyParser.urlencoded({extended: true}));
app.post('/addUserEmail', (req, res) => {
    console.log(req.body);
    db.run(
        'INSERT INTO ELECTRONIC_ADDRESS VALUES($EMAIL,$SSN,"email",1)',
        
        {
            $SSN: req.body.ssn,
            $EMAIL: req.body.email
        },
        
        (err) => {
            if (err) {
                res.send({message: 'error in app.post(/adduseremail)' + err});
            } else {
                res.send({message: 'successfully run app.post(/adduseremail)' +req.body.ssn});
            }
        }
    );
});

app.get('/getUserEmail/:ssn', (req, res) => {
    const nameToLookup = req.params.ssn;
    db.all(
        "SELECT * FROM ELECTRONIC_ADDRESS WHERE SSN=$ssn and Type='email'",
        {
            $ssn: nameToLookup
        },
        (err, rows) => {
            console.log(rows);
            if (rows.length > 0) {
                res.send(rows);
            } else {
                res.send({});
            }
        }
    );
});

app.get('/getUserBalance/:ssn', (req, res) => {
    const nameToLookup = req.params.ssn;
    db.all(
        "SELECT Balance FROM USER_ACCOUNT WHERE SSN=$ssn",
        {
            $ssn: nameToLookup
        },
        (err, rows) => {
            console.log(rows);
            if (rows.length > 0) {
                res.send(rows);
            } else {
                res.send({});
            }
        }
    );
});

app.use(bodyParser.urlencoded({extended: true}));
app.post('/sendMoney', (req, res) => {
    console.log(req.body);
    db.run(
        'INSERT INTO SEND_TRANSACTION(Amount,Date,Month,Memo,cancelled,SSN,Identifier) VALUES($AMOUNT,$DATE, $MONTH,$MEMO, 0, $SSN, $IDENTIFIER)',
        
        {
            $SSN: req.body.ssn,
            $IDENTIFIER: req.body.identifier,
            $AMOUNT: req.body.amount,
            $MEMO: req.body.memo,
            $DATE: req.body.date,
            $MONTH: req.body.month
        },
        
        (err) => {
            if (err) {
                res.send({message: 'error in app.post(/sendMoneyl)' + err});
            } else {
                res.send({message: 'successfully run app.post(/sendMoney)' +req.body.ssn});
            }
        }
    );

    db.run(
        'UPDATE USER_ACCOUNT SET Balance = Balance + $AMOUNT WHERE SSN = $SSN',
        
        {
            $SSN: req.body.ssn,
            $AMOUNT: req.body.amount

        },
        
        (err) => {
            if (err) {
                console.log({message: 'error in app.post(/sendMoney2)' + err});
            } else {
                console.log({message: 'successfully run app.post(/sendMoney2)' +req.body.ssn});
            }
        }
    );

    db.run(
        'DELETE FROM REQUEST_TRANSACTION WHERE AMOUNT = $AMOUNT and SSN = $YOURSSN',
        
        {
            $AMOUNT: req.body.amount,
            $YOURSSN: req.body.yourssn

        },
        
        (err) => {
            if (err) {
                console.log({message: 'error in app.post(/sendMoney3)' + err});
            } else {
                console.log({message: 'successfully run app.post(/sendMoney3)' +req.body.ssn});
            }
        }
    );
});

app.use(bodyParser.urlencoded({extended: true}));
app.post('/requestMoney', (req, res) => {
    console.log(req.body);
    db.run(
        'INSERT INTO REQUEST_TRANSACTION(Amount,Date,Memo,SSN) VALUES($AMOUNT,$DATE, $MEMO, $SSN)',
        
        {
            $DATE: req.body.date,
            $SSN: req.body.ssn,
            $AMOUNT: req.body.amount,
            $MEMO: req.body.memo
        },
        
        (err) => {
            if (err) {
                console.log({message: 'error in app.post(/requestMoney)' + err});
            } else {
                console.log({message: 'successfully run app.post(/requestMoney)' +req.body.ssn});
            }
        }
    );

    db.all(
        'SELECT * FROM REQUEST_TRANSACTION WHERE SSN = $YourSSN',
        
        {
            $YourSSN: req.body.yourssn
        },
        
        (err,rows) => {
            console.log(rows);
            if (rows.length > 0) {
                res.send(rows);
            } else {
                res.send({}); 
            }
        }
    );
});


app.use(bodyParser.urlencoded({extended: true}));
app.post('/accountVerification', (req, res) => {
    console.log(req.body);
    db.all(
        'SELECT * FROM USER_ACCOUNT WHERE SSN IN ($SSN)',
        
        {
            $SSN: req.body.ssn
        },
        
        (err,rows) => {
            console.log(rows);
            if (rows.length >0) {
                res.send(rows);
            } else {
                res.send();
            }
        }
    );
});
app.use(bodyParser.urlencoded({extended: true}));
app.post('/statementDate', (req, res) => {
    console.log(req.body);
    db.all(
        'SELECT SUM(AMOUNT) AS SUM FROM SEND_TRANSACTION WHERE SSN = $SSN AND DATE = $DATE',
        
        {
            $SSN: req.body.ssn,
            $DATE: req.body.date
        },
        
        (err,rows) => {
            console.log(rows);
            if (rows.length >0) {
                res.send(rows);
            } else {
                res.send({});
            }
        }
    );
});

app.use(bodyParser.urlencoded({extended: true}));
app.post('/statementMonthly', (req, res) => {
    console.log(req.body);
    db.all(
        'SELECT SUM(AMOUNT) AS SUM FROM SEND_TRANSACTION WHERE SSN = $SSN AND MONTH = $MONTH',
        
        {
            $SSN: req.body.ssn,
            $MONTH: req.body.month
        },
        
        (err,rows) => {
            console.log(rows);
            if (rows.length >0) {
                res.send(rows);
            } else {
                res.send({});
            }
        }
    );
});

app.use(bodyParser.urlencoded({extended: true}));
app.post('/transStatement', (req, res) => {
    console.log(req.body);
    db.all(
        'SELECT * FROM SEND_TRANSACTION WHERE SSN = $SSN LIMIT $LIMIT',
        {
            $SSN: req.body.ssn,
            $LIMIT: req.body.id
        },
        
        (err,rows) => {
            console.log(rows);
            if (rows.length >0) {
                res.send(rows);
            } else {
                res.send({});
            }
        }
    );
});

app.get('/searchDate/:Date1/:Date2/:month/:ssn', (req, res) => {
    const date1 = req.params.Date1;
    const date2 = req.params.Date2;
    const month = req.params.month;
    const ssn = req.params.ssn;
    // db.all() fetches all results from an SQL query into the 'rows' variable:
    console.log('Month: ' + month);
    console.log('Date1: ' + date1);
    console.log('Date2: ' + date2);
    console.log('SSN:'+ ssn);
    db.all(
        "SELECT SUM(AMOUNT) AS SUM from SEND_TRANSACTION WHERE $date1 <= date AND $date2 >= date AND SSN = $ssn AND MONTH = $month",{
            $date1: date1,
            $date2: date2,
            $ssn: ssn,
            $month: month
        },
        
        (err, rows) => {
            console.log(rows);
            if (rows.length > 0) {
                res.send(rows[0]);
            } else {
                res.send({}); 
            }
        }
    );
});

app.use(bodyParser.urlencoded({extended: true}));
app.post('/insertUser', (req, res) => {
    console.log(req.body);
    db.all(
        'INSERT INTO  USER_ACCOUNT VALUES($SSN,$NAME,$AMOUNT,$BAID, $BANUM, 1)',
        
        {
            $SSN: req.body.ssn,
            $BAID: req.body.id,
            $BANUM: req.body.num,
            $AMOUNT: req.body.amount,
            $NAME: req.body.name
        },
        
        
        (err) => {
            if (err) {
                res.send({message: 'error in app.post(/insertUser)' + err});
            } else {
                res.send({message: 'successfully run app.post(/insertUser)' +req.body.ssn});
            }
        }
    );
});
