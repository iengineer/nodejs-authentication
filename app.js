const express      = require('express');
const path         = require('path');
const favicon      = require('serve-favicon');
const logger       = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser   = require('body-parser');
const layouts      = require('express-ejs-layouts');
const mongoose     = require('mongoose');
const session      = require('express-session');
const passport     = require('passport');


mongoose.connect('mongodb://localhost/authentication-app');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(layouts);

//------------------------------------------------------------------------------
// THE BELLOW CAN BE COPY AND PASTED INTO ANY APPLICATION FOR REFERENCE.
app.use(session({
  secret: 'authentication application',

  // these two options are there to prevent warnings
  resave: true,
  saveUninitialized: true
}) );


// These need to come AFTER the session middleware.
app.use(passport.initialize());
app.use(passport.session());
// ... AND BEFORE ROUTES!

// Determines what to save in the session.
passport.serializeUser((user, cb) => {
  // cb is short for "call back"
  cb(null, user._id);
});

const User = require('./models/user-model.js');
// Determines where to get to get the rest of the user's information.
// CALLED ON EVERY REQUEST **AFTER** YOU LOGIN
passport.deserializeUser((user, cb) => {
  // "cb is short for callback"

  // query the database with the ID from the box
  User.findById(userId, (err, theUser) => {
    if (err) {
      cb(err);
      return;
    }
    // sending the user's info to passport.
    cb(null, theUser);
  });
});

const LocalStrategy = require('passport-local').Strategy;

// The same as:
// const passportLocal  = require('passport-local');
// const LocalStrategy  = passportLocal.Strategy;

const bcrypt  = require('bcrypt');

// to connect a Strategy we do below:
passport.use(new LocalStrategy(
  // 1st arg -> options to customize LocalStrategy
  { },

  // 2nd arg -> callback for the logic that validates the login.
  (loginUsername, loginPassword, next ) => {
    User.findOne(
      { username: loginUsername },
      (err, theUser) => {
        // tell passport if there is an error. halt. nothing we can do.
        if (err) {
          next(err);
          return;
        }
        // Tell passport if there is no user with given username...
        if (!theUser) {
          //         false in 2nd arg mean "login failed."
          //           |
          next(null, false);
          return;
        }
        // we are checking the password against the encrypted password in database.
        // if it matches, this will return true. else -> false.
        if (!bcrypt.compareSync(loginPassword, theUser.encryptedPassword)) {
          //         false in 2nd arg means "login failed!"
          //           |
          next(null, false);
          return;
        }
        // give passportthe user's details. (SUCCESS!)
        next(null, theUser);
      }
    );
  }
) );
// WE CAN PASTE ABOVE FOR REFERENCE. IT DOES NOT CHANGE.
// -----------------------------------------------------------------------------





// OUR ROUTES HERE
// ----------------------------------------------------------
const index = require('./routes/index');
app.use('/', index);

// require the file
const myAuthRoutes = require('./routes/auth-routes.js');
// connect it to application
app.use('/', myAuthRoutes);

// ----------------------------------------------------------



// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
