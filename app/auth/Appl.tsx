import React,{useState,useEffect,useRef, useCallback} from "react";
import {View,Text,Image,StyleSheet,FlatList, TouchableOpacity,ActivityIndicator,ScrollView} from 'react-native'
import {  SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import  { Video ,ResizeMode} from "expo-av";
import MenuInsta from '@/components/my component/MenuInsta';
import Chat from '@/components/my component/CommentInsta';
import Share from '@/components/my component/Share';
import { useRouter,useLocalSearchParams  } from "expo-router";
import{firestore, auth} from './../../config/Firebase'
import { doc, updateDoc, arrayUnion, arrayRemove, collection, onSnapshot,getDoc } from 'firebase/firestore';
// import { User } from 'firebase/auth';
import { useFocusEffect } from '@react-navigation/native';
// Home and Settings screens for tab navigation
// const user = auth.currentUser as User;


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
const InstaStory=({item,index}: { item: any, index: number })=>{
  const [userdata,setUserdata]=useState([])
 useFocusEffect(
  useCallback(()=>{
    const fetchData = async () => {
      try {
        const user=auth.currentUser;
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
  
  return(
    <View style={{gap: 10, padding: 10}}>
      
        {index===0?(
            <View style={{ position: 'relative' }}>
            <Image style={styles.pic} source={{ uri: userdata.ProfileImage }} />
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

const PostItem=({item ,UserId}:{item:any,UserId:any})=>{


  const [liked, setLiked] = useState((item.likedBy || []).includes(UserId)); // Check if the post is liked by the current user
  const [count, setCount] = useState(item.likeCount || 0);
  const [modalShow,setModalShow]=useState(false)
  const [comment,setComment]=useState(false)
  const [share,setShare]=useState(false)
  const handleLike = async () => {
    try {
      // Toggle like status
      
      const newLiked = !liked;
      setLiked(newLiked);
      setCount((prevCount: number) => newLiked ? prevCount + 1 : prevCount - 1);

      // Update Firestore
      const postRef = doc(firestore, 'instaCollection', item.key);
      if (newLiked) {
        await updateDoc(postRef, {
          likedBy: arrayUnion(UserId), // Add the user ID to the likedBy array
          likeCount: count + 1
        });
      } else {
        await updateDoc(postRef, {
          likedBy: arrayRemove(UserId), // Remove the user ID from the likedBy array
          likeCount: count - 1
        });
      }
    } catch (error) {
      console.error('Error updating like:', error);
    }
  };
  const ShowComment=()=>{
    setComment(!comment)
  }
  const ShowShare=()=>{
    setShare(!share)
  }
  // const like=()=>{
  //   setLiked(!liked);
  //   setCount(liked?count-1:count+1)
  // }
  const ShowModal=()=>{
    setModalShow(!modalShow)
  }
  return(
  <View style={{flex:1,marginBottom:10}}>
   <View style={{flex:1,flexDirection:'row',justifyContent:'space-around'}}>
    <View style={{flex:3,flexDirection:'row'}}>
    <Image style={styles.pic1}source={{uri : item.ProfileImage}}/>
    <Text style={{marginRight:20,fontSize:17,margin:10}}>{item.name}</Text>
    </View>
    <View style={{flex:1}}>
    <TouchableOpacity
    onPress={ShowModal}>
    <Image style={{height:40,width:40,marginLeft:'65%'}}source={require('@/assets/icons/more.png')}/>
    </TouchableOpacity>
    </View>
    </View>
    {
      item.PostImage && ( <Image style={{width:'100%',height:400}}source={{uri:item.PostImage}}/>)
    }
    {
      item.PostVideo &&(<Video source={{uri:item.PostVideo}} 
        style={{width: '100%', height: 300}}
        shouldPlay={false}
        useNativeControls={true}
        rate={1.0}
        volume={1.0}
        resizeMode={ResizeMode.CONTAIN}
        isLooping={true}/>)
    }
     
     {modalShow && <MenuInsta setModalShow={setModalShow} />}
     {share && <Share  setShare={setShare}/>}
    
    <View style={{flex:3,flexDirection:'row',marginTop:10,justifyContent:'space-between',alignItems:'center'}}>
      <View style={{flexDirection:'row',alignItems:'center'}}>
    <TouchableOpacity 
    onPress={handleLike}>
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
      {comment && <Chat comment={comment} ShowComment={ShowComment} postId={item.key}/>}
      <TouchableOpacity onPress={ShowShare}>
      <Image style={{width:23,height:23,marginLeft:30}}source={require('@/assets/images/send.png')}/>
      </TouchableOpacity>

      </View>
      <View style={{marginRight:10}}>
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


  const [loading, setLoading] = useState(true); 
 
  const [instaData,setInstaData]=useState(
  [
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
  ])
  const [UserId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUserId = async () => {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(firestore, 'Users', user.uid);
        const userDoc = await getDoc(userRef);
        const userData = userDoc.data();
        if (userData) {
          setUserId(userData.UserId); // Set the UserId from user data
        }
      }
    };
    fetchUserId();
  }, []);
  


useEffect(() => {
  const subscriber = onSnapshot(collection(firestore, 'instaCollection'), (querySnapshot) => {
    const instaCollection = [];
    querySnapshot.forEach((documentSnapshot) => {
      instaCollection.push({
        ...documentSnapshot.data(),
        key: documentSnapshot.id,
      });
    });
      setInstaData(instaCollection)
      // setInstaData([...instaData,instaData]);
      setLoading(false);
    });
  return () => subscriber();
}, []);

// if (loading) {
//   return <ActivityIndicator />;
// }
  const router=useRouter();
  return (
    // <GestureHandlerRootView style={{flex:1}}>
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
            {!loading?<FlatList
              data={instaData}
              renderItem={({ item }) => <PostItem item={item} UserId={UserId} />}
              
              scrollEnabled={false}
            />:<ActivityIndicator size="large" color="#0000ff" />}
          </View>
         
        </ScrollView>
        {/* <View style={{flex:1,position:'absolute',bottom:0,right:10,backgroundColor:'yellow',borderRadius:11}}>
          <TouchableOpacity onPress={()=>
            {
            
              router.push('/auth/UploadData')}}>
          <Image  style={{width:40,height:40}} source={require('@/assets/icons/instagram-post.png')}/>
          </TouchableOpacity>
         </View> */}
      </SafeAreaView>
      
    // </GestureHandlerRootView>
  );
}

export default App;
