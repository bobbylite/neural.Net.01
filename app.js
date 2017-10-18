var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var nn = require('nn');
var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// neural net goes here. 
console.log("Neural Net learning starting..");
var opts = {
    layers: [ 4 ],
    iterations: 300000,
    errorThresh: 0.0000005,
    activation: 'logistic',
    learningRate: 0.4,
    momentum: 0.5,
    log: 100   
}
var net = nn(opts)
// Logical defenitions [X, y, Z]. (AND GATE) where we AND [X, Y] and ignore Z. We never explicity state that 1,1,0 = 1 
// The net.send() function will allow you to send it something that it doesn't know.  and it will learn what the answer is! dope! 
net.train([
    { input: [ 0,0,1 ], output: [ 0 ] },
    { input: [ 0,1,1 ], output: [ 0 ] },            
    { input: [ 1,0,1 ], output: [ 0 ] },
    { input: [ 0,1,0 ], output: [ 0 ] },
    { input: [ 1,0,0 ], output: [ 0 ] },
    { input: [ 1,1,1 ], output: [ 1 ] },
    { input: [ 0,0,0 ], output: [ 0 ] }
    ])
// send it a new input to see its trained output! This is where it starts to run the input against all solutions it knows 300000 iterations at a time. 
var output = net.send([ 1,1,0]) 
console.log(output); //0.9971279763719718 [1,1,0]

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
