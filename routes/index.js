var express = require('express');
var router = express.Router();
var auth = require('../middlewares/auth');
var User = require('../models/user');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/api/user', auth.verifyToken, async function(req, res, next) {
    console.log(req.userId);
    console.log(req.headers);
    try{
      var user = await User.findById(req.user.userId);
      res.status(201).json(
        {
          user:{
            email: user.email,
            username: user.username,
            token: req.user.token
          }
        }
      );
    }
    catch(err){

    }
  // res.render('index', { title: 'Express' });
});

router.get('/api/profile/:username', async (req, res, next) =>{
  var user = await User.findOne({username: req.params.username});
  res.json({
    'success': true
  })
});
module.exports = router;
