const express = require('express');
const router  = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  console.log('HOME ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');

  console.log('SESSION (from express-session middleware)');
  console.log(req.session);

  console.log('\n');
  console.log('USER (from Passport middleware)');
  console.log(req.user);


// How to render a total different view for a logged in user.
// if (req.user) {
// res.render('logged-in-home.ejs');
//
// } else {
//   res.render('index');
// }


  res.render('index', {
    user: req.user
  });
});

module.exports = router;
