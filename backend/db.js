import mongoose from 'mongoose'
import dotenv from 'dotenv';

dotenv.config();

const MONGOID=process.env.MONGOID;

const mongo=async()=>{
    try {
        const mongoDB=mongoose.connect(MONGOID);
        console.log('mongodb is conncetd');

        
    } catch (error) {
        console.log("mongodb is not connected");
    }
}

export default mongo;
