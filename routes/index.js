var express = require('express');
var router = express.Router();
var auth = require('../middlewares/auth');
var User = require('../models/user');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/api/user', auth.verifyToken, async function(req, res, next) {
    
    try{
      var user = await User.findById(req.user.userId);
      res.status(201).json(
        {
          user:{
            email: user.email,
            username: user.username,
            token: req.user.token,
            bio: user.bio||"",
            image: user.image||"",
          }
        }
      );
    }
    catch(err){
      return res.status(400).json({
        success: false,
        error: "Invalid password"
      })
    }
});
router.get('/api/tags', async(req, res, next) =>{
  try{
    var tags = await Tag.find();
    var res = [];
    console.log('HERE bro',tags.length);
    tags.forEach(elem =>{
      res.push(elem.tagname);
    });
    return res.status(200).json({
      tags: ret
  });
  }
  catch(error) {
    return res.status(400).json({
      success: false,
      error: "Bad Request"
    })
  }
});
module.exports = router;
