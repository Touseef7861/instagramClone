import React,{useState,useEffect,useRef, useCallback} from "react";
import {View,Text,Image,StyleSheet,FlatList, TouchableOpacity} from 'react-native'
import { GestureHandlerRootView, ScrollView } from "react-native-gesture-handler";
import {  SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import  { Video } from "expo-av";
import { ResizeMode } from 'expo-av';
import MenuInsta from '@/components/my component/MenuInsta';
import Chat from '@/components/my component/CommentInsta';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useRouter } from "expo-router";
// Home and Settings screens for tab navigation
function HomeScreen() {
  return (
    <App />
  );
}

function Search() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{fontSize:30}}>Search</Text>
    </View >
  );
}
function Add() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{fontSize:30}}>Upload</Text>
    </View>
  );
}
function Shorts() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{fontSize:30}}>Shorts</Text>
    </View>
  );
}
function Profile() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{fontSize:30}}>Profile</Text>
    </View>
  );
}
function MyTabs() {
  return (
    
    <Tab.Navigator 
    screenOptions={{
      tabBarShowLabel: false, // Hide labels for all tabs
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
          <Image style={{height:30,width:30,borderRadius:25}}source={require('@/assets/images/th.png')}/>
        ),
      }}
    />
    </Tab.Navigator>
  );
}

const Tab = createBottomTabNavigator();       // Tab navigator component



const MyVideo = ({ source, shouldPlay }: { source: any, shouldPlay: boolean }) => {
  const videoRef = useRef<Video>(null);

  useEffect(() => {
    if (videoRef.current && shouldPlay) {
      videoRef.current.playAsync();
    } else if (videoRef.current && !shouldPlay) {
      videoRef.current.pauseAsync();
    }
  }, [shouldPlay]);

  return (
    <Video
      ref={videoRef}
      source={source}
      style={{ width: '100%', height: 300 }}
      useNativeControls={true}
      rate={1.0}
      volume={1.0}
      resizeMode={ResizeMode.CONTAIN}
      shouldPlay={shouldPlay}
      isLooping={true}
    />
  );
};

const styles=StyleSheet.create({
  shape:{
    borderRadius:50,
    flexDirection:'column'
  },
  pic:{
    height:70,
    width:70,
    borderRadius:50,
    borderColor:'gray',
    borderWidth:1,
   
  },
  pic1:{
    height:40,
    width:40,
    borderRadius:50,
    borderColor:'gray',
    borderWidth:1,
    margin:8,
    
  },
  story:{
    position: 'absolute',
    bottom: 0,
    right: 0,
    height: 25,
    width: 25,
    borderRadius: 15,
    
    backgroundColor:'white',
    borderColor: 'white',
  },
  addFriend:{
    position: 'absolute',
    bottom: 18,
    right: 15,
    backgroundColor:'white',
    borderRadius: 15,
    shadowColor:'black',
    elevation:5,
    height:30,
    width:40,
    alignItems:'center',
    justifyContent:'center'
    
  }

})

