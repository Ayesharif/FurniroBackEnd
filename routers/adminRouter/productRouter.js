import express from 'express'
import { client } from '../../dbConfig.js';
import { ObjectId } from 'mongodb';
const router = express.Router();
const myDB = client.db("myEcommerce");
const Products = myDB.collection("products");


router.get('/admin/product',async (req, res) =>{
  
  const  allProduct=Products.find();
  const response= await allProduct.toArray();
  if(response.length >0){
return res.send({
    status : 1,
      message : "All products got Successfully",
      data : response
})
  
  }else{

    return res.send({
    status : 0,
      message : "No products found"
})
  }

})

router.post('/admin/product',async (req, res) =>{
    const product={
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
    }
  const response=  await Products.insertOne(product);
if(response){
return res.send({
    status : 1,
      message : "Product Added Successful",
})
  }
  else{
    return res.send("something went wrong")
  }
})


router.delete('/admin/product/:id', async (req, res)=>{
    
    const productId = new ObjectId(req.params.id);
const deleteProduct = await Products.deleteOne({_id: productId});

if(deleteProduct) {
    return res.send("product deleted")
}else{
    return res.send("something went wrong")
}
})


router.put('/admin/product/:id', async (req, res ) =>{
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