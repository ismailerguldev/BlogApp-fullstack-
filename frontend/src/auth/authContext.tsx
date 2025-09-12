import { createContext, useEffect, useState } from "react";
import React from "react";
import { useAppDispatch } from "../redux/hooks";
import { removeUser, setUser } from "../redux/slices/userSlice";
import AsyncStorage from "@react-native-async-storage/async-storage"
import { IUser } from "../models/UserModel";
interface IContext {
    isAuth: boolean,
    isVerified: boolean,
    signIn: (email: string, password: string) => Promise<any>,
    verificateEmail: (user_id: string, code: string) => Promise<any>
    signOut: () => Promise<void>
}
export const AuthContext = createContext<IContext>(
    {
        isAuth: false,
        isVerified: false,
        signIn: async () => { },
        signOut: async () => { },
        verificateEmail: async () => { }
    }
);
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuth, setIsAuth] = useState<boolean>(false)
    const [isVerified, setIsVerified] = useState<boolean>(false)
    const dispatch = useAppDispatch()
    const tryAutoLogin = async () => {
        const token = await AsyncStorage.getItem("token")
        if (!token) throw new Error("Token not found. Autologin canceled.")
        await fetch("http://192.168.1.76:5000/user/autoLogin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        }).then(async res => {
            if (!res.ok) {
                const error = await res.text()
                throw new Error(error.toString())
            }
            return res.json()
        }).then(data => {
            dispatch(setUser(data))
            setIsAuth(true)
            setIsVerified(true)
        })
    }
    useEffect(() => {
        (async () => {
            await tryAutoLogin()
        })()
    }, [])
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
                await AsyncStorage.setItem("token", data.token)
                dispatch(setUser(data.user))
                setIsVerified(true)
                return data
            }
        } catch (error: any) {
            throw new Error("An error occured while verify", error)
        }
    }
    const signOut = async () => {
        const token = await AsyncStorage.getItem("token") as string
        await fetch("http://192.168.1.76:5000/user/logout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        }).then(
            async () => {
                dispatch(removeUser())
                setIsAuth(false)
                setIsVerified(false)
                await AsyncStorage.removeItem("token")
            }
        ).catch(error => error)
    }
    return (
        <AuthContext.Provider value={{ isAuth, isVerified, signIn, signOut, verificateEmail }}>
            {children}
        </AuthContext.Provider>
    )
}