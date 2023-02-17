import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import axios from "axios";
import { userSchema as User } from "../models/models.js";
import config from "config";

const signInController = async (req,res) => {
  if(req.body.googleAccessToken){
    //google
    axios.get('https://www.googleapis.com/oauth2/v3/userinfo',{
      headers:{
        'Authorization':`Bearer ${req.body.googleAccessToken}`
      }
    }).then(async response => {
      const email = response.data.email;

      const alreadyExistUser = await User.findOne({email});

      if(!alreadyExistUser){
        return res.status(400).json({message:"User don't exists!"});
      }

      const token = jwt.sign({
        email:alreadyExistUser.email,
        id:alreadyExistUser._id
      },config.get("JWT_SECRET"),{expiresIn:"14d"})

      return res.status(200).json({result:alreadyExistUser,token});
    });
  }else{
    //normal
    const {email,password} = req.body;
    if(email == "" || password == ""){
      res.status(400).json({message:"Invalid Feilds"})
    }

    try {
      const alreadyExistUser = await User.findOne({email});

      if(!alreadyExistUser){
        return res.status(400).json({message:"User don't exists!"});
      }

      const isPasswordCorrect = await bcrypt.compare(password,alreadyExistUser.password)

      if(!isPasswordCorrect) return res.status(400).json({message:"Invalid Credentials!"})

      const token = jwt.sign({
        email:alreadyExistUser.email,
        id:alreadyExistUser._id
      },config.get("JWT_SECRET"),{expiresIn:"14d"});

      res.status(200).json({result:alreadyExistUser,token})
    } catch (error) {
      console.log(error)
    }
  }
}

const signUpController = async (req,res) => {
  if(req.body.googleAccessToken){
    //google oauth signup
    axios.get('https://www.googleapis.com/oauth2/v3/userinfo',{
      headers:{
        'Authorization':`Bearer ${req.body.googleAccessToken}`
      }
    }).then(async response => {
      const firstName = response.data.given_name;
      const lastName = response.data.family_name;
      const email = response.data.email;
      const picture = response.data.picture;

      const alreadyExistUser = await User.findOne({email});

      if(alreadyExistUser){
        return res.status(400).json({message:"User already exists!"});
      }

      const result = await User.create({firstName,lastName,email,profilePic:picture})
      const token = jwt.sign({
        email:result.email,
         id:result._id,
      },config.get("JWT_SECRET",{
        expiresIn:"14d"
      }))

      res.status(200).json({result,token})
    }).catch(err => {
      res.status(400).json({message:err})
    })
  }else{
    //normal formdata
    const {email,firstName,lastName,confirmPassword,password,picture} = req.body;

    if (email === "" || picture =="" || password === "" || firstName === "" || lastName === "" && password === confirmPassword && password.length <= 4) {
      res.status(400).json({message:"Invalid feilds!"})
    } 

    try {
      const alreadyExistUser = await User.findOne({email});
      const hashedPassword = await bcrypt.hash(password, 12);

      if(alreadyExistUser){
        return res.status(400).json({message:"User already exists!"});
      }

      const result = await User.create({
        firstName,
        lastName,
        email,
        password:hashedPassword,
        profilePic:picture})
      console.log("CREATED USER")
      const token = jwt.sign({
        email:result.email,
         id:result._id,
      },config.get("JWT_SECRET",{
        expiresIn:"14d"
      }))

      res.status(200).json({result,token})

    } catch (error) {
      console.log(error)
      return res.status(400).json(error)
    }
  }
};

export {signInController,signUpController};