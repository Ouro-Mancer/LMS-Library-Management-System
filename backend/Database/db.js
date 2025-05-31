import mongoose from "mongoose";

export const connectDB = ()=>{
    mongoose
    .connect(process.env.MONGO_URI, {
        dbName: "MERN_STACK_LMS",
        
    })
    .then(()=>{
        console.log('Database Connected Sucessfully...');
    })
    .catch((err)=>{
        console.log("Error Connected to database",err);
    });
}