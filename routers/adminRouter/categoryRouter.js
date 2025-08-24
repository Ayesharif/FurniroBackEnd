import express from 'express'
import { client } from '../../dbConfig.js';
import { ObjectId } from 'mongodb';
const router = express.Router();
const myDB = client.db("myEcommerce");
const Categorys = myDB.collection("Categorys");


router.get('/admin/category',async (req, res) =>{
  
  const  allCategory=Categorys.find();
  const response= await allCategory.toArray();
  if(response.length >0){
return res.send({
    status : 1,
      message : "All Categorys got Successfully",
      data : response
})
  
  }else{

    return res.send({
    status : 0,
      message : "No Categorys found"
})
  }

})

router.post('/admin/category',async (req, res) =>{

    if(!req.body.title && !req.body.image){
    return res.send({
    status : 0,
      message : "No Categorys found"
})      
    }
const Category={
        title: req.body.title,
        image: req.body.image
    }
  const response=  await Categorys.insertOne(Category);
if(response){
return res.send({
    status : 1,
      message : "Category Added Successful",
})
  }
  else{
  return res.send({
    status : 0,
      message : "Something went wrong",
})
  }
})


router.delete('/admin/category/:id', async (req, res)=>{
    
    const CategoryId = new ObjectId(req.params.id);
const deleteCategory = await Categorys.deleteOne({_id: CategoryId});

if(deleteCategory) {
return res.send({
    status : 1,
      message : "Category Deleted Successful",
})
}else{
    return res.send({
       status: 0,
        message:"something went wrong"
    })
}
})


router.put('/admin/category/:id', async (req, res ) =>{
  const CategoryId= new ObjectId(req.params.id);
const updateCategory={
$set: {  title: req.body.title,
  description: req.body.description}
}
const result= await Categorys.updateOne({_id: CategoryId}, updateCategory);
if(result){
  return res.send("updated");
  
}else{
  return res.send("some thing went wrong");

}
})

export default router;