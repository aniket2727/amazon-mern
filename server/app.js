


const express = require('express');
const cors = require('cors');
const app = express();

const jwt = require('jsonwebtoken')
jwt_key = "e-comm"

const bcrypt = require('bcrypt');
const saltRounds = 10; // Number of salt rounds
app.use(cors());

app.use(express.json());
require('./database/config'); // Database
const userInfo = require('./database/userInfo'); // Collections for the logins and logout
const Product = require('./database/block') //coollcetions for the prodcuts
const sliderimage = require('./database/productphotos')  //collcetions for small sliders
const productData = require('./database/productData'); // Collections for specific products
const carts = require('./database/productCart')//collcetions for carts
const purchased = require('./database/productPerchased') // colcetions for purchased product





// 1 api
// register api for user  resisters

app.post('/register', async (req, resp) => {

    try {
        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const exist = await userInfo.findOne({ email });
        if (exist) {
            return resp.status(400).json({ error: 'Email is already registered' });
        }
        const newUser = new userInfo({ name, email, password: hashedPassword });
        const savedUser = await newUser.save();
        return resp.status(200).json({ savedUser });
    } catch (error) {
        resp.status(500).json({ error: 'Internal Server Error' });
    }
});


//2 api
//login api for user



app.post('/login', async (req, resp) => {
    try {
        const { email, password } = req.body;
        const user = await userInfo.findOne({ email });
        if (!user) {
            return resp.status(404).json({ error: "User not found" });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (passwordMatch) {
            const userWithoutPassword = {
                _id: user._id,
                name: user.name,
                email: user.email,
            };

            return resp.status(200).json({ user: userWithoutPassword });
        } else {
            return resp.status(401).json({ info: "Password does not match" });
        }
    } catch (error) {
        console.error('Error during login:', error);
        resp.status(500).json({ error: 'Internal Server Error' });
    }
});



// 3 api for block data 
app.get('/products', async (req, res) => {
    try {

        const products = await Product.find();
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//apis 4  
// slider images for small slider 
app.get('/sliderimage/:productname', async (req, resp) => {
    try {
        const productName = req.params.productname; // Trim whitespaces from the product name
      //  console.log('Product Name:', productName);
        const data = await sliderimage.find({ category: productName });
       // console.log('Addresses:', data);

        resp.json(data);
    } catch (error) {
        console.error('Error fetching slider images:', error);
        resp.status(500).json({ error: 'Internal Server Error' });
    }
});



//apis 5 
//for getting  products  according to the name
app.get('/product-data/:productname', async (req, resp) => {
    try {
        const productType = req.params.productname;
       // console.log('podduct auth', req.body)
        const data = await productData.find({ category: productType }).limit(6);
        resp.json(data);
    } catch (error) {
        resp.status(500).json({ error: 'Internal Server Error' });
    }
});


//apis 6
// adding data to carts
app.post('/addcarts', async (req, resp) => {
    try {
        const { productname, email } = req.body; // Getting data from users
      //  console.log("this is email", email)
        //console.log("this is product name", productname)
        const addData = new carts({ email, productname }); // Converting into format
        const savedCarts = await addData.save(); // Data saved
        resp.json(savedCarts);
      //  console.log(savedCarts)
    } catch (error) {
        resp.status(500).json({ error: 'Internal Server Error' });
    }
});


//apis 7
//getting data from carts

app.get('/getcartsData/:email', async (req, resp) => {
    try {
        const email = req.params.email;
        const cartData = await carts.find({ email: email });
        const Selected_data = cartData.map(item => item.productname)
        resp.json(Selected_data);

    } catch (error) {
        resp.status(500).json({ error: 'Internal Server Error' });
    }

});



//apis8
//adding data to perchase collcetions
app.post('/shopping', async (req, resp) => {
    try {
        const { name, email, totalprice, count } = req.body;
        //console.log(name, email, totalprice, count)
        const added_product = new purchased({ name, email, totalprice, count });
        const saved_data = await added_product.save();

        // Respond with all fields in the saved data
        resp.json(saved_data);
    } catch (error) {
        console.error('Error:', error);
        resp.status(500).json({ error: "Internal Server Error" });
    }
});

//api 9
//getting data from perchased product
app.get('/getshopingData/:email', async (req, resp) => {
    try {
        const email = req.params.email;
        const cartData = await purchased.find({ email: email });
        resp.json(cartData);

    } catch (error) {
        resp.status(500).json({ error: 'Internal Server Error' });
    }

});



//apis 10
//deleted shoping data
const { ObjectId } = require('mongodb'); // Import ObjectId from MongoDB library
app.post('/productdelete', async (req, res) => {
    try {
        const {id} = req.body;
        // Convert the id to a valid ObjectId
        const objectId = new ObjectId(id);
        const deletedProduct = await purchased.deleteOne({ _id: objectId });
        console.log('The deleted product is', deletedProduct);
        res.json({ success: true, message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

// second options for delete
app.delete('/productdelete/:id', async (req, res) => {
    try {
        const { id } = req.params; // Use req.params to get the id from the URL
        // Convert the id to a valid ObjectId
        const objectId = new ObjectId(id);
        const deletedProduct = await purchased.deleteOne({ _id: objectId });
        console.log('The deleted product is', deletedProduct);
        res.json({ success: true, message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});



//apis for delete  cartdata
app.post('/deletecarts', async (req, resp) => {
    try {
        const { productname } = req.body;
        const deletedcarts = await carts.deleteOne({ productname: productname });
        console.log('The carts product is', deletedcarts);
        resp.json({ success: true, message: 'carts deleted successfully' });
    } catch (error) {
        console.error('Error deleting carts:', error);
        resp.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});


function verifyToken(req, resp, next) {
    let token = req.headers['authorization'];
    if (!token) {
        return resp.status(401).json({ error: 'Unauthorized: Token is missing' });
    }
    if (token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
        jwt.verify(token, jwt_key, (error, decoded) => {
            if (error) {
                return resp.status(401).json({ error: 'Unauthorized: Invalid token' });
            } else {
                console.log(token)
                next();
            }
        });
    } else {
        return resp.status(400).json({ error: 'Bad Request: Token should start with "Bearer "' });
    }
}

app.listen(6005, () => {
    console.log("this is running on 6005")

})