import express from 'express'
import { client } from '../../dbConfig.js';
import { ObjectId } from 'mongodb';
const router = express.Router();
const myDB = client.db("myEcommerce");
const Users = myDB.collection("users");


router.get('/admin/user',async (req, res) =>{
  
  const  allUser=Users.find();
  const response= await allUser.toArray();
  if(response.length >0){
return res.send({
    status : 1,
      message : "All Users got Successfully",
      data : response
})
  
  }else{

    return res.send({
    status : 0,
      message : "No Users found"
})
  }

})




router.put('/admin/User/:id', async (req, res ) =>{
  const UserId= new ObjectId(req.params.id);
  const User = await Users.findOne({_id:UserId});
  let status="";
  if(!User){
    return res.send({
    status : 0,
      message : "No Users found"
})  
  }
  if(User.status== "active"){
status="blocked";
  }
  else{
    status="active";
  }
  
let updateUser={
$set: {  status: status}
}
const result= await Users.updateOne({_id: UserId}, updateUser);
if(result){
  return res.send({
    status : 1,
      message : "User updated Successfully",
      data: result
})   
}else{

  return res.send({
    status : 0,
      message : "some thing went wrong"
})   
}
})

export default router;