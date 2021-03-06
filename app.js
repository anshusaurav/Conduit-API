var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var profilesRouter = require('./routes/profiles');
var articlesRouter = require('./routes/articles');

mongoose.connect('mongodb://localhost/conduit-db',
{useNewUrlParser: true, useUnifiedTopology: true},
 (err)=>{
  console.log("connected", err? err:true);
})

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/profiles', profilesRouter);
app.use('/api/articles', articlesRouter);



// catch 404 and forward to error handle
module.exports = app;
