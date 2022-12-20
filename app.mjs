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
 feature:{
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
     
      category:{
        type:String,
        enum:{
           values:["mobile" , 'laptop' ,'watch', 'led'],
           message:`{values} is not supported`,
        }
      }
 });
 const productModel = mongoose.model('Products', productSchema);

//  ////////////////////////////////////////


app.get('/Products', async (req , res) => {

  const { company , name , price,sort , select} = req.query;
const queryObject = {};

if(company) {
  queryObject.company = company;
 
}
if(name){
  queryObject.name ={$regex:name , $options:"a"}////$regex from mongodb $regex use for searching filter

}
if(price){
  queryObject.price = price;
}

// if(feature){
//   queryObject.feature = feature;
// }
 
let apiData = productModel.find(queryObject);

if (sort){
  let sortFix =sort.split(',').join ( ' ');
  apiData =apiData.sort( sortFix);
}
if (select){
  // let selectFix =select.replace(',' , ' ');
  let selectFix =select.split(',').join ( ' ');
  apiData =apiData.select( selectFix);
}

let page = Number(req.query.page) || 1;
let limit=Number(req.query.limit) || 3;
let skip=(page - 1)* limit;

apiData = apiData.skip(skip).limit(limit);////pagination formula

console.log(queryObject);
  const myData = await apiData;
  // .sort('price');///we can search in  asending order by .sort('name')('price')& decending order by .sort('-name')('-price')
  console.log(req.query);
  res.status(200).json({myData , nbHits:myData.length});
})

https://api-production-66d4.up.railway.app
////api link
app.get('/testing', async (req , res) => {
  const myData = await productModel.find(req.query).select('name company');
  ////req.query se hm ksi b chez ko uski compny ya name ya ksi b chez se search kr skte h(req.query)is mostly used for searching,sorting & pagination
  console.log(req.query);
  
    res.status(200).send({myData: myData});
  
  
  // res.status(200).json({msg:'I am getAllProductsTesting'})
  
})

const start = async () =>{
    try{
      // await connectDB(process.env.MONGODB_URL)
      await productModel.deleteMany();///is se xtra data ni aaega
    await productModel.create([
      {
          "name": "iphone12",
          "price": 150,
          "feature": true,
          "company": "apple",
  ' category':"mobile",
      },
      {
          "name": "iphone10",
          "price": 1154,
          "feature": true,
          "company": "apple",
          ' category':"mobile",
      },
      {
          "name": "watch",
          "price": 204,
          "company": "apple",
          ' category':"watch",
      },
      {
          "name": "iphone13",
          "price": 154,
          "feature": false,
          "company": "apple",
          ' category':"mobile",
      },
      {
          "name": "android",
          "price": 154,
          "feature": false,
          "company": "samsung",
          ' category':"mobile",
      },
      {
          "name": "watch10",
          "price": 154,
          "company": "samsung",
          ' category':"watch",
      },
      {
          "name": "LED",
          "price": 154,
          "feature": false,
          "company": "dell",
          ' category':"led",
      },
      {
        "name": "LED",
        "price": 157,
        "feature": false,
        "company": "mi",
        ' category':"led",
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