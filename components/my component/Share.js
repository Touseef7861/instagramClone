import React, { useState } from "react";
import { Text, View, StyleSheet, Modal, Image, TouchableOpacity ,FlatList,TextInput} from 'react-native'


const Insta=[
  {
    name:'Dragon',
    image:require('@/assets/images/th.png'),
  },
  {
    name:'Goku',
    image:require('@/assets/images/p1.png'),
  },
  {
    name:'Trunks',
    image:require('@/assets/images/p2.png'),
  },
  {
    name:'Gohan',
    image:require('@/assets/images/p3.png'),
  },
  {
    name:'Touseef',
    image:require('@/assets/images/th.png'),
  },
  {
    name:'Naruto',
    image:require('@/assets/images/p1.png'),
  },
  {
    name:'Goku',
    image:require('@/assets/images/p2.png'),
  },
  {
    name:'Dragon',
    image:require('@/assets/images/p3.png')
  },
  ]
  const InstaStory=({item})=>{
    return(
      
      <View style={{margin:20,alignItems:'center'}}>
        <Image style={{width:75,height:75,borderRadius:40}}source={item.image}/>
        <Text style={{fontSize:13}}>{item.name}</Text>
      </View>
      
    )
  }
  const ShareData=[
    {
      icon:require('@/assets/icons/share.png'),
      name:'Share'
    },
    {
      icon:require('@/assets/icons/whatsapp.png'),
      name:'WhatsApp'
    },
    {
      icon:require('@/assets/icons/link.png'),
      name:'Copy link'
    },
    {
      icon:require('@/assets/icons/twitter.png'),
      name:'X'
    },
    {
      icon:require('@/assets/icons/facebook.png'),
      name:'Facebook'
    },
    {
      icon:require('@/assets/icons/messenger.png'),
      name:'Messenger'
    },
    {
      icon:require('@/assets/icons/snapchat.png'),
      name:'Snapchat'
    },
    {
      icon:require('@/assets/icons/text.png'),
      name:'SMS'
    },
    {
      icon:require('@/assets/icons/instagram-stories.png'),
      name:'Add to story'
    },
    {
      icon:require('@/assets/icons/threads.png'),
      name:'Threads'
    },
  ]
  const ShareLink=({item})=>{
    return(
      <View style={{height:60,width:60,backgroundColor:'ghostwhite',borderRadius:30,justifyContent:'center',alignItems:'center',margin:15}}>
        <Image style={{width:25,height:25}}source={item.icon}/>
        
      </View>
    )
  }
const Share = ({ setShare, }) => {

  return (
        <Modal
          transparent={true}
          // visible={undefined}
          animationType="slide">
            <View style={[styles.modalView]}>
                <TouchableOpacity style={{ justifyContent: 'flex-start', alignItems: 'center' }} onPress={() => setShare(false)}>
                  <Image style={{ height: 25, width: 25 }} source={require('@/assets/icons/cancel.png')} />
                </TouchableOpacity>
                <View style={{flexDirection:'row',alignItems:'center'}}>
                <View style={{backgroundColor:'ghostwhite',width:'80%',height:35,margin:15,borderRadius:10,alignItems:'center',flexDirection:'row'}}>
                  <Image style={{width:15,height:15,margin:10}} source={require('@/assets/icons/loupe.png')}/>
                  <TextInput
                    placeholder="Search"
                  />
                </View>
                <Image style={{width:15,height:15,margin:10}} source={require('@/assets/icons/loupe.png')}/>
                </View>
                <View style={{flex:1}}>
                <FlatList
              data={Insta}
              
              contentContainerStyle={{
                   flexDirection: 'row',
                  flexWrap: 'wrap'
                  }}
              renderItem={({item}) =><InstaStory item={item} />}
            />
            </View>
            <View style={{}}>
                <FlatList
              data={ShareData}
              horizontal={true}
              showsHorizontalScrollIndicator={true}
              renderItem={({item}) =><ShareLink item={item}/>}
            />
              </View>
          </View>
        </Modal>

  )
}
const styles = StyleSheet.create({
  modalView: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 10,
    width: '100%',
    shadowColor: 'black',
    elevation: 5,
    marginTop: '65%'

  }
})

export default Share;