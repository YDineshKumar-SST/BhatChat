import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGODB_URL;
    if (!mongoUri) {
      throw new Error("MONGODB_URI or MONGODB_URL is not defined in .env");
    }

    const instance = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`MongoDB Connected: ${instance.connection.host}`);
  } catch (error) {
    console.error("\n❌ MongoDB Connection Error:", error.message);
    if (error.message.includes("Could not connect to any servers")) {
      console.error(
        "👉 Reason: Your current IP is likely not whitelisted in MongoDB Atlas.\n" +
        "   Go to MongoDB Atlas -> Network Access -> Add IP Address -> Allow Access from Anywhere (0.0.0.0/0) or add your current IP.\n"
      );
    }
  }
};
