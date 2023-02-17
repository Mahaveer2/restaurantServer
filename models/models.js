import mongoose from "mongoose";

export const User = new mongoose.Schema({
  firstName:{type:String,required:true},
  lastName:{type:String,required:true},
  email:{type:String,required:true},
  password:{type:String},
  profilePic:{type:String,required:true},
  id:{type:String},
})

export const Review = new mongoose.Schema({
  name:{type:String,required:true},
  email:{type:String,required:true},
  review:{type:String,required:true},
  profilePic:{type:String,required:true},
  id:{type:String},
})

export const Product = new mongoose.Schema({
  id:{type:String},
  type:{type:String,enum:['monthly','yearly']},
  name:{type:String,required:true},
  amount:{type:String,required:true},
  description:{type:String,required:true},
});

export const Order = new mongoose.Schema({
  id:{type:String},
  email:{type:String,required:true},
  session_id:{type:String,required:true},
  status:{type:Boolean,required:true},
  product:{type:String,required:true},
  createdOn:{type:Date,required:true},
  expiresOn:{type:Date,required:true},
});

export const Gallery = new mongoose.Schema({
  email:{type:String,required:true},
  description:{type:String,required:true},
  src:{type:String,required:true},
  id:{type:String},
});

const userSchema = mongoose.model("Users",User);
const reviewSchema = mongoose.model("Reviews",Review);
const orderSchema = mongoose.model("Orders",Order);
const gallerySchema = mongoose.model("Gallery",Gallery);
const productSchema = mongoose.model("Product",Product);

export {userSchema, reviewSchema, orderSchema, gallerySchema,productSchema};