var express = require('express');
var router = express.Router();
var User = require('../models/user');



/**
 * Get a profile of a user of the system. Auth is optional
 */
router.get('/:username', async (req, res, next) => {
  console.log('INIt',req.params.username);
  try{
    var user = await User.findOne({username:req.params.username});
    var following = false;
    var loggedInUser;
    if(req.user)
      loggedInUser = await User.findById(req.user.userId);
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
    else {
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
    catch(err){
      return res.status(400).json({
            success: false,
            error: "Unexpected error"
      })
  }
});

/**
 * Follow a user by username
 */
router.get('/:username/follow', auth.verifyToken, async (req, res, next) => {
  try{
    var user = await User.findOne({username:req.params.username});
    var loggedInUser = await User.findById(req.user.userId);
    if(!loggedInUser) {
      return res.status(401).json({
        success: false,
        error: "UnAuthorized"
      });
    }
    else {
      user = await User.findOneAndUpdate({username: req.params.username}, 
        {$addToSet : {followers : req.user.userId} },
        {new: true});
      loggedInUser = await User.findByIdAndUpdate(req.user.userId, {$addToSet : {following : user.userId} },
        {new: true});
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
    catch(err){
      return res.status(400).json({
            success: false,
            error: "Unexpected error"
      })
  }

});
module.exports = router;