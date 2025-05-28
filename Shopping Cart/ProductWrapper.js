import React from "react";
import {View,ScrollView, Button} from 'react-native'
import  Header  from "./Header";
import  Product  from "./Product";

const ProductWrapper=({navigation})=>{
  const products=[
    {
    name:'Samsung Mobile',
    color:'black',
    price:30000,
    image:'https://tse2.mm.bing.net/th?id=OIP.Duz0xJDnE8tD39noBdmdmQHaHv&pid=Api&P=0&h=220'
  },
  {
    name:'Iphone ',
    color:'gray',
    price:130000,
    image:'https://tse1.mm.bing.net/th?id=OIP.e_070MCyDExptdUj00QVLgHaHa&pid=Api&P=0&h=220'
  },
  {
    name:'Huewie Mobile',
    color:'blue',
    price:50000,
    image:'https://tse4.mm.bing.net/th?id=OIP.qItifPSHlQwa0MKzF0g8ngHaHa&pid=Api&P=0&h=220'
  },
]
  return(
    
    <View style={{flex:1}}>
    <Button title="User List" onPress={()=>navigation.navigate('User')}/>
    <Header/>
    <ScrollView contentContainerStyle={{flexGrow:1}}>
    
    {
      products.map((item)=>
        <Product item={item}/>)
    }
    </ScrollView>
    </View>
    
  )

}
export default ProductWrapper;