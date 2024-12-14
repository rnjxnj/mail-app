import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: "../.env"});

const uri = process.env.MONGO_URI || ""; 
const connectToDB = async () => {
    try {
        const conn = await mongoose.connect(uri, {
            autoIndex: true
        });
        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
};

export default connectToDB;