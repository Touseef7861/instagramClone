import React, { useEffect, useState,useCallback } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList ,ActivityIndicator,ScrollView,SafeAreaView} from 'react-native';
import {  doc, getDoc, updateDoc} from 'firebase/firestore';
import { firestore ,auth} from './../../config/Firebase';
import  { Video,ResizeMode } from "expo-av";
import { useRouter } from "expo-router";
import { useFocusEffect } from '@react-navigation/native';
import { createMaterialTopTabNavigator  } from "@react-navigation/material-top-tabs";
import { createDrawerNavigator } from '@react-navigation/drawer';
import Menulogout from '@/components/my component/Menulogout'
const Drawer = createDrawerNavigator();

const HomeScreen = ({ navigation }) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Home Screen</Text>
    <TouchableOpacity onPress={() => navigation.openDrawer()}>
      <Button title="Open Drawer" />
    </TouchableOpacity>
  </View>
);

const DrawerContent = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Drawer Content</Text>
  </View>
);


const DrawerNavigater=()=>{
  return(
  <Drawer.Navigator
  drawerType="back"
  drawerPosition="right"
>
  <Drawer.Screen name="Home" component={HomeScreen} />
  <Drawer.Screen name="DrawerContent" component={DrawerContent} />
</Drawer.Navigator>
  )
}

const Tab = createMaterialTopTabNavigator();  
function Images({userPosts,loading}){
  const filteredPosts = userPosts.filter(post => post.PostImage);
  return(
    <View style={{backgroundColor:'white',height:"100%"}}>
        {loading ? 
          <ActivityIndicator size="large" color="#0000ff" />
         :filteredPosts.length > 0 ? (
          <FlatList
            data={filteredPosts}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{
                   flexDirection: 'row',
                  flexWrap: 'wrap'
                  }}
                  scrollEnabled={false}
            renderItem={({ item }) => (
              <View style={{ }}>
                <Image source={{ uri: item.PostImage }} style={{ width: 110, height: 110 }} />
                
              </View>
            )}
          />
        ):null}
      </View>
  )
}
function VideosData({userPosts,loading}){
  const filteredPosts = userPosts.filter(post => post.PostVideo);
  return(
    <View style={{backgroundColor:'white',height:"100%"}}>
        {loading ? 
          <ActivityIndicator size="large" color="#0000ff" />
         :filteredPosts.length > 0 ? (
          <FlatList
            data={filteredPosts}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{
                   flexDirection: 'row',
                  flexWrap: 'wrap'
                  }}
                  scrollEnabled={false}
            renderItem={({ item }) => (
              <View style={{ }}>
                <Video
                  source={{uri:item.PostVideo}}
                  style={{height:200,width:120}}
                  shouldPlay={false}
                  useNativeControls={true}
                  rate={1.0}
                  volume={1.0}
                  resizeMode={ResizeMode.CONTAIN}
                />
                
               </View>
            )}
          />
        ):null}
      </View>
  )
}
function Tags(){
  return(
    <View><Text>tag</Text></View>
  )
}

const Tabs=({userPosts,loading})=>{
  return(
    <Tab.Navigator
    screenOptions={{
      tabBarShowLabel: false, // Hide labels for all tabs
       headerShown: false 
    }}>
      <Tab.Screen name='Image'
          options={{
        tabBarIcon: () => (
          <Image style={{height:20,width:20}}source={require('@/assets/icons/menu1.png')}/>
        ),
        
      }}>
      {props => <Images {...props} userPosts={userPosts} loading={loading} />}
      </Tab.Screen>
      <Tab.Screen name='videos' 
      options={{
        tabBarIcon:()=>(
          <Image style={{height:20,width:20}}source={require('@/assets/icons/reels.png')}/>
        )
      }}
      >
      {props=><VideosData {...props} userPosts={userPosts} loading={loading}/>}
      {/* <VideosData userPosts={userPosts} loading={loading}/> */}
      </Tab.Screen>
      <Tab.Screen name='tags' component={Tags}
       options={{
        tabBarIcon:()=>(
          <Image style={{height:20,width:20}}source={require('@/assets/icons/tag.png')}/>
        )
      }}
      />
    </Tab.Navigator>
  )
}
 
