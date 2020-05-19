const mongoose = require("mongoose");
var Schema = mongoose.Schema;


var articleSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    slug:{
        type: String
    },
    description: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    favorites: {
        type: Number,
        default: 0
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: "Comment",
    }],

    readersFavorited: [{
        type: Schema.Types.ObjectId,
        ref: "User",
    }],
    tagList: [String]
    
},{timestamps: true});

var Article = mongoose.model("Article", articleSchema);
module.exports = Article;

//module.exports = mongoose.model("User", userSchema);