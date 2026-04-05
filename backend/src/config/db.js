import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    console.log('MONGO_URI:', process.env.MONGO_URI);
    // mongodb+srv://mansi:TCY7SonbKvuQgEF7@cluster0.7ekhxwv.mongodb.net/furnituredb?retryWrites=true&w=majority&appName=Cluster0
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✦ MongoDB Connected → ${conn.connection.host}`);
  } catch (error) { 
    console.error(`✗ MongoDB Connection Failed: ${error.message}`);
    process.exit(1);
  }
};