const ProfileData = () => {
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userdata,setuserData]=useState([])
  const router=useRouter();
  const post=userPosts.length||0;
  useFocusEffect(
  useCallback(() => {
    const fetchData = async () => {
      try {
        // Fetch user data to get the postId
        const user = auth.currentUser;
        console.log('userid',user.uid)
        const userRef = doc(firestore, 'Users', user.uid);
        const userDoc = await getDoc(userRef);
        const data=userDoc.data()
        setuserData(data)
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const userPostIds = userData.postId || []; // Assuming postIds is an array of post IDs
          const postsNumber=userData.posts||0;
          console.log("User Post IDs:", userPostIds); // Debugging line
       
          if (userPostIds.length > 0) {
            // Directly fetching documents by their IDs
            const postPromises = userPostIds.map(postId => {
              const postRef = doc(firestore, 'instaCollection', postId);
              return getDoc(postRef);
            });

            const postDocs = await Promise.all(postPromises);

            // Extracting data from documents
            const allPostsData = postDocs.map(doc => {
              if (doc.exists()) {
                return { id: doc.id, ...doc.data() };
              } else {
                console.log(`Document with ID ${doc.id} does not exist.`);
                return null;
              }
            }).filter(post => post !== null); // Remove null entries

            console.log('All Posts Data:', allPostsData); // Debugging line
            setUserPosts(allPostsData);
          } else {
            console.log("No posts found for user.");
            setUserPosts([]); // Set empty array if no post IDs
          }
        } else {
          console.log("User document does not exist.");
        }
        await updateDoc(userRef,{posts:post})
      } catch (error) {
        console.error("Error fetching user posts: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  },[])
  )
  const [showMenu,setShowMenu]=useState(false)
  const Showmenu=()=>{
    setShowMenu(true)
  }
  return (
    // <SafeAreaView style={{flex:1,backgroundColor:'yellow'}}>
    <ScrollView contentContainerStyle={{flexGrow:1}}>
    <View style={{ flex: 1 ,backgroundColor:'white'}}>
      <View style={{ margin: 10, flexDirection: 'row', justifyContent: "space-between" ,marginTop:30}}>
        <View>
          <Text style={{ fontSize: 17 }}>{userdata.userName}</Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 25 }}>
          <Image style={{ height: 20, width: 20 }} source={require('@/assets/icons/threads.png')} />
          <Image style={{ height: 20, width: 20 }} source={require('@/assets/icons/instagram-post.png')} />
          <TouchableOpacity onPress={Showmenu}>
          <Image style={{ height: 20, width: 20 }} source={require('@/assets/icons/menu.png')} />
          </TouchableOpacity>
        </View>
        {showMenu&& <Menulogout showMenu={showMenu} setShowMenu={setShowMenu}/>}
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 20 }}>
        <View>
          <View style={{ position: 'relative', marginRight: 20, backgroundColor: 'white', borderRadius: 35, height: 70, width: 70 }}>
            <Image style={styles.pic} source={{ uri: userdata.ProfileImage }} />
            <View>
              <Image style={styles.story} source={require('@/assets/images/add.png')} />
            </View>
          </View>
          <Text style={{ textAlign: 'center', marginTop: 8 }}>{userdata.fullName}</Text>
        </View>
        <TouchableOpacity style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 15 }}>{post}</Text>
          <Text style={{ fontSize: 13 }}>posts</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 15 }}>0</Text>
          <Text style={{ fontSize: 13 }}>followers</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 15 }}>0</Text>
          <Text style={{ fontSize: 13 }}>following</Text>
        </TouchableOpacity>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
        <TouchableOpacity  onPress={()=>router.push({pathname:"/auth/EditProfile", params:{userName:userdata.userName, fullName:userdata.fullName, ProfileImage:userdata.ProfileImage}})} style={{ backgroundColor: 'lightgray', padding: 5, borderRadius: 8, width: 140, alignItems: 'center' }}>
          <Text style={{ fontSize: 15 }}>Edit profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ backgroundColor: 'lightgray', padding: 5, borderRadius: 8, width: 140, alignItems: 'center' }}>
          <Text style={{ fontSize: 15 }}>Share profile</Text>
        </TouchableOpacity>
        
      </View>
      <Tabs userPosts={userPosts} loading={loading}/>
      
    </View>
    </ScrollView>
    // </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  pic: {
    height: 70,
    width: 70,
    borderRadius: 50,
    borderColor: 'gray',
    borderWidth: 1,
  },
  story: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    height: 25,
    width: 25,
    borderRadius: 15,
    backgroundColor: 'white',
    borderColor: 'white',
  },
});

export default ProfileData;
