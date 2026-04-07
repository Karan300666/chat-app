import express from 'express'
import { AIResult } from "../controller/ai.controller.js";

const router = express.Router();
router.get('/result' , AIResult);

export default router