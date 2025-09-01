import User from "./User.ts";

export const registerUser = async (username: string, email: string, password: string): Promise<object> => {
    try {
        const user = await User.create({
            username, email, password
        })
        if (user) {
            return user
        } else {
            throw new Error("An error occured while register user")
        }
    } catch (error) {
        throw new Error("An error occured while register user")
    }
}