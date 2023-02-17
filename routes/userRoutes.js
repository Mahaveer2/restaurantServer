import express from "express";
import { signInController, signUpController } from "../controller/userController.js";

const router = express.Router();

router.post('/signin',signInController);
router.post('/signup',signUpController);

export default router;