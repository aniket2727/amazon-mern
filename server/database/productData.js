


const mongoose = require('mongoose');
const productDetailsSchema = new mongoose.Schema({
    name: String,
    price: String,
    caption: String,
    category: String,
    image: String
});

const ProductDetails = mongoose.model('ProductData', productDetailsSchema);

module.exports = ProductDetails;
