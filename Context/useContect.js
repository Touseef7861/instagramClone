import React, { useState} from "react";
import {View,Text} from 'react-native'
import Btn from './../../Context/btn'

 export const Context=React.createContext()
const ContextHook=()=>{
  const [signIn,setSignIn]=useState(false)
  return(
    <View>
      <Context.Provider value={[signIn,setSignIn]}>
        <Btn/>
      <Text style={{fontSize:20,marginTop:40,alignSelf:'center'}}>{signIn?'SignIn':'Signout'}</Text>
      </Context.Provider>
    </View>
  )
}

export default ContextHook;