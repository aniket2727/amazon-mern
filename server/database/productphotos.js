



const mongoose = require('mongoose');

const getSliderSchema = new mongoose.Schema({
  category: String,
  address: String, // Use String type for image addresses
});

const getSliderImage = mongoose.model('productPhots', getSliderSchema);

module.exports = getSliderImage;
