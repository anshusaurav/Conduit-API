var express = require('express');
var router = express.Router();
var User = require('../models/user');
var auth = require('../middlewares/auth');


//
// {
//   "profile": {
//     "username": "jake",
//     "bio": "I work at statefarm",
//     "image": "https://static.productionready.io/images/smiley-cyrus.jpg",
//     "following": false
//   }
// }
router.get('/:username', async (req, res, next) => {
  console.log(req.params.username);
  try{
    console.log('Here');
    var user = await User.findOne({username: req.params.username});
    var following = false;
    let loggedInUser = await User.findById(req.user.userId);
    console.log('LoggedInUser')
    console.log(loggedInUser);
    console.log(user);
    if(!loggedInUser) {
      res.status(200).json(
        {
          profile:{
            username: user.username,
            bio: user.bio,
            image: user.image,
            following
            
          }
        }
      );
    }
    else{
      if(loggedInUser.following.includes(user.id)){
        following = true;
      }
      res.status(200).json(
        {
          profile:{
            username: user.username,
            bio: user.bio,
            image: user.image,
            following
            
          }
        }
      );
    }
  }
  catch(error) {
    return res.status(400).json({
      success: false,
      error: "Unexpected error"
    })
  }
    
});



module.exports = router;