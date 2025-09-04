import express from "express"
import { connectDb } from "./config/db.js"
import userRouter from "./routes/userRoutes.ts"
import postRouter from "./routes/postRoute.ts"
import { emailVerification } from "./services/emailVerification.ts"
import { config } from "./config/config.ts"
const app = express()
const PORT = config.PORT || 5000

await connectDb() // Connecting to the Mongo DB
await emailVerification() // Connecting to email verification service
app.use(express.json())
app.use("/user/", userRouter)
app.use("/post/", postRouter)
app.listen(PORT, () => {
    console.log("hi port", PORT)
})