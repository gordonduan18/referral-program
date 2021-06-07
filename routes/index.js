var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var shortid = require('shortid');
var nodemailer = require('nodemailer')
var bodyParser = require('body-parser');

let referrer;
let refid;
/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index');

    /* Adds referrer if applicable */
    referrer = req.query.refid;
});

/* establish mysql connection */
var connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

/* New POST route for form submissions */
router.post('/add-user', function(req, res, next) {

    /* user's full name */
    let name = req.body.name;

    /* user's email address */
    let email = req.body.email;

    if (name === "" || email === "") {
        return next();
    }

    /* a unique referral code the user can share */
    let referral_code = shortid.generate();
    refid = referral_code;

    /* add user to the database with INSERT */
    let query = "INSERT INTO `users` (`full_name`, `email`, `referral_code`, `referrer`) VALUES (?, ?, ?, ?)";
    connection.query(query, [name, email, referral_code, referrer], (err) => {
        if (err) return next();

        return res.send({ referralCode: referral_code });
    });

    /* update referral count if applicable */
    query = "UPDATE users SET num_referrals = num_referrals + 1 WHERE referral_code = '" + referrer + "'";
    connection.query(query, (err) => {
        if (err) return next();
    });
});

/* New GET route for displaying the user's place in line */
router.get('/get-user', function(req, res, next) {
    let query = "SELECT `full_name`, `referral_code`, `num_referrals`, `time_added` FROM `users` ORDER BY `num_referrals` DESC, `time_added` ASC";
    connection.query(query, (err, rows, fields) => {
        if (err) return next();
        let current = 0;
        for (var i = 0; i < rows.length; i++) {
            if (rows[i].referral_code === refid) {
                current = i + 1;
                break;
            }
        }
        res.send({ currentPos: current });
    });
})

/* New PUT route for checking spot submissions */
router.put('/check-user', function(req, res, next) {

    /* user's email address */
    let email = req.body.email;

    if (email === "") {
        return next();
    }

    /* find user to the database with SELECT */
    let query = "SELECT `email`, `referral_code` FROM `users` ORDER BY `num_referrals` DESC, `time_added` ASC";
    connection.query(query, (err, rows, fields) => {
        if (err) return next();
        let current = 0;
        let code = "";
        for (var i = 0; i < rows.length; i++) {
            if (rows[i].email === email) {
                current = i + 1;
                code = rows[i].referral_code;
                break;
            }
        }
        return res.send({
            currentPos: current,
            code: code
        });
    });
});

// New POST route from contact form
router.post('/contact', (req, res) => {

    // Get GMAIL_USER and GMAIL_PASS from .env
    const GMAIL_USER = process.env.GMAIL_USER;
    const GMAIL_PASS = process.env.GMAIL_PASS;

    // Instantiate the SMTP server
    const smtpTrans = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: GMAIL_USER,
            pass: GMAIL_PASS
        }
    })

    // Specify what the email will look like
    const mailOpts = {
        from: 'gordonduan8@gmail.com', // This is ignored by Gmail
        to: GMAIL_USER,
        subject: `Message from BucketsInvesting.com: ${req.body.subject}`,
        text: `${req.body.name} (${req.body.email}) says: ${req.body.message}`
    }

    // Attempt to send the email
    smtpTrans.sendMail(mailOpts, (error, response) => {
        if (error) {
            console.log('Something went wrong');
            res.render('index');
            //res.render('contact-failure') // Show a page indicating failure
        } else {
            console.log('Success!!!')
            res.render('index');
            //res.render('contact-success') // Show a page indicating success
        }
    })
})

module.exports = router;