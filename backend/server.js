import express from "express"
import dotenv from "dotenv"
import { connectDb } from "./config/db.js"
import { registerUser } from "./models/User/UserActions.ts"
import { addPost, getUserPosts } from "./models/Posts/PostActions.ts"
dotenv.config() // Connecting to .env file

const app = express()
const PORT = process.env.PORT || 5000

connectDb() // Connecting to the Mongo DB

app.get("/", async (req, res) => {
    const post = await getUserPosts("68b5745328cba468f4b02e2f", 1, 1)
    res.status(200).json({
        result: post
    })
})

app.listen(PORT, () => {
    console.log("hi port", PORT)
})