// function convertToSlug(Text)
// {
//     return Text
//         .toLowerCase()
//         .replace(/ /g,'-')
//         .replace(/[^\w-]+/g,'')
//         ;
// }
var express = require('express');
var router = express.Router();
var Article = require('../models/article');
var User = require('../models/user');
var auth = require('../middlewares/auth');


router.post('/', auth.verifyToken, async(req, res, next) =>{
    var slug = req.body.article.title.toLowerCase().replace(/ /g,'-').replace(/[^\w-]+/g,'');
    req.body.article.slug = slug;
    let newArticle = await Article.create(req.body.article);
    
});


module.exports = router;