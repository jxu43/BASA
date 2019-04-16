var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
const cors = require('cors');

//app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors({origin: true}))

const URL = "mongodb+srv://basaAdmin:tmac080510@cluster0-rl9ur.mongodb.net/test?retryWrites=true";

//------------------------------------Connect to database--------------------------------------------
mongoose.Promise = Promise;
mongoose.connect(URL, {useNewUrlParser: true}, (err) => {
    console.log("Database connection", err)
});

var db = mongoose.connection;
db.once('open', function () {
    console.log("successfully connect");
});

//------------------------------------Router Configuration-------------------------------------------
var routes = require('./routes/router');
//app.use('/', routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('File Not Found');
    err.status = 404;
    next(err);
});

// error handler
// define as the last app.use callback
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.send(err.message);
});

// listen on port 3000
app.listen(8080, function () {
    console.log('BASA listening on port 8080');
});

