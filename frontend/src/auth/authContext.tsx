import { createContext, useState } from "react";
import React from "react";
import { useAppDispatch } from "../redux/hooks";
import { setUser } from "../redux/slices/userSlice";
import AsyncStorage from "@react-native-async-storage/async-storage"
interface IUser {
    username: string,
}
interface IContext {
    isAuth: boolean,
    isVerified: boolean,
    signIn: (email: string, password: string) => Promise<any>,
    verificateEmail: (user_id: string, code: string) => Promise<any>
    signOut: () => void
}
export const AuthContext = createContext<IContext>(
    {
        isAuth: false,
        isVerified: false,
        signIn: async () => { },
        signOut: () => { },
        verificateEmail: async () => { }
    }
);
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuth, setIsAuth] = useState<boolean>(false)
    const [isVerified, setIsVerified] = useState<boolean>(false)
    const dispatch = useAppDispatch()
    const signIn = async (email: string, password: string) => {
        try {
            const res = await fetch("http://192.168.1.76:5000/user/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ email, password })
                }
            )
            const data = await res.json()
            if (data) {
                setIsAuth(true)
                return data
            }
        } catch (error: any) {
            throw new Error("An error occured while login", error)
        }
    }
    const verificateEmail = async (user_id: string, code: string) => {
        try {
            const res = await fetch("http://192.168.1.76:5000/user/verify",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ user_id, code })
                }
            )
            const data = await res.json()
            if (data) {
                console.log(data.token)
                await AsyncStorage.setItem("token",data.token)
                dispatch(setUser(data.user))
                setIsVerified(true)
                return data
            }
        } catch (error: any) {
            throw new Error("An error occured while verify", error)
        }
    }
    const signOut = () => {
        // çıkış yapılıyor
        setIsAuth(false)
        setIsVerified(false)
    }
    return (
        <AuthContext.Provider value={{ isAuth, isVerified, signIn, signOut, verificateEmail }}>
            {children}
        </AuthContext.Provider>
    )
}