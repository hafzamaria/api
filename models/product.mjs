import mongoose from 'mongoose';

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


   export default productModel = mongoose.model('Product', productSchema);
