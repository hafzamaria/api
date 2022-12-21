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
  origin: ['http://localhost:3000', "*", ''],
  
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
     
      category:{
        type:String,
        enum:{
           values:["mobile" , 'laptop' ,'watch', 'led',"accessories"],
           message:`{values} is not supported`,
        }
      },
      image: { type: String },
 });
 const productModel = mongoose.model('Products', productSchema);

//  ////////////////////////////////////////


app.get('/', async (req , res) => {

  const { company , name , price,sort , select,category,image,featured} = req.query;
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
if(category){
  queryObject.category = category;
}
if(featured){
  queryObject.featured = featured;
}
if(image){
  queryObject.image = image;
}
 
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
let limit=Number(req.query.limit) || 7;
let skip=(page - 1)* limit;

apiData = apiData.skip(skip).limit(limit);////pagination formula

console.log(queryObject);
  const myData = await apiData;
  // .sort('price');///we can search in  asending order by .sort('name')('price')& decending order by .sort('-name')('-price')
  console.log(req.query);
  res.status(200).send({myData , nbHits:myData.length});
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
          "featured": true,
          "company": "apple",
   "category":"mobile",
   "image":"data:image/jpeg;base64,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"},
      {
          "name": "iphone10",
          "price": 1154,
          "featured": true,
          "company": "apple",
          "category":"accessories",
          "image":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIAbBk66fG2yBNzI6YFn2eq2tgBleE9nn_mA&usqp=CAU",
      },
      {
          "name": "watch",
          "price": 204,
          "company": "apple",
          "category":"watch",
      },
      {
          "name": "iphone13",
          "price": 154,
          "feature": false,
          "company": "apple",
          "category":"mobile",
      },
      {
          "name": "android",
          "price": 154,
          "feature": false,
          "company": "samsung",
          "category":"mobile",
      },
      {
          "name": "watch10",
          "price": 154,
          "featured": true,
          "company": "samsung",
          "category":"watch",
          "image":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYeDwC4YCG1P4huqAFLxgfdY2nHmwiZCCgXg&usqp=CAU",
      },
      {
          "name": "LED",
          "price": 154,
          "feature": false,
          "company": "dell",
          "category":"led",
      },
      {
        "name": "LED",
        "price": 157,
        "featured": false,
        "company": "mi",
        "category":"led",
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