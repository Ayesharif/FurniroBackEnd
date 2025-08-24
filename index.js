import adminAuthRoutes from './routers/adminRouter/adminAuthRouter.js'
import adminRoutes from './routers/adminRouter/adminActivityRouter.js'
import express from 'express'
import {client} from './dbConfig.js'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import jwt from 'jsonwebtoken'
dotenv.config()

try {
    await client.connect();
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ Connection error:", error);
    process.exit(1);
  }

const app = express();
const port = process.env.PORT||3000

app.use(express.json());
app.use(cookieParser());

app.use(adminAuthRoutes);

app.use((req, res, next)=>{
  try{
  const decode= jwt.verify(req.cookies.token, process.env.SECRET_KEY);
  next()

  }
  catch(error){
return res.send({
  status: 0,
  error: error,
  message: "Invalid Token"
})
  }
})


app.use(adminRoutes);

app.listen(port, () => {
    console.log("Server running at http://localhost:3000");
});
