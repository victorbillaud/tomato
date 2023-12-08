import React, { useState } from 'react'
import {View} from "../Themed";
import {useAuth} from "./AuthProvider";
import {Button} from "../common/Button";
import tw from "../../constants/tw";
import {InputText} from "../common/InputText";
import {Text} from "../common/Text";

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
        <View style={tw`w-3/4 flex gap-5 items-center`}>
            <Text variant={"h1"}>Sign in</Text>
            <InputText labelText={"E-mail"}
                       placeholder="user@email.com"
                       onChangeText={handleEmailChange}
            />
            <InputText labelText={"Password"}
                       placeholder="greatpassword1234"
                       onChangeText={handlePasswordChange}
            />
            <Button text={"Sign in"} onPress={() => signIn(email, password)} variant={"primary"} />
        </View>
    )
}
