import { useRouter } from 'expo-router';
import React, { useState,useEffect } from 'react'
import {Text,View,Image,TextInput,Button,TouchableOpacity, ToastAndroid,ActivityIndicator,ScrollView} from 'react-native'
import {getAuth,createUserWithEmailAndPassword}from 'firebase/auth'
import { setDoc, doc } from 'firebase/firestore';
import {ref,uploadBytesResumable,getDownloadURL} from 'firebase/storage'
import { storage, firestore ,auth} from '../../config/Firebase';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams } from 'expo-router';

export default function Signup() {
  const [email,setEmail]=useState();
  const router=useRouter();
  const [password,setPassword]=useState();
  const [fullName,setFullName]=useState();
  const [userName,setUserName]=useState();
  const [loader,setLoader]=useState(false);
  const [image, setImage] = useState(null);
  const [progress,setProgress]=useState(0)



   const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });
    
    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      
    }
  }
  async function uploadFile(uri) {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
  
      const storageRef = ref(storage, "Stuff" +new Date().getTime());
      const uploadTask = uploadBytesResumable(storageRef, blob);
  
      return new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(`Upload is ${progress.toFixed()}% done`);
            setProgress(progress.toFixed());
          },
          (error) => {
            console.error("Upload error:", error);
            reject(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref)
              .then(resolve)
              .catch(reject);
          }
        );
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  }
  const onCreateAccount = async () => {
    
    // Check if all fields are filled
    if (!email || !password || !userName || !fullName) {
      ToastAndroid.show('Please fill all details', ToastAndroid.LONG);
      return;
    }
    setLoader(true)

    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Prepare user data
      const now = new Date();
      let imageURL = image ? await uploadFile(image) : null;
      const UsersData = {
        email,
        fullName,
        userName,
        // CreateAt: now.toISOString(),
        CreatedAt: now.toLocaleString(),
        UpdatedAt: now.toLocaleString(),
        UserId:user.uid,
        ProfileImage:imageURL,
      };

      // Create a document with the user's UID as the ID
      const userDocRef = doc(firestore, 'Users', user.uid);
      await setDoc(userDocRef, UsersData);


      // Notify user of success
      setLoader(false)
      ToastAndroid.show('Account created successfully!', ToastAndroid.LONG);
      // router.push(`/auth/UploadData?userName=${userName}&UserId=${user.uid}`);

      // router.push({pathname:'auth/Tabs',params: { userName, UserId: user.uid }});

      // Navigate back
      router.back();
    } catch (error) {
      // Handle errors
      const errorCode = error.code;
      const errorMessage = error.message;

      // Provide feedback based on the error
      switch (errorCode) {
        case 'auth/email-already-in-use':
          ToastAndroid.show('Email already in use. Please use a different email.', ToastAndroid.LONG);
          setLoader(false)
          break;
        case 'auth/invalid-email':
          ToastAndroid.show('Invalid email format. Please enter a valid email.', ToastAndroid.LONG);
          setLoader(false)
          break;
        case 'auth/weak-password':
          ToastAndroid.show('Password is too weak. Please choose a stronger password.', ToastAndroid.LONG);
          setLoader(false)
          break;
        default:
          ToastAndroid.show('Error creating account. Please try again.', ToastAndroid.LONG);
           setLoader(false)
          break;
      }

      console.error('Error creating account:', errorCode, errorMessage);
    }
  };
  return (
    <ScrollView>
    <View style={{flex:1}}>
    <Image source={require('@/assets/images/ui1.png')} style={{width:'100%',height:150,resizeMode:'cover'}}/>
    <View style={{flex:1,backgroundColor:'white'}}>
      <View style={{marginTop:10,alignItems:'center'}}>
      <Image style ={{height:50,width:'40%',}}source={{uri:'https://logos-world.net/wp-content/uploads/2020/04/Instagram-Logo.png'}}/>
      <Text style={{fontSize:15,color:'gray',textAlign:'center'}}> Sign up to see the photos and videos from your friends </Text>
      </View>
      <View >
      <View style={{height:100,width:100,borderRadius:50,borderWidth:1,backgroundColor:'gray',position:'relative',alignSelf:'center'}}>
      {image&&<Image  style={{height:98,width:98,borderRadius:50,position:'absolute'}}source={{uri:image}}/>}
      </View>
      <View >
      <TouchableOpacity onPress={pickImage}>
        <Image style={{position:'absolute',width:30,height:30,borderRadius:15,bottom:0,left:190}}source={require('@/assets/images/add.png')}/>
      </TouchableOpacity>
      </View>
      </View>
      <View style={{marginTop:10,rowGap:8,padding:6}}>
        <TextInput 
        placeholder='Enter your Email or Mobile'
        style={{borderWidth:2,padding:10,borderColor:'gray'}}
        onChangeText={(value)=>setEmail(value)}
        />
         <TextInput 
        placeholder='Full Name'
        style={{borderWidth:2,padding:10,borderColor:'gray'}}
          onChangeText={(value)=>setFullName(value)}
        />
         <TextInput 
        placeholder='User Name'
        style={{borderWidth:2,padding:10,borderColor:'gray'}}
        onChangeText={(value)=>setUserName(value)}
        />
        <TextInput 
        placeholder=' Password'
        style={{borderWidth:2,padding:10,borderColor:'gray'}}
        onChangeText={(value)=>setPassword(value)}
        />
      </View>
      <View style={{marginTop:10}}>
      <Button title="Sign up" onPress={onCreateAccount} />
      </View>
      <View style={{flex:1,flexDirection:'row',justifyContent:'center',marginTop:20,alignItems:'flex-end'}}>
        <Text>Have an account?</Text>
        <TouchableOpacity onPress={()=>router.back()}><Text  style={{fontSize:15,color:'blue'}} >Sign in</Text></TouchableOpacity>
      </View>
      {loader && <View style={{height:'100%',width:'100%',position:'absolute',justifyContent:'center',alignItems:'center',backgroundColor:'transparent'}}><ActivityIndicator  size={60} color="#0000ff" /></View>}
      
    </View>
    </View>
    </ScrollView>
  )
}
