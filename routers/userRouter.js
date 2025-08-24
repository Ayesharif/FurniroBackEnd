import express from 'express'
import { client } from '../dbConfig.js';
import { ObjectId } from 'mongodb';
const router = express.Router();
const myDB = client.db("myEcommerce");
const Products = myDB.collection("products");


router.get('/user/product',async (req, res) =>{
  
  const  allProduct=Products.find();
  const response= await allProduct.toArray();
  if(response.length >0){
    return res.send(response)
  
  }else{

    return res.send('No products found')
  }

})

router.post('/user/product',async (req, res) =>{
    const product={
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
    }
  const response=  await Products.insertOne(product);
if(response){
      return res.send("product added successfully")
  }
  else{
    return res.send("something went wrong")
  }
})


router.delete('/user/product/:id', async (req, res)=>{
    
    const productId = new ObjectId(req.params.id);
const deleteProduct = await Products.deleteOne({_id: productId});

if(deleteProduct) {
    return res.send("product deleted")
}else{
    return res.send("something went wrong")
}
})

router.get('/user/product/:id', async (req, res)=>{
  console.log(req.params.id);
  const productId= new ObjectId(req.params.id);
  const oneProduct= await Products.findOne({_id : productId});
  // const response= await oneProduct.toArray();
  console.log(oneProduct);
  
  if(oneProduct){
    return res.send(oneProduct)
  }
  else{
    return res.send("product not found");
  }
})
router.put('/user/product/:id', async (req, res ) =>{
  const productId= new ObjectId(req.params.id);
const updateProduct={
$set: {  title: req.body.title,
  description: req.body.description}
}
const result= await Products.updateOne({_id: productId}, updateProduct);
if(result){
  return res.send("updated");
  
}else{
  return res.send("some thing went wrong");

}
})

export default router;