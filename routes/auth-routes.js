const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const User = require('../models/user-model.js');

const authRoutes = express.Router();


authRoutes.get('/signup', (req, res, next) => {
  res.render('auth/signup-view.ejs');

});

// <form methpd="post" action="/signup"> --> form located in signup-view
authRoutes.post('/signup', (req, res, next) => {
// shortening username & password text
  const signupUsername = req.body.signupUsername;
  const signupPassword = req.body.signupPassword;

    // if we did not use varibles, it would look like below.
    // if (req.body.signupUsername === '' || req.body.signupPassword === '')

  if (signupUsername === '' || signupPassword === '') {
    res.render('auth/signup-view.ejs', {
      // if username or password is blank, render page again WITH error.
      errorMessage: 'Please provide both username and password...'
    });
    // stop processing any other pages.
    return;
  }

    // checking for duplicate usernames.
  User.findOne(
    // 1st arg -> criteria of the findOne (which documents)
    { username: signupUsername },
    // 2nd arg -> projection (which fields)
    { username: 1 },
    // 3rd arg -> callback
    (err, foundUser) => {
      if (err) {
        next(err);
        return;
      }

      if (foundUser) {
        // If we found someone, let's render the sign up page again w/ error.
        res.render('auth/signup-view.ejs', {
          errorMessage: 'Username is taken, fool...'
        });
        return;
      }

      // if user used a valid username and there's no duplicate
      // let's save them to database and encrypt password

      // Encrypt the password.
      const salt = bcrypt.genSaltSync(10);
      const hashPass = bcrypt.hashSync(signupPassword, salt)

      // Create the user.
      const theUser = new User({
        name: req.body.signupName,
        username: signupUsername,
        encryptedPassword: hashPass
      });

      // Save the user.
      theUser.save((err) => {
        if (err) {
          next(err);
          return;
        }

        // Redirect the user to home page if save is successful
        res.redirect('/');

      });
    }
  );
});

authRoutes.get('/login', (req, res, next) => {
  res.render('auth/login-view.ejs');
});

// <form method="post" action="/login">
authRoutes.post('/login',
//                      local as in "LocalStrategy" (our method of login.)
//                        |
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
  } )
);

module.exports = authRoutes;
