import express from 'express';

const app = express();
import mongoose from 'mongoose';
import ('dotenv').config;///npm i dotenv extention for secure ur private data
import cors from 'cors';

const PORT = process.env.PORT || 5000;

let dbURI ='mongodb+srv://abcd:abcd@cluster0.0nsp7aq.mongodb.net/Api?retryWrites=true&w=majority';
mongoose.connect(dbURI);
// app.get('/' ,(req , res)=>{
//     res.send('Hi i am live!')
// })
app.use(cors({/////jwt work
  origin: ['http://localhost:5000', "*", ''],
  
}));
//////////Schema/////////////////
const productSchema = new mongoose.Schema({ ///from mongoose
  name :{
      type:String,
       required:true
      },
  price:{
      type:Number,
       required:[true, 'price must be provided'],
      },
 featured:{
  type:Boolean,
   required:false,
  },
 rating :{
  type:Number,
   default:4.9,
  },
   createdOn:{ 
      type: Date,
       default: Date.now (),
      },
   company:{
      type:String,
       enum:{
          values:['apple', 'samsung' , 'dell' , 'mi'],
          message:`{values} is not supported`,
       }
      },
 });
 const productModel = mongoose.model('Products', productSchema);

//  ////////////////////////////////////////

app.get('/', async (req , res) => {
  const myData = await productModel.find(req.query);
  console.log(req.query);
  res.status(200).send({myData: myData});
})
app.get('/testing', async (req , res) => {
  const myData = await productModel.find(req.query);
  ////req.query se hm ksi b chez ko uski compny ya name ya ksi b chez se search kr skte h(req.query)is mostly used for searching,sorting & pagination
  console.log(req.query);
  res.status(200).send({myData: myData});
  // res.status(200).json({msg:'I am getAllProductsTesting'})
  
})

const start = async () =>{
    try{
      // await connectDB(process.env.MONGODB_URL)
    await productModel.create([
      {
          "name": "iphone",
          "price": 154,
          "feature": true,
          "company": "apple"
  
      },
      {
          "name": "iphone10",
          "price": 1154,
          "feature": true,
          "company": "apple"
  
      },
      {
          "name": "watch",
          "price": 204,
          "company": "apple"
  
      },
      {
          "name": "iphone",
          "price": 154,
          "feature": true,
          "company": "apple"
  
      },
      {
          "name": "android",
          "price": 154,
          "feature": true,
          "company": "samsung"
  
      },
      {
          "name": "watch10",
          "price": 154,
          "company": "samsung"
  
      },
      {
          "name": "LED",
          "price": 154,
          "feature": true,
          "company": "dell"
  
      },
      {
        "name": "LED",
        "price": 154,
        "feature": true,
        "company": "mi"

    }

  
  ]);
    console.log('success');
      
 app.listen(PORT, ()=>{
    console.log(`${PORT} yes i am connected!`);
 });
    }catch(err){
  console.log(err);
    }
}

start();
//////////////mongodb connected disconnected events///////////////////////////////////////////////
mongoose.connection.on('connected', function () { //connected
    console.log("mongoose connected");
});

mongoose.connection.on('disconnected', function () {//disconnected
    console.log("Mongoose is disconnected");
    process.exit(1);
});

mongoose.connection.on('error', function (err) {//any error
    console.log('Mongoose connection error: ', err);
    process.exit(1);
});


process.on('SIGINT', function () {/////this function will run jst before app is closing
    console.log("app is terminating");
    mongoose.connection.close(function () {
        console.log('Mongoose default connection closed');
        process.exit(0);
    });
});

//////////////////////////////////////