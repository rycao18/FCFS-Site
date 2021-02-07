const express = require('express');
const session = require('express-session');
const fs = require('fs');
const path = require('path');
const ejs = require('ejs');

const app = express();
const http = require('http').createServer(app);

let dashpassword = fs.readFileSync('./password.txt', 'utf8');
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
    console.log(numReq);
    if (req.session.dashpassword == dashpassword) {
        next('route');
    } else {
        res.render('password');
    }
});

app.post('/', (req, res) => {
    req.session.dashpassword = req.body.password
    res.redirect('/');
});

app.get('/', (req, res) => {
    numUsers++;
    console.log(numUsers);
    if (numUsers > 0) {
        dashpassword = "abaihlm1l2ihrioufh18ofyvgbfnmsm"
    }
    res.render('index');
});

http.listen(80, () => {
    console.log("Web server running");
});