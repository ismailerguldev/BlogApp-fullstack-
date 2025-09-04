import mongoose from "mongoose";
import { config } from "./config.ts";
export const connectDb = async () => {
    try {
        mongoose.set('strictQuery', false)
        const con = await mongoose.connect(config.MONGODB_URI)
        console.log("Database Connected Successfully:", con.connection.host)
    } catch (error) {
        console.error("An error occured while connecting to Mongo DB:", error)
    }
}