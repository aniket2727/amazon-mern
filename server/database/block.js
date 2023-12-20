


const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    captions: [String],
    image: String,
  });
  
  // Create a mongoose model based on the schema
  const Product = mongoose.model('blockData', productSchema);
  module.exports=Product


  const initializeDatabase = async () => {
    try {
      const existingProducts = await Product.find();
  
      // Check if the collection is empty before inserting sample data
      if (existingProducts.length === 0) {
        await Product.insertMany([
          {
            name: 'Sample Product 1',
            price: 99.99,
            captions: ['Sample Caption 1'],
            image: 'sample_image_1.jpg',
          },
          {
            name: 'Sample Product 2',
            price: 149.99,
            captions: ['Sample Caption 2'],
            image: 'sample_image_2.jpg',
          },
          // Add more sample products as needed
        ]);
  
        console.log('Sample data inserted successfully.');
      }
    } catch (error) {
      console.error('Error initializing database:', error);
    }
  };
  
  // Call the function to initialize the database
  initializeDatabase();
  