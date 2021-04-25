const express = require('express');
const session = require('express-session');
const path = require('path');
const ejs = require('ejs');
const config = require('./config.json');

const app = express();
const http = require('http').createServer(app);

let dashpassword = config.oldpw
let passwordChanged = false;
let numUsers = 0;
let numReq = 0;

app.use(session({
    secret: 'hello',
    resave: true,
    saveUninitialized: false
}));
app.use(express.urlencoded()); // to support URL-encoded bodies
app.use(express.static(path.join(__dirname, '/public')));
app.set('view engine', 'html');
app.engine('html', ejs.renderFile);

app.get('*', (req, res, next) => {
    numReq++;
    console.log(Math.round(numReq/2));
    if (req.session.dashpassword == dashpassword) {
        // someone hit
        next('route');
    } else {
        res.render('password', {"outofstock": passwordChanged, "people": Math.round(numReq/2)});
    }
});

app.post('/', (req, res) => {
    // give their session the password that they typed in
    req.session.dashpassword = req.body.password;
    res.redirect('/');
});

app.get('/', (req, res) => {
    numUsers++;
    console.log(numUsers);
    if (numUsers > 0) {
        // Someone hit
        dashpassword = config.newpw;
        passwordChanged = true;
    }
    res.render('index', {"prize": config.prize});
});

http.listen(80, () => {
    console.log("Web server running");
});