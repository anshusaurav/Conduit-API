var express = require('express');
var router = express.Router();
var User = require('../models/user');
var auth = require('../middlewares/auth');

router.get('profiles/:username', async (req, res, next) => {
    var user = await User.findOne({username: req.params.username});
    res.json({
      'success': true
    })
  });

module.exports = router;