import React, { useState} from "react";
import { View, Text, Image, TouchableOpacity, TextInput ,ActivityIndicator} from 'react-native';
import {  useLocalSearchParams, useRouter } from "expo-router";
import * as ImagePicker from 'expo-image-picker';
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage, firestore, auth } from './../../config/Firebase';

export default function EditData() {
    const params = useLocalSearchParams();
    const { userName, fullName, ProfileImage } = params;
    const [progress,setProgress]=useState(0)
    const [image, setImage] = useState(ProfileImage);
    const [name, setName] = useState(fullName);
    const [Username, setUserName] = useState(userName);
    const router=useRouter()
    const [loading, setLoading] = useState(false);
    const pickImage = async () => {
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
    };

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

    const saveData = async () => {
        setLoading(true)
        const user = auth.currentUser;
        if (user) {
            // Upload the new image and get the download URL
            const downloadURL = await uploadFile(image);
            const postRef = doc(firestore, 'Users', user.uid);
            console.log('downloadURL',downloadURL)

            // Update Firestore with the new URL and user details
            await updateDoc(postRef, {
                ProfileImage: downloadURL,
                fullName: name,
                userName: Username
            });

            // Update the image state to reflect the new URL immediately
            setImage(downloadURL);
            setLoading(false)
            router.back()
        } else {
            console.log("No user is logged in.");
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <View style={{ alignItems: 'center', marginTop: 10 }}>
                <View style={{ height: 90, width: 90, borderRadius: 45, backgroundColor: 'gray' }}>
                    <Image style={{ height: 90, width: 90, borderRadius: 45 }} source={{ uri: image }} />
                </View>
                <TouchableOpacity onPress={pickImage}>
                    <Text style={{ color: 'skyblue', marginTop: 10 }}>Edit picture</Text>
                </TouchableOpacity>
            </View>
            <View style={{ borderWidth: 1, margin: 10, borderRadius: 10, padding: 3 }}>
                <Text style={{ color: 'gray', marginTop: 10 }}>Name</Text>
                <TextInput
                    value={name}
                    onChangeText={setName}
                />
            </View>
            <View style={{ borderWidth: 1, margin: 10, borderRadius: 10, padding: 3 }}>
                <Text style={{ color: 'gray', marginTop: 10 }}>Username</Text>
                <TextInput
                    value={Username}
                    onChangeText={setUserName}
                />
            </View>
            <TouchableOpacity onPress={saveData}>
                <Text style={{ alignSelf: 'center', color: 'blue', fontSize: 20 }}>Save</Text>
            </TouchableOpacity>
            {loading && <View style={{height:'100%',width:'100%',position:'absolute',justifyContent:'center',alignItems:'center',backgroundColor:'transparent'}}><ActivityIndicator  size={60} color="#0000ff" /></View>}
        </View>
    );
}
