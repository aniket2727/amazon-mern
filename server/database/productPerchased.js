


const mongoose = require('mongoose');
const purchasedProductSchema = new mongoose.Schema({
    name: String,
    email: String,
    totalprice: Number,
    count: Number
});

const purchasedProduct = mongoose.model('shoping', purchasedProductSchema);
module.exports = purchasedProduct;