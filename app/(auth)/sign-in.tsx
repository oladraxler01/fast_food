import {View, Text, Button} from 'react-native'
import React from 'react'
import {router} from "expo-router"

export default function SignIn() {
    return (
        <View>
            <Text>Signin</Text>
            <Button title="Sign up" onPress= {()=> router.push("/sign-up")}/>
        </View>
    )
}
