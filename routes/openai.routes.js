import express from "express";
import {createProduct} from "../controller/openai.js";

const router = express.Router();

router.post('/create',createProduct);

export default router;