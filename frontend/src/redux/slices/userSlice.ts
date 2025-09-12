import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'
import { IUser } from '@/src/models/UserModel'



const initialState: IUser = {
    username: "ismail",
    user_id: "12312312312",
    email: "livzaesportsvalex@gmail.com",
    totalPost: 5,
    followers: 150,
    followings: 12,
    likeCount: 51
}

export const userSlice = createSlice({
    name: 'user',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        // Use the PayloadAction type to declare the contents of `action.payload`
        setUser: (state, action: PayloadAction<IUser>) => {
            return action.payload
        },
        incPost: (state, action: PayloadAction<number>) => {
            return { ...state, totalPost: state.totalPost + action.payload }
        },
        incFollower: (state, action: PayloadAction<number>) => {
            state.followers += action.payload
        },
        incFollowing: (state, action: PayloadAction<number>) => {
            state.followings += action.payload
        },
        removeUser: (state) => {
            return {
                followers: 0,
                followings: 0,
                totalPost: 0,
                user_id: "",
                username: "",
                email: "",
                likeCount: 0
            }
        }
    },
})

export const { setUser, removeUser, incFollower, incFollowing, incPost } = userSlice.actions

export default userSlice.reducer