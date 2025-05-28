import { useEffect, useState } from 'react';
import { Button, Image, View, StyleSheet ,TextInput,Text,ActivityIndicator} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter  } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import {ref,uploadBytesResumable,getDownloadURL} from 'firebase/storage'
import { addDoc, collection,doc,updateDoc } from 'firebase/firestore';
import { storage, firestore } from './../../config/Firebase';
import  { Video } from "expo-av";
import { ResizeMode } from 'expo-av';


export default function UploadData({UserId}) {
  const router=useRouter();
  const [image, setImage] = useState(null);
  const [video,setVideo]=useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  // const {instaData,setInstaData}=useLocalSearchParams();
  const [progress,setProgress]=useState(0)
  const [loader,setLoader]=useState(false);

//   const params = useLocalSearchParams();

// const {  UserId } = params;

  // const { userName , UserId  } =  useLocalSearchParams() ;

  // useEffect(() => {

    // console.log('userName:', userName);
  //   console.log('UserId:', UserId);
  // }, [ UserId]);
  
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
      aspect: [4, 3],
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

    if(name && description&&video||image){
      setLoader(true)
      let imageURL = image ? await uploadFile(image) : null; 
      let videoURL = video ? await uploadFile(video) : null;
    
      const now = new Date();
      const DataOFInsta={
        CreatedAt: now.toLocaleString(),
        UpdatedAt: now.toLocaleString(),
        name,
        description,
        PostImage:imageURL ,
        PostVideo:videoURL,
        ProfileImage:"https://firebasestorage.googleapis.com/v0/b/instagram-clone-7bc1e.appspot.com/o/th.png?alt=media&token=7c3e163c-8b0b-41e2-96f3-fd9c8f7f43e5,",
        // userName,
        UserId,
      }
        console.log("Dataof Inata",DataOFInsta)
      try {
        const instaCollectionRef = collection(firestore, 'instaCollection');
       const docRef= await addDoc(instaCollectionRef, DataOFInsta);
        await updateDoc(docRef, { PostId: docRef.id });
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
      <Button title="Pick an image from camera roll" onPress={pickImage}/>
      <View style={{margin:10}}>
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
      <TextInput
        placeholder='Name'
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder='Description'
        value={description}
        onChangeText={setDescription}
        style={styles.input}
      />
      <View>
      <Button title="Post"  onPress={post}
        disabled={loader}
      />
      
      </View>
      {loader && <View style={{height:'100%',width:'100%',position:'absolute',justifyContent:'center',alignItems:'center',backgroundColor:'transparent'}}><ActivityIndicator  size={60} color="#0000ff" /></View>}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 200,
    height: 200,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    width: '80%',
    margin: 10,
    padding: 8,
  },
});
