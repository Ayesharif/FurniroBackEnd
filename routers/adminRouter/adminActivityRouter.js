import express from 'express'

import categoryRouter from '../adminRouter/categoryRouter.js'
import userRouter from '../adminRouter/userRouter.js'
import productRouter from '../adminRouter/productRouter.js'

const router = express.Router();
router.use(categoryRouter);
router.use(userRouter);
router.use(productRouter);

export default  router;