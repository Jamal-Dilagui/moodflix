import mongoose from "mongoose";

export const connectMongoDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB_URL);
        console.log('Database Connected');
    } catch (error) {
        console.log('Error connecting Database', error);
        throw error;
    }
}