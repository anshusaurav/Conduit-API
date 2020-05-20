
var express = require('express');
var router = express.Router();
var Article = require('../models/article');
var User = require('../models/user');
var Comment = require('../models/comment');
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
        var updatedUser = await User.findByIdAndUpdate(user.id, {$push: {articles: newArticle.id}});
        return res.status(201).json({
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
/**
 * Get an article. Auth not required
 */
router.get('/:slug', async(req, res, next) =>{
    try{
        const {slug}= req.params;
        var foundArticle = await Article.findOne({slug})
                                        .populate('author');
       
        console.log('foundArticle',foundArticle);
        return res.status(200).json({
            article: {
                slug: foundArticle.slug,
                title: foundArticle.title,
                description: foundArticle.description,
                body: foundArticle.body,
                tagList: foundArticle.tagList,
                createdAt: foundArticle.createdAt,
                updatedAt: foundArticle.updatedAt,
                favorited: foundArticle.favorited,
                favoritesCount: foundArticle.favoritesCount,
                author: {
                    username: foundArticle.author.username,
                    bio: foundArticle.author.bio,
                    image: foundArticle.author.image,
                    following: true,
                }
            }
            
        });

    }
    catch(error){
        return res.status(401).json({
            success: false,
            error: "Bad Request"
        })
    }
});
/**
 * Update an article. Auth is required
 */
router.put('/:slug', auth.verifyToken, async(req, res, next) =>{
    //Need to verify is user is same as author otherwise relevant error status code
    var slug  = req.params.slug;
    
    if (!req.body.article) {
        return next(err);
    }
    var { title, description, body } = req.body.article;
    console.log(title, description, body);
    try{
        if (title || description || body){
            // console.log('Entered');
            if(title){
                var article = await Article.findOneAndUpdate({slug}, {$set: {title}});
                var newslug = article.title.toLowerCase()
                                            .replace(/ /g,'-')
                                            .replace(/[^\w-]+/g,'');
                slug = newslug
                article = await Article.findByIdAndUpdate(article.id, {$set: {slug}});
            }
            if(description){
                var article = await Article.findOneAndUpdate({slug}, {$set: {description}});
            }
            if(body){
                var article = await Article.findOneAndUpdate({slug}, {$set: {body}});
            }
            var foundArticle = await Article.findOne({slug})
                                        .populate('author');
       
            // console.log('foundArticle',foundArticle);
            return res.status(200).json({
                article: {
                    slug: foundArticle.slug,
                    title: foundArticle.title,
                    description: foundArticle.description,
                    body: foundArticle.body,
                    tagList: foundArticle.tagList,
                    createdAt: foundArticle.createdAt,
                    updatedAt: foundArticle.updatedAt,
                    favorited: foundArticle.favorited,
                    favoritesCount: foundArticle.favoritesCount,
                    author: {
                        username: foundArticle.author.username,
                        bio: foundArticle.author.bio,
                        image: foundArticle.author.image,
                        following: true,
                    }
                }
                
            });
        }
        else{
            return next(err);
        }
    }
    catch(error){
        return res.status(422).json({
            success: false,
            error: "Bad Request"
        })
    }
});

/**
 * Delete an article. Auth is required
 */
router.delete('/:slug', auth.verifyToken, async(req, res, next) =>{
    var {slug} = req.params;
    var article = await Article.findOne({slug});
    if(req.user.userId != article.author){
        return res.status(401).json({
            success: false,
            error: "Not authorized"
        })
    }
    
    try{
        var article = await Article.findOneAndRemove({slug});
        let updatedUser = await User.findByIdAndUpdate(article.author, {$pull : {articles: article.id}});
        return res.status(204).json({
            success: true,
            message: "Successfully deleted"
        });
    }
    catch(error) {
        return res.status(400).json({
            success: false,
            error: "Bad Request"
        })
    }
});
/**
 * Create a comment for an article. Auth is required
 */
router.post('/:slug/comments', auth.verifyToken, async(req, res, next) =>{
    var {slug} = req.params;
    // console.log()
    try{
        let user = await User.findById(req.user.userId);
        let article = await Article.findOne({slug});
        // console.log(user, article);
        let comment = {
            body: req.body.comment.author,
            author: user.id,
            article: article.id
        };
        let commentCreated = await Comment.create(comment);
        console.log(commentCreated);
        return res.status(200).json({
            comment: {
                id: commentCreated.id,
                createdAt: commentCreated.createdAt,
                updatedAt: commentCreated.updatedAt,
                body: commentCreated.body,
                author:{
                    username: user.username,
                    bio: user.bio,
                    image: user.image,
                    following: true
                }
            }
        });
    }
    catch(error){
        return res.status(422).json({
            success: false,
            error: "Bad Request"
        })
    }
});
module.exports = router;