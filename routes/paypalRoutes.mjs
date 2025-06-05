import express from 'express';
import {capturePaypalOrder, createPaypalOrder} from '../controllers/paypalController.mjs';

const router = express.Router();

router.get('/create-order', createPaypalOrder);
router.get('/capture-order', capturePaypalOrder);

export default router;