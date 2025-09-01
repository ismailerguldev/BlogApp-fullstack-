import mongoose from "mongoose";
export const connectDb = async () => {
    try {
        mongoose.set('strictQuery', false)
        const con = await mongoose.connect(process.env.MONGODB_URI)
        console.log("Database Connected Successfully:", con.connection.host)
    } catch (error) {
        console.error("An error occured while connecting to Mongo DB:", error)
    }
}