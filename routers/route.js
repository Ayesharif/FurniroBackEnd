import express from 'express'
const router = express.Router();
import {getData, greetings} from '../controller/userController.js';

router.use((req, res, next) => {
    console.log('Time:', Date.now());
    next();
});

router.get('/test', greetings);

export default  router;
