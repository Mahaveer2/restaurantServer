import bcrypt from "bcrypt";
import { uuid } from 'uuidv4';
import jwt from "jsonwebtoken";
import config from "config";
import Stripe from "stripe";
import moment from "moment";
import { orderSchema, productSchema } from "../models/models.js";
import uuid4 from "uuid4";

const stripe = new Stripe(config.get("STRIPE_SECRET"));

const getProduct = async (req,res) => {
  const data = await productSchema.find({});
  return res.status(200).json(data);
}
 
const orderController = async (req,res) => {
  const { priceId ,customerId,productId } = req.body;
  try {
    const url = config.get("DEV") ? "https://localhost:5173/" : config.get("WEBSITE");
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',

      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],

      success_url: url+`checkout?session_id={CHECKOUT_SESSION_ID}&productId=${productId}`,
      cancel_url: url+'checkout?fail=true',
    });
    return res.status(200).json({ session });

  } catch (error) {
    return res.status(500).json({ error });
  }
}

const postOrder = async (req, res) => {
  const { session_id,email,productId } = req.body;
  const createdAt = moment();
  const expiry = moment().add(30, 'days');


  if(session_id == "" || email == "" || productId == ""){
    return res.status(500).json({message:"error fields are required!"});
  }

  const alreadyExists = await orderSchema.findOne({productId:productId});

  if(alreadyExists){
    return res.status(200).json({message:"subscription already exists!"});
  }
  
  try{
  const product = await productSchema.findOne({id:productId});

  const data = await orderSchema.create({
    email:email,
    session_id:session_id,
    id:uuid4(),
    createdOn:createdAt,
    expiresOn:expiry,
    status:true,
    product:product.id,
  })

  return res.status(200).json({data})
  }catch(err){
    console.log(err)
    return res.status(200).json({error:err})
  }

  return res.status(200).json({message:"an error occured"})
}

const getSubscription = async (req,res) => {
  const { email } = req.body;
  const data = await orderSchema.find({email:email});
  if( data.length == 0){
    return res.status(200).json({isSubscribed:false});
  }
  
  const product = await productSchema.find({id:data[0].product})
  return res.status(200).json({data:data,isSubscribed:true,product:product});
}

export {orderController,postOrder,getSubscription,getProduct};