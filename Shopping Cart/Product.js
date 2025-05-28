import React, { useEffect, useState } from "react";
import {View,Text,Image,Button} from 'react-native'
import {useDispatch,useSelector} from 'react-redux'
import {addToCart,removeFromCart} from './../redux/action'
const Product=({item})=>{
    const [isAdded,setIsAdded]=useState(false)
    const dispatch=useDispatch()
    const handleAddToCart=(item)=>{
        
        dispatch(addToCart(item))
    }
    const handleRemoveFromCart=(item)=>{
        dispatch(removeFromCart(item.name))
        
    }
    const cartItems=useSelector((state)=>state.reducer)
    useEffect(()=>{
        let result=cartItems.filter(element=>{
            return element.name===item.name
        })
        if(result.length){
            setIsAdded(true)
        }
        else{
            setIsAdded(false)
        }
        // if(cartItems&&cartItems.length){
        //     cartItems.forEach((element) => {
        //         if(element.name===item.name){
        //             setIsAdded(true)
        //         }
        //     });
        // }
    },[cartItems])

  return(
    <View style={{alignItems:'center',borderBottomColor:'gold',borderBottomWidth:3,padding:10}}>
        <Text style={{fontSize:20}}>{item.name}</Text>
        <Text style={{fontSize:20}}>{item.color}</Text>
        <Text style={{fontSize:20}}>{item.price}</Text>
        <Image style={{width:200,height:200}} source={{uri:item.image}}/>
        {isAdded?
            <Button title="Remove To Cart" onPress={()=>handleRemoveFromCart(item)}/>:
            <Button title="Add To Cart" onPress={()=>handleAddToCart(item)}/>}
      </View>
  )
}
export default Product;