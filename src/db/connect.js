import mongoose from 'mongoose';
import { DB_Name } from '../constant.js';

const connectDB = async () => {
    
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_Name}`);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        process.exit(1);
    }
};

export default connectDB;