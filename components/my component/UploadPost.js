import { useEffect, useState } from 'react';
import { Button, Image, View, StyleSheet ,TextInput,Text,ActivityIndicator} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter  } from 'expo-router';
// import { useLocalSearchParams } from 'expo-router';
import {ref,uploadBytesResumable,getDownloadURL} from 'firebase/storage'
import { addDoc, collection,doc,updateDoc,arrayUnion, arrayRemove, getDoc } from 'firebase/firestore';
import { storage, firestore,auth } from './../../config/Firebase';
import  { Video } from "expo-av";
import { ResizeMode } from 'expo-av';


export default function UploadData({UserId}) {
  const router=useRouter();
  const [image, setImage] = useState(null);
  const [video,setVideo]=useState(null);
  // const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  // const {instaData,setInstaData}=useLocalSearchParams();
  const [progress,setProgress]=useState(0)
  const [loader,setLoader]=useState(false);
  const [count, setCount] = useState( );
  // useEffect(() => {
  //   // console.log('userName:', userName);
  //   console.log('UserId:', UserId);
  //   console.log('userName:', userName);
  // }, [ UserId,userName]);
  
  // const instaData = JSON.parse(instaData) || [];
// useEffect (()=>{
// console.warn('dataInsta: ',JSON.parse(dataInsta))
// // setData(JSON.parse(dataInsta))
// },[dataInsta])
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
      setVideo(null)
    }
  }
  const pickVideo = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
   
    console.log(result);

    if (!result.canceled) {
      setVideo(result.assets[0].uri);
      setImage(null)
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
 

  const post= async()=>{
    console.log('Image URI:', image);
    console.log('Video URI:', video);
    const user = auth.currentUser;
    const postData = doc(firestore, 'Users', user.uid);
    const profile= await getDoc(postData)
    const profileData =profile.data()
    const ProfileImage=profileData.ProfileImage
    const userName=profileData.userName
    const UserId=user.uid 
  
    if( description&&video||image){
      setLoader(true)
      let imageURL = image ? await uploadFile(image) : null; 
      let videoURL = video ? await uploadFile(video) : null;

      const now = new Date();
      const DataOFInsta={
        CreatedAt: now.toLocaleString(),
        UpdatedAt: now.toLocaleString(),
        name:userName,
        description,
        PostImage:imageURL ,
        PostVideo:videoURL,
        ProfileImage,
        userName,
        UserId,
      }
        console.log("Dataof Inata",DataOFInsta)
        console.log('ProfileImage',ProfileImage)
      try {
        const instaCollectionRef = collection(firestore, 'instaCollection');
        console.log('instaCollectionRef',instaCollectionRef)
       const docRef= await addDoc(instaCollectionRef, DataOFInsta);
       console.log('docRef',docRef)
        await updateDoc(docRef, { PostId: docRef.id });
        setCount((prevCount) => DataOFInsta ? prevCount + 1 : prevCount - 1);
        const postRef = doc(firestore, 'Users', user.uid);
       
       
        if (DataOFInsta) {
          await updateDoc(postRef,{
            postId: arrayUnion(docRef.id),
            posts: count + 1
          });
        } else {
          await updateDoc(postRef, {
            postBy: arrayRemove(docRef.id),
            posts: count - 1
          });
        }
        router.back();
      } catch (error) {
        console.log('error: ',error); 
    } finally {
      setLoader(false);
    }
  }
  else{
    console.warn("Please fill all fields")
  };
}

  return (
    <View style={styles.container}>
    <View style={{alignItems:'center'}}>
      <Button title="Pick an image from camera roll" onPress={pickImage}/>
      </View>
      <View style={{margin:10,alignItems:'center'}}>
      <Button title="Pick an Video from camera roll" onPress={pickVideo} />
      </View>
      
      {image && <Image source={{ uri: image }} style={styles.image} />}
      {video && <Video 
      source={{uri:video}} style={{width: '50%', height: 150}}
      shouldPlay={false}
      useNativeControls={true}
      rate={1.0}
      volume={1.0}
      resizeMode={ResizeMode.CONTAIN}
      isLooping={true}
      />}
      {/* <TextInput
        placeholder='Name'
        value={name}
        onChangeText={setName}
        style={styles.input}
      /> */}
      
      <TextInput
        placeholder='Description'
        value={description}
        onChangeText={setDescription}
        style={styles.input}
      />
      <View>
      <View style={{alignItems:'center'}}>
      <Button title="Post"  onPress={post}
        disabled={loader}
      />
      </View>
      
      </View>
      {loader && <View style={{height:'100%',width:'100%',position:'absolute',justifyContent:'center',alignItems:'center',backgroundColor:'transparent'}}><ActivityIndicator  size={60} color="#0000ff" /></View>}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 200,
    height: 200,
    alignSelf:'center'
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
  
    margin: 10,
    padding: 8,
    
  },
});
