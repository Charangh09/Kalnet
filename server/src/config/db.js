import mongoose from "mongoose";

export const connectToDatabase = async () => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    console.log(
      "MONGODB_URI not provided. Running without database persistence.",
    );
    return;
  }

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error(
      "MongoDB connection failed. Continuing without persistence:",
      error.message,
    );
  }
};
