import mongoose from 'mongoose';
import token from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
   email:{
    type:String,
    required: true,
    unique: true,
    lowercase: true,
   },
   password:{
    type:String,
    required: true
   },
   refreshToken:{
    type:String,
   },
   fullName:{
    type:String,
    index:true
   },
   userName:{
    type:String,
    required: true,
    index: true,
   },
   watchHistory:[{
     type:mongoose.Schema.Types.ObjectId,
     ref: 'Video'
   }],
    favouriteList:[{
      type:mongoose.Schema.Types.ObjectId,
      ref: 'Video'
    }],
},{timestamps: true});

userSchema.pre("save",  async function(next){
  if(!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
}) 

userSchema.methods.isPasswordCorrect = async function(enteredPassword){
  return await bcrypt.compare(enteredPassword, this.password);
}

userSchema.methods.createAccessToken = function(){
  return token.sign({id: this._id}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: process.env.ACCESS_TOKEN_EXPIRY});
}

userSchema.methods.createRefreshToken = function(){
  return token.sign({id: this._id}, process.env.REFRESH_TOKEN_SECRET, {expiresIn: process.env.REFRESH_TOKEN_SECRET_EXPIRY});
}

export const User = mongoose.model('User', userSchema);