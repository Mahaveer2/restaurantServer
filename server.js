import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import aiRoutes from "./routes/openai.routes.js";
import { createProducts } from "./utils/createProducts.js";
import config from "config";
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()

const app = express();

app.use(cors());
app.use(express.json());
app.use("/users",userRoutes);
app.use("/orders",orderRoutes);
app.use("/ai",aiRoutes);


const PORT = process.env.PORT || 3000;
const MOONGOSE_URL = "mongodb+srv://mahaveer:FRioMqwdQl2sSrMn@cluster0.hlb0fj0.mongodb.net/?retryWrites=true&w=majority";
mongoose.set('strictQuery', true);
mongoose.connect(MOONGOSE_URL,{useNewUrlParser:true}).then(() => {
  app.listen(PORT,() => {
    createProducts();
    console.log(`Server listening on http://localhost:${PORT}/`);
  })
  app.get('/',(req,res) => {
    return res.status(200).json({message:"Welcome to the api"})
  })
}).catch(err => {
  console.error(err);
})