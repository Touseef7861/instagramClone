import React, { useEffect, useState } from "react";
import {View,Text} from 'react-native'
import {useSelector} from 'react-redux'
const Header=()=>{
    const cartdata=useSelector((state)=>state.reducer)
    const [cartItems,setCartItems]=useState(0)
    useEffect(()=>{
        setCartItems(cartdata.length)
    },[cartdata])

  return(
    <View style={{backgroundColor:'orange',padding:20}}>
    <Text style={{fontSize:30,textAlign:'right'}}>{cartItems}</Text>
  
  </View>
  )
}
export default Header;