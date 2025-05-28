import { useRouter } from 'expo-router';
import React, { useState,useEffect } from 'react'
import {Text,View,Image,TextInput,Button,TouchableOpacity, ToastAndroid,ActivityIndicator,ScrollView} from 'react-native'
import { signInWithEmailAndPassword } from "firebase/auth";
import { storage,firestore ,auth} from "../../config/Firebase";
import { doc, getDoc } from 'firebase/firestore';
import { useLocalSearchParams } from 'expo-router';
import Main from '@/app/auth/Tabs';
import Signup from '@/app/auth/Signup'
export default function Signin() {
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const router=useRouter();
  const [loader,setLoader]=useState(false);
  
  // const params=useLocalSearchParams()
  // const { hideHeader } = params; // Get query parameters

  // useEffect(() => {
  //   if (hideHeader === 'true') {
  //     router.setOptions({ headerShown: false });
  //   } 
  // }, [hideHeader,router]);
 
  const SignIn = async () => {
    if (!email || !password) {
      ToastAndroid.show("Please enter email and password", ToastAndroid.LONG);
      return;
    }

    setLoader(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Fetch user details from Firestore
      const userDocRef = doc(firestore, 'Users', user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists()) {
        throw new Error('User document does not exist');
      }
        const userData = userDoc.data();
          const userName = userData.userName; // Adjust based on your Firestore schema
          const ProfileImage=userData.ProfileImage;
          const fullName=userData.fullName;
          const posts=userData.posts;
        // Navigate to UploadData screen with user details
        <Main/>
       
      // router.push('/auth/Tabs')
        // router.push('/auth/Tabs') 
      ToastAndroid.show('Login successfully!', ToastAndroid.LONG);
      
     
    } catch (error) {
      console.log("error",error)
      ToastAndroid.show("Invalid Credentials!", ToastAndroid.LONG);
    } finally {
      setLoader(false);
    }
  };
  // const SignUp=()=>{
  //   return (<Signup/>)
  // }
  return (
    <ScrollView contentContainerStyle={{flexGrow:1}}>
    <View style={{flex:1}}>
    <Image source={require('@/assets/images/ui1.png')} style={{width:'100%',height:200}}/>
    <View style={{flex:1,backgroundColor:'white'}}>
      <View style={{marginTop:10,alignItems:'center'}}>
      <Image style ={{height:50,width:'40%',}}source={{uri:'https://logos-world.net/wp-content/uploads/2020/04/Instagram-Logo.png'}}/>
      </View>
      <View style={{marginTop:60,rowGap:8,padding:6}}>
        <TextInput 
        placeholder='Enter your Email'
        onChangeText={(value)=>setEmail(value.trim())}
        style={{borderWidth:2,padding:10,borderColor:'gray'}}/>
        <TextInput 
        placeholder='Enter your Password'
        onChangeText={(value)=>setPassword(value)}
        style={{borderWidth:2,padding:10,borderColor:'gray'}}/>
      </View>
     
      <View style={{marginTop:30}}>
      <Button title="Login" onPress={SignIn} disabled={loader}/>
      </View>
      
      <TouchableOpacity style={{alignItems:'center',marginTop:10}}><Text  style={{fontSize:15,color:'blue'}}>Forgot password?</Text></TouchableOpacity>
      <View style={{flexDirection:'row',justifyContent:'center',marginTop:20}}>
        <Text>Don't have an account?</Text>
        <TouchableOpacity onPress={()=>router.push('/auth/Signup')}><Text  style={{fontSize:15,color:'blue'}} >Sign up</Text></TouchableOpacity>
      </View>
      {loader && <View style={{height:'100%',width:'100%',position:'absolute',justifyContent:'center',alignItems:'center',backgroundColor:'transparent'}}><ActivityIndicator  size={60} color="#0000ff" /></View>}
    </View>
    </View>
    </ScrollView>
  )
}