const Insta=[
{
  name:<Text style={{color:'black'}}>Your story</Text>,
  image:require('@/assets/images/th.png'),
  icon:  require('@/assets/images/add.png')
  
},
{
  name:'Goku',
  image:require('@/assets/images/p1.png'),
  icon: require('@/assets/icons/add.png')
},
{
  name:'Trunks',
  image:require('@/assets/images/p2.png'),
  icon: require('@/assets/icons/add.png')
},
{
  name:'Gohan',
  image:require('@/assets/images/p3.png'),
  icon: require('@/assets/icons/add.png')
},
{
  name:'Touseef',
  image:require('@/assets/images/th.png'),
  icon: require('@/assets/icons/add.png')
},
{
  name:'Naruto',
  image:require('@/assets/images/p1.png'),
  icon: require('@/assets/icons/add.png')
},
{
  name:'Goku',
  image:require('@/assets/images/p2.png'),
  icon: require('@/assets/icons/add.png')
},
{
  name:'Dragon',
  image:require('@/assets/images/p3.png'),
  icon: require('@/assets/icons/add.png')
},
]
const InstaStory=({item,index})=>{
  return(
    <View style={{gap: 10, padding: 10}}>
      
        {index===0?(
            <View style={{ position: 'relative' }}>
            <Image style={[styles.pic,{  resizeMode: 'repeat'}]} source={item.image} />
            <View>
              <Image style={styles.story} source={item.icon} />
              </View>
              <Text style={{textAlign:'center',color:'gray',marginTop:10}}>{item.name}</Text>
          </View>
        ):
      
          ( <View style={{ position: 'relative' }}>
            <Image style={[styles.pic,{ resizeMode: 'contain'}]} source={item.image} />
            <View style={[styles.addFriend]}>
              <Image style={{height:15,width:15}} source={item.icon} />
              </View>
              <Text style={{textAlign:'center',color:'gray',marginTop:10}}>{item.name}</Text>
          </View>)}
        
                 
        </View>
  )
}
const InstaData=[
  {
    name:'Goku',
    ProfileImage:'https://tse4.explicit.bing.net/th?id=OIP.jUhREZmYLBkJCe7cmSdevwHaEX&pid=Api&P=0&h=220',
    PostImage:'http://www.cartoonbucket.com/wp-content/uploads/2017/03/Picture-Of-Goku.png',
    desHea:'Dragon_Ball_Z',
    description:'“I could go one step farther If I wanted to.”'
  },
  {
    name:'Vegeta',
    ProfileImage:'https://elcuartoplayer.files.wordpress.com/2015/02/dragon-ball-z-transformaciones.jpg',
    PostImage:'http://upload.wikimedia.org/wikipedia/it/4/48/Son_Goku_-_Dragon_Ball_Kai.png',
    desHea:'Dragon_Ball_Z',
    description:'“I would rather be a brainless monkey than a heartless monster.” – Goku'
  }, 
  {
    name:'Trunks',
    ProfileImage:'http://s1.picswalls.com/wallpapers/2015/09/27/dragon-ball-z-hd-desktop-wallpaper_125243483_276.jpg',
    PostImage:'https://www.xtrafondos.com/wallpapers/vertical/goku-dragon-ball-super-ultra-instinct-10897.jpg',
    desHea:'Dragon_Ball_Z',
    description:'“Power comes in response to a need, not a desire. You have to create that need.” – Goku'
  },
  {
    name:'Gohan',
    ProfileImage:'https://tse1.mm.bing.net/th?id=OIP.8GFb50JcHxoMtrCVigjDCwHaEr&pid=Api&P=0&h=220',
    PostImage:'https://images2.alphacoders.com/924/thumb-1920-924226.png',
    desHea:'Dragon_Ball_Z',
    description:'“You’ll laugh at your fears when you find out who you are.” – Piccolo'
  },
  {
    name:'Goten',
    ProfileImage:'https://tse2.mm.bing.net/th?id=OIP.nL2NRP0oJNypF9cN1GoYmgHaEo&pid=Api&P=0&h=220',
    PostImage:'https://www.xtrafondos.com/wallpapers/goku-super-saiyan-dragon-ball-super-4671.jpg',
    desHea:'Dragon_Ball_Z',
    description:'“There’s no such thing as fair or unfair in battle. There is only victory or in your case, defeat.” – Vegeta '
  },
  {
    name:'Beerus',
    ProfileImage:'https://tse3.mm.bing.net/th?id=OIP.DzM43QOOGeXfBGewL1DaBAHaEK&pid=Api&P=0&h=220',
    PostVideo:require('@/assets/images/naat1.mp4'),
    desHea:'Dragon_Ball_Z',
    description:'“There’s no such thing as fair or unfair in battle. There is only victory or in your case, defeat.” – Vegeta '
  },
  {
    name:'Whis',
    ProfileImage:'https://tse3.mm.bing.net/th?id=OIP.XSLW1ONZ9gxcFb-o4GC6HAHaNg&pid=Api&P=0&h=220',
    PostVideo:require('@/assets/images/short.mp4'),
    desHea:'Dragon_Ball_Z',
    description:'“There’s no such thing as fair or unfair in battle. There is only victory or in your case, defeat.” – Vegeta '
  },
]


