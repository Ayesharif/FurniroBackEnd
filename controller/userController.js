import express from 'express'
const greetings=(req, res)=>{
        res.send("Hello working");
}
const getData=(req, res)=>{
        res.json({
            message:"done"
        });
}

export { greetings, getData };
