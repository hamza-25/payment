import express from 'express';
import {capturePaypalOrder, createPaypalOrder} from '../controllers/paypalController.mjs';

const router = express.Router();

router.post('/create-order', createPaypalOrder);
router.post('/capture-order', capturePaypalOrder);

export default router;