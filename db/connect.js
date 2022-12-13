import mongoose from "mongoose";
dbURI ='mongodb+srv://abcd:abcd@cluster0.0nsp7aq.mongodb.net/Api?retryWrites=true&w=majority';


const connectDB =()=>{
    console.log('mongoose connected');
    return mongoose.connect(dbURI,{
        useNewUrlParser:true,
        useUnifiedTopology:true,
    })
}

export default connectDB