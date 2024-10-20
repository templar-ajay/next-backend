import mongoose from "mongoose";

export async function connectDB() {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI not found in environment variables");
  }
  try {
    mongoose.connect(process.env.MONGO_URI);
    const connection = mongoose.connection;

    connection.on("connected", () => {
      console.log("MongoDB connected");
    });

    connection.on("error", (err) => {
      console.log(
        "Mongodb connection error, please make sure db is up and running: ",
        err
      );
      process.exit(1);
    });
  } catch (err: any) {
    console.error("error connecting to db", err.message);
  }
}