const PostItem=({item})=>{
  const [liked,setLiked]=useState(false)
  const [count,setCount]=useState(0)
  const [modalShow,setModalShow]=useState(false)
  const [comment,setComment]=useState(false)
  const ShowComment=()=>{
    setComment(!comment)
  }
  const like=()=>{
    setLiked(!liked);
    setCount(liked?count-1:count+1)
  }
  const ShowModal=()=>{
    setModalShow(!modalShow)
  }
  return(
  <View style={{flex:1,marginBottom:10}}>
   <View style={{flex:1,flexDirection:'row'}}>
    <Image style={styles.pic1}source={{uri : item.ProfileImage}}/>
    <Text style={{marginRight:20,fontSize:17,margin:10}}>{item.name}</Text>
    <TouchableOpacity
    onPress={ShowModal}>
    <Image style={{height:40,width:40,marginLeft:'65%'}}source={require('@/assets/icons/more.png')}/>
    </TouchableOpacity>
    </View>
    {
      item.PostImage && ( <Image style={{width:'100%',height:400}}source={{uri:item.PostImage}}/>)
    }
    {
      item.PostVideo &&(<MyVideo source={item.PostVideo} shouldPlay={false}/>)
    }
     
     {modalShow && <MenuInsta setModalShow={setModalShow} />}
    
    <View style={{flex:3,flexDirection:'row',marginTop:10,justifyContent:'space-between',alignItems:'center'}}>
      <View style={{flexDirection:'row',alignItems:'center'}}>
    <TouchableOpacity 
    onPress={like}>
      <Ionicons
      style={{marginLeft:10}}
      name={liked?'heart':'heart-outline'}
      size={31}
      color={liked?'red':'black'}
      />     
      </TouchableOpacity>
      <Text style={{fontSize:15,textAlignVertical:'center'}}>{count}</Text>
      <TouchableOpacity onPress={ShowComment}>
      <Image style={{width:23,height:23,marginLeft:30}}source={require('@/assets/images/chat.png')}/>
      </TouchableOpacity>
      {comment && <Chat ShowComment={ShowComment} />}
      <Image style={{width:23,height:23,marginLeft:30}}source={require('@/assets/images/send.png')}/>
      </View>
      <View>
      <Image style={{width:23,height:23,gap:50}}source={require('@/assets/images/saved.png')}/>
      </View>
      </View> 
    <View >
      <Text style={{fontSize:15,color:'darkblack',marginLeft:5}}>{item.desHea}</Text>
      <Text style={{fontSize:15,color:'gray',marginLeft:15}}>{item.description}</Text>
    </View>
  </View>
  )
}
const App=()=> {
  return (
    <GestureHandlerRootView style={{flex:1}}>
      <SafeAreaView style={{flex:1}}>
        <ScrollView contentContainerStyle={{flexGrow:1}}>
          <View style={{flex:0.7,flexDirection:'row',marginTop:8}}>
            <Image style={{height:40,width:'35%',marginLeft:15}} source={{uri:'https://logos-world.net/wp-content/uploads/2020/04/Instagram-Logo.png'}} />
            <View style={{flex:1,alignItems:'flex-start',flexDirection:'row-reverse',columnGap:20}}>
              <Image style={{height:25,width:25,marginEnd:20,marginTop:5}} source={require('@/assets/images/chat2.png')} />
              <Image style={{height:25,width:25,marginTop:5}} source={require('@/assets/images/heart.png')} />
            </View>
          </View>
          <View style={{flex:1.5,gap:10}}>
            <FlatList
              data={Insta}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              renderItem={({item,index}) =><InstaStory item={item} index={index}/>}
            />
          </View>
          <View style={{flex:6,gap:10}}>
            <FlatList
              data={InstaData}
              renderItem={({ item }) => <PostItem item={item} />}
              scrollEnabled={false}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
      
    </GestureHandlerRootView>
  );
}

const main=()=>{
  // const router=useRouter();
  // onPress={()=>router.push('components/my components/MenuInsta')}
  return(
    <MyTabs />
  )
}

export default main;
