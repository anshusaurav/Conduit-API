var mongoose = require('mongoose');
var {hash, compare} = require('bcrypt');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    email:{
        type: String,
        required: true,
        unique: true
    },
    username:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true,
    },
    bio: String,
    image: String,

}, {timestamps: true});
userSchema.pre('save', async function(next){
    console.log(this, 'Presave hook');
    try{
        if(this.password && this.isModified('password')) {
            this.password = await hash(this.password, 10);
            console.log(this);
            return next();
        }
    }
    catch(error) {
        return next(error);
    }
});

userSchema.methods.verifyPassword = async function(pwd) {
    return await compare(pwd, this.password); 
    // console.log(match);
    // if(match)
    //     return true;    
    // else 
    //     return false;
}
module.exports = mongoose.model("User", userSchema);