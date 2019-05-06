const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');
const cors = require('cors');
const autoIncrement = require('mongoose-auto-increment');


// set up express
const app = express();

// connect passport.js
require('./config/passport')(passport);

app.set('views', path.join(__dirname, './client/views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, './client/public')));
//------------------------------------Connect to database--------------------------------------------
const URL = "mongodb+srv://basaAdmin:tmac080510@cluster0-rl9ur.mongodb.net/test?retryWrites=true";
mongoose.Promise = Promise;
mongoose.connect(URL, {useNewUrlParser: true}, (err) => {
    console.log("Database connection", err)
});

var db = mongoose.connection;
db.once('open', function () {
    console.log("successfully connect");
});

//------------------------------------Server Configuration--------------------------------------------
//app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}))

app.use(cors({origin: true}));

// Session set up
app.use(
    session({
        secret: 'secret',
        resave: true,
        saveUninitialized: true
    })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());
autoIncrement.initialize(db);

// Connect Flash
app.use(flash());

// All Routes go below here
app.use('/', require('./routes/index.js'));
app.use('/users', require('./routes/users.js'));
app.use('/courses', require('./routes/courses.js'));

// return message setup
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

// listen on port 3000
app.listen(8080, function () {
    console.log('BASA listening on port 8080');
});

