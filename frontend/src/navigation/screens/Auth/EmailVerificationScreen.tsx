import { View, Text, Image, Dimensions, TouchableOpacity, TextInput, Pressable, Keyboard, KeyboardAvoidingView } from 'react-native'
import React, { useContext, useRef, useState } from 'react'
import { Box } from '@/components/ui/box'
import { HStack } from '@/components/ui/hstack'
import { VStack } from '@/components/ui/vstack'
import { StaticScreenProps } from '@react-navigation/native'
import { IUser } from '@/src/models/UserModel'
import { AuthContext } from '@/src/auth/authContext'
import { useAppDispatch, useAppSelector } from '@/src/redux/hooks'
import { setUser } from '@/src/redux/slices/userSlice'
type Props = StaticScreenProps<{
    user_id: string;
}>;
const EmailVerificationScreen = ({ route }: Props) => {
    const { width, height } = Dimensions.get("screen")
    const [code, setCode] = useState("");
    const inputRef = useRef<TextInput>(null);
    const { verificateEmail } = useContext(AuthContext)
    const verifyEmail = async () => {
        await verificateEmail(route.params.user_id, code)
    }
    return (
        <KeyboardAvoidingView behavior='padding' style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#121212", gap: 15, }}>
            <Image source={require("../../../assets/EmailVerification.png")} style={{ width: width * 0.5, height: width * 0.57 }} />
            <Text className='text-white' style={{ fontSize: 33, }}>Protecting your account!</Text>
            <Text className='text-gray-500' style={{ fontSize: 16, }}>Please verify your account with email.</Text>
            <Pressable onPress={() => {
                inputRef.current?.focus();
                setTimeout(() => Keyboard.dismiss(), 10);  // önce kapat
                setTimeout(() => inputRef.current?.focus(), 100); // sonra tekrar aç
            }}>
                <VStack style={{ gap: 20, }}>
                    <HStack style={{ gap: 20, }}>
                        <Box style={{ width: 65, height: 100, borderBottomWidth: 5, borderBottomColor: "gray", borderRadius: 15, justifyContent: "center", alignItems: "center" }}>
                            <Text style={{ color: "white", fontSize: 48, }}>{code[0]}</Text>
                        </Box>
                        <Box style={{ width: 65, height: 100, borderBottomWidth: 5, borderBottomColor: "gray", borderRadius: 15, justifyContent: "center", alignItems: "center" }}>
                            <Text style={{ color: "white", fontSize: 48, }}>{code[1]}</Text>
                        </Box>
                        <Box style={{ width: 65, height: 100, borderBottomWidth: 5, borderBottomColor: "gray", borderRadius: 15, justifyContent: "center", alignItems: "center" }}>
                            <Text style={{ color: "white", fontSize: 48, }}>{code[2]}</Text>
                        </Box>
                    </HStack>
                    <HStack style={{ gap: 20 }}>
                        <Box style={{ width: 65, height: 100, borderBottomWidth: 5, borderBottomColor: "gray", borderRadius: 15, justifyContent: "center", alignItems: "center" }}>
                            <Text style={{ color: "white", fontSize: 48, }}>{code[3]}</Text>
                        </Box>
                        <Box style={{ width: 65, height: 100, borderBottomWidth: 5, borderBottomColor: "gray", borderRadius: 15, justifyContent: "center", alignItems: "center" }}>
                            <Text style={{ color: "white", fontSize: 48, }}>{code[4]}</Text>
                        </Box>
                        <Box style={{ width: 65, height: 100, borderBottomWidth: 5, borderBottomColor: "gray", borderRadius: 15, justifyContent: "center", alignItems: "center" }}>
                            <Text style={{ color: "white", fontSize: 48, }}>{code[5]}</Text>
                        </Box>
                    </HStack>
                </VStack>
            </Pressable>
            <TouchableOpacity onPress={verifyEmail} style={{ marginTop: 20, width: width * 0.6, justifyContent: "center", alignItems: "center", backgroundColor: "#2E2E2E", borderRadius: 5, alignSelf: "center", padding: 15 }}>
                <Text className='text-white'>Verificate Email</Text>
            </TouchableOpacity>
            <TextInput
                ref={inputRef}
                value={code}
                onChangeText={(text) => {
                    setCode(text);
                }}
                keyboardType="number-pad"
                textContentType="oneTimeCode"
                maxLength={6}
                editable
                style={{
                    width: "70%",
                    height: 0
                }}
            />
        </KeyboardAvoidingView>
    )
}

export default EmailVerificationScreen