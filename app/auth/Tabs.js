import React,{useCallback,useState} from "react";
import {View,Text,Image} from 'react-native'
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import App from '@/app/auth/Appl'
import UploadData from '@/components/my component/UploadPost'
import ShortsVideo from '@/components/my component/ShortsVideo'
import ProfileData from '@/components/my component/ProfileData'
import { GestureHandlerRootView } from "react-native-gesture-handler";
import SearchData from '@/components/my component/SearchData'
import { useLocalSearchParams } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import {  doc, getDoc, updateDoc} from 'firebase/firestore';
import { firestore ,auth} from './../../config/Firebase';
// Home and Settings screens for tab navigation

function HomeScreen() {
  
  return (
    <App  />
  );
}

function Search() {

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <SearchData/>
    </View>
  );
}
function Add() {

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <UploadData />
    </View>
  );
}
function Shorts() {
  
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <ShortsVideo />
  </GestureHandlerRootView>
  );
}
function Profile() {

  
  return (
    <ProfileData />
  );
}
function MyTabs() {
  
  const [userdata,setUserdata]=useState([])
  useFocusEffect(
   useCallback(()=>{
     const fetchData = async () => {
       try {
        const user = auth.currentUser;
         const userRef = doc(firestore, 'Users', user.uid);
         const userDoc = await getDoc(userRef);
         
         const data=userDoc.data()
         setUserdata(data)
       } catch (error) {
         console.error("Error fetching user posts: ", error);
       } 
     };
 
     fetchData();
   },[])
  )
  return (
    
    <Tab.Navigator 
    screenOptions={{
      tabBarShowLabel: false, // Hide labels for all tabs
       headerShown: false 
    }}>
      
      <Tab.Screen name="home " component={HomeScreen} 
      options={{
        headerShown:(false),
        tabBarIcon: () => (
          <Image style={{height:30,width:30}}source={require('@/assets/icons/house.png')}/>
        ),
        tabBarLabel: '',
      }}
      />
      <Tab.Screen name="Search" component={Search} 
      options={{
        headerShown:(false),
        tabBarIcon: ({ focused }) => (
          <Image style={{height:25,width:25}}source={require('@/assets/icons/loupe.png')}/>
        ),
        tabBarLabel: '',
      }}
    />
     <Tab.Screen name="Upload" component={Add} 
      options={{
        headerShown:(false),
        tabBarIcon: ({ focused }) => (
          <Image style={{height:25,width:25}}source={require('@/assets/icons/instagram-post.png')}/>
        ),
      }}
    />
     <Tab.Screen name="Shorts" component={Shorts} 
      options={{
        headerShown:(false),
        tabBarIcon: ({ focused }) => (
          <Image style={{height:25,width:25}}source={require('@/assets/icons/video.png')}/>
        ),
      }}
    />
     <Tab.Screen name="Profile" component={Profile} 
      options={{
        headerShown:(false),
        tabBarIcon: ({ focused }) => (
          <Image style={{height:30,width:30,borderRadius:25}}source={{uri: userdata.ProfileImage}} onError={() => console.log("Image failed to load")}/>
        ),
      }}
    />
    </Tab.Navigator>
  );
}

const Tab = createBottomTabNavigator();       // Tab navigator component
const Main=()=>{
    // const router=useRouter();
    // onPress={()=>router.push('components/my components/MenuInsta')}
    return(
      <MyTabs />
    )
  }
  
  export default Main;