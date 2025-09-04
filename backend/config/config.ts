import dotenv from "dotenv"
dotenv.config()
export const config = {
    PORT: process.env.PORT,
    MONGODB_URI: process.env.MONGODB_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    VERIFICATION_EMAIL: process.env.VERIFICATION_EMAIL,
    VERIFICATION_PASSWORD: process.env.VERIFICATION_PASSWORD,
    REDIS_HOST: process.env.REDIS_HOST,
    REDIS_PORT: process.env.REDIS_PORT,
    REDIS_PASSWORD: process.env.REDIS_PASSWORD,
}