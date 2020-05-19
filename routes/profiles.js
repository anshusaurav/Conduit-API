var express = require('express');
var router = express.Router();
var User = require('../models/user');
var auth = require('../middlewares/auth');



/**
 * Get a profile of a user of the system. Auth is optional
 */
router.get('/:username', async (req, res, next) => {
  // console.log('INIt',req.params.username);
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
            following: true
          }
        }
      );
    }
    else {
      if(loggedInUser.following.includes(user.id)){
        following = true;
      }
      return res.status(200).json(
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
router.post('/:username/follow', auth.verifyToken, async (req, res, next) => {
  console.log('HERE');
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
      // console.log('loggedinUser: ',loggedInUser);
      user = await User.findOneAndUpdate({username: req.params.username}, 
        {$addToSet : {followers : req.user.userId} },
        {new: true});
        // console.log('updatedUser: ',user);
      loggedInUser = await User.findByIdAndUpdate(req.user.userId, {$addToSet : {following : user.id} },
        {new: true});
        console.log('UpdatedloggedinUser: ',loggedInUser);
        return res.status(200).json(
          {
            profile:{
              username: user.username,
              bio: user.bio,
              image: user.image,
              following:true
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
 * Unfollow a user by username
 */
router.delete('/:username/follow', auth.verifyToken, async (req, res, next) => {
  console.log('HERE');
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
      // console.log('loggedinUser: ',loggedInUser);
      user = await User.findOneAndUpdate({username: req.params.username}, 
        {$pull : {followers : req.user.userId} },
        {new: true});
        // console.log('updatedUser: ',user);
      loggedInUser = await User.findByIdAndUpdate(req.user.userId, {$pull : {following : user.id} },
        {new: true});
        console.log('UpdatedloggedinUser: ',loggedInUser);
        return res.status(200).json(
          {
            profile:{
              username: user.username,
              bio: user.bio,
              image: user.image,
              following:false
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