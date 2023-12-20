const mongoose=require('mongoose')
const userInfoSchema=new mongoose.Schema({
    name:String,
    email:String,
    password:String
})


const userInfo=mongoose.model("userinfo",userInfoSchema)

module.exports=userInfo
