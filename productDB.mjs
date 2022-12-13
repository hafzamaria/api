import ('dotenv').config;
// import connectDB from './db/connect';
import Product from './models/product.mjs';
import ProductJson from './products.json';
const start = async () => {
    try{
// await connectDB (process.env.MONGODB_URL);
await Product.create(ProductJson);
    console.log('success');
    }catch(err){
        console.log(err);
    }
}

start();