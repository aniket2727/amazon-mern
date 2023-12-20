const mongoose=require('mongoose')

const cartsSchema=new mongoose.Schema({
    email:String,
    productname:String
})


const Carts=mongoose.model('cartsdata',cartsSchema)
module.exports=Carts