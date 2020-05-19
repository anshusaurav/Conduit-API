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

/**
 * Create an article. Auth is required
 */
router.post('/', auth.verifyToken, async(req, res, next) =>{
    var slug = req.body.article.title.toLowerCase().replace(/ /g,'-').replace(/[^\w-]+/g,'');
    req.body.article.slug = slug;
    console.log('here');
    try{
        var user = await User.findById(req.user.userId);
        console.log(user);
        req.body.article.author = user.id;
        console.log(req.body.article);
        var newArticle = await (await Article.create(req.body.article)).populate('author');
        console.log(newArticle);
        res.status(201).json({
            article: {
                slug: newArticle.slug,
                title: newArticle.title,
                description: newArticle.description,
                body: newArticle.body,
                tagList: newArticle.tagList,
                createdAt: newArticle.createdAt,
                updatedAt: newArticle.updatedAt,
                favorited: false,
                favoritesCount: 0,
                author: {
                    username: user.username,
                    bio: user.bio,
                    image: user.image,
                    following: false
                }
            }
            
        })
    }
    catch(error){
        return res.status(401).json({
            success: false,
            error: "Bad Request"
          })
    }
});


module.exports = router;