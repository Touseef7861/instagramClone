import React, { useState, useEffect,useRef } from 'react';
import { View, FlatList, ActivityIndicator, StyleSheet ,TouchableOpacity,Text,Image,Dimensions} from 'react-native';
import { Video } from 'expo-av';
import { ResizeMode } from 'expo-av';
import { collection, onSnapshot } from 'firebase/firestore';
import { firestore } from './../../config/Firebase';
import Chat from '@/components/my component/CommentInsta';
import Share from '@/components/my component/Share';
import { Ionicons } from "@expo/vector-icons";
import MenuInsta from '@/components/my component/MenuInsta';

const { width } = Dimensions.get('window');
const aspectRatio = 9 / 16.08; // 9:16 ratio
const PostItem = React.forwardRef(({ item, onRef }, ref) => {
  const [liked,setLiked]=useState(false)
  const [count,setCount]=useState(0)
  const [modalShow,setModalShow]=useState(false)
  const [comment,setComment]=useState(false)
  const [share,setShare]=useState(false)
  const ShowComment=()=>{
    setComment(!comment)
  }
  const ShowShare=()=>{
    setShare(!share)
  }
  const like=()=>{
    setLiked(!liked);
    setCount(liked?count-1:count+1)
  }
  const ShowModal=()=>{
    setModalShow(!modalShow)
  }
  return (
    <View style={styles.postItemContainer}>

      {item.PostVideo && (
        <Video
        ref={ref}
          source={{ uri: item.PostVideo }}
          style={styles.video}
          shouldPlay={false}
          useNativeControls
          rate={1.0}
          volume={1.0}
          resizeMode={ResizeMode.COVER}
          isLooping
        />
        
      )}
      {modalShow && <MenuInsta setModalShow={setModalShow} />}
     {share && <Share  setShare={setShare}/>}
      <View style={{position:'absolute',bottom:'14%',right:10,justifyContent:'center',gap:20}}>
      <View style={{alignItems:'center',gap:20}}>
      <View style={{alignItems:'center'}}>
    <TouchableOpacity 
    onPress={like}>
      <Ionicons
      name={liked?'heart':'heart-outline'}
      size={31}
      color={liked?'red':'white'}
      />     
      </TouchableOpacity>
      <Text style={{fontSize:15,color:'white'}}>{count}</Text>
      </View>
      <TouchableOpacity onPress={ShowComment}>
      <Image style={{width:26,height:26,tintColor:'white'}}source={require('@/assets/images/chat.png')}/>
      </TouchableOpacity>
      {comment && <Chat ShowComment={ShowComment} />}
      <TouchableOpacity onPress={ShowShare}>
      <Image style={{width:26,height:26,marginTop:20,tintColor:'white'}}source={require('@/assets/images/send.png')}/>
      </TouchableOpacity>
      </View>
      <View >
    <TouchableOpacity
    onPress={ShowModal}>
    <Image style={{height:40,width:40,tintColor:'white'}}source={require('@/assets/icons/more.png')}/>
    </TouchableOpacity>
    </View>
        </View>
        <View style={{position:'absolute',bottom:60}}>
        <View style={{flex:3,flexDirection:'row',alignItems:'center'}}>
    <Image style={styles.pic1}source={{uri : item.ProfileImage}}/>
    <Text style={{marginRight:20,fontSize:17,margin:10,color:'white'}}>{item.name}</Text>
    <TouchableOpacity>
      <View style={{borderRadius:10,borderWidth:2,borderColor:'white'}}><Text style={{color:'white',padding:3,paddingHorizontal:20}}>Follow</Text></View>
    </TouchableOpacity>
    </View>
    <View>
    </View>
        </View>
    </View>
  );
});

const ShortsVideo = () => {
  const [loading, setLoading] = useState(true);
  const [instaData, setInstaData] = useState([]);
  const videoRefs = useRef([]);

  useEffect(() => {
    const subscriber = onSnapshot(collection(firestore, 'instaCollection'), (querySnapshot) => {
      const instaCollection = [];
      querySnapshot.forEach((documentSnapshot) => {
        instaCollection.push({
          ...documentSnapshot.data(),
          key: documentSnapshot.id,
        });
      });
      console.log('Fetched Data', instaCollection); // Log data for debugging
      setInstaData(instaCollection);
      setLoading(false);
    });

    return () => subscriber();
  }, []);
  // useEffect(() => {
  //   // Pause all videos when the component unmounts
  //   return () => {
  //     videoRefs.current.forEach((ref) => {
  //       if (ref) {
  //         ref.pauseAsync();
  //       }
  //     });
  //   };
  // }, []);
  const onViewableItemsChanged = React.useRef(({ viewableItems }) => {
    viewableItems.forEach((item) => {
      if (videoRefs.current[item.index]) {
        videoRefs.current[item.index].playAsync(); // Play current video
      }
    });
    
    // Pause videos that are not in view
    videoRefs.current.forEach((ref, index) => {
      if (!viewableItems.some((item) => item.index === index) && ref) {
        ref.pauseAsync();
      }
    });
  }).current;

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50, // Adjust based on when you want to trigger playback
  };
  return (
    <View style={styles.container}>
      <View style={styles.listContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : 
          <FlatList
            data={instaData}
            renderItem={({ item ,index}) => <PostItem item={item}  ref={(ref) => (videoRefs.current[index] = ref)} />}
            keyExtractor={(item) => item.key}
            scrollEnabled={true}
            pagingEnabled
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
          />
        }
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor:'red',
    width:'100%'
  },
  listContainer: {
    flex: 1,
    width: '100%',
  },
  postItemContainer: {
    flex: 1,
    
  },
  video: {
    flex:1,
    // width: '100%',
    // height: 610,
    aspectRatio: aspectRatio,
    // backgroundColor: 'black',
  },
  pic1:{
    height:40,
    width:40,
    borderRadius:50,
    borderColor:'gray',
    borderWidth:1,
    margin:8,
    
  },
});
export default ShortsVideo;
