import express from "express"
import dotenv from "dotenv"
import { connectDb } from "./config/db.js"
import { handleFollow, login, registerUser } from "./models/User/UserActions.ts"
import { tokenVerify } from "./middlewares/verifyToken.ts"
import Post from "./models/Posts/Post.ts"
import { addPost, delPost, getUserPosts, hanldeLikePost, updatePost } from "./models/Posts/PostActions.ts"
dotenv.config() // Connecting to .env file

const app = express()
const PORT = process.env.PORT || 5000

connectDb() // Connecting to the Mongo DB

app.get("/", tokenVerify, async (req, res) => {
    //const user = await login("emailingobeybi@gm.com","password123")
    //const user = await addPost("oyyyyy", "yeeeyyyyy", req.user.user_id)
    // const addedPost = await addPost("New POst!", "SelamPost!", req.user.user_id)
    const likePost = await handleFollow(req.user.user_id, "68b5745328cba468f4b02e2f")
    res.status(200).json({
        message: likePost
    })
})
// registerUser("My new account","bababa@gmail.com","hellobro23")
// "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjhiNjczMzA1ZjEwN2ZmYzZlMDljZmUxIiwidXNlcm5hbWUiOiJNeSBuZXcgYWNjb3VudCIsImlhdCI6MTc1Njc4NzUyMCwiZXhwIjoxNzU2ODczOTIwfQ.VMJ85kjt09BC3YsiWEplGb2PIj-_mYEvcHXDtXGu_CE"
app.listen(PORT, () => {
    console.log("hi port", PORT)
})