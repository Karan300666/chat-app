import mongoose from "mongoose";


function connectDB(){
    mongoose.connect(process.env.DATABASE_URI)
    .then(() => {
        console.log('Connect to Data Base') 
    })
    .catch((err) => {
        console.log("Don't connect to Data Base" , err);
    })
}

export default connectDB;