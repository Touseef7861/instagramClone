import React, { useContext } from "react";
import {View,Button} from 'react-native'
import {Context} from './../app/(tabs)/index'
const Btn=()=>{
    const [signIn,setSignIn]=useContext(Context)
    return(
        <View style={{marginTop:50}}>
        <Button onPress={()=>setSignIn(!signIn)} title={signIn?'SignIn':'Signout'} >
        
        </Button>
        </View>
    )
}
export default Btn;