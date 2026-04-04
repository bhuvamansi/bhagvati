import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    console.log('MONGO_URI:', process.env.MONGO_URI);
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    });
    console.log(`✦ MongoDB Connected → ${conn.connection.host}`);
  } catch (error) { 
    console.error(`✗ MongoDB Connection Failed: ${error.message}`);
    process.exit(1);
  }
};