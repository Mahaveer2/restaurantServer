import express from "express";
import { getProduct,orderController,getSubscription, postOrder } from "../controller/orderController.js";
const router = express.Router();

router.post('/create-order',orderController);
router.post('/create',postOrder);
router.post('/get-subscriptions',getSubscription);
router.get('/products',getProduct);
export default router;