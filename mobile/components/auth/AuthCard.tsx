import React, { useState } from 'react'
import {View} from "../Themed";
import {Button, TextInput} from "react-native";
import {useAuth} from "./AuthProvider";
import {Button as Button2} from "../common/Button";

export function AuthCard() {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const { signIn } = useAuth();

    const handleEmailChange = (text: string) => {
        setEmail(text);
    }
    const handlePasswordChange = (text: string) => {
        setPassword(text);
    }

    return(
        <View>
            <TextInput placeholder="Email" onChangeText={handleEmailChange}></TextInput>
            <TextInput placeholder="Password" onChangeText={handlePasswordChange}></TextInput>
            <Button title={"Sign in"} onPress={() => signIn(email, password)} />
            <Button2 text={"Sign in"} onPress={() => signIn(email, password)} variant={"primary"} />
        </View>
    )
}
