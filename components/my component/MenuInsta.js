import React, { useState } from "react";
import { Text, View, StyleSheet, Modal, Image, TouchableOpacity } from 'react-native'
import { FlatList } from "react-native-gesture-handler";

const Moredetails=[
{
  icon:require('@/assets/images/send.png'),
  Text:"We're moving things around!"
},
{
  icon:require('@/assets/icons/info.png'),
  Text:"why are you seeing this post"
},
{
  icon:require('@/assets/icons/hide.png'),
  Text:"Not interested"
},
{
  icon:require('@/assets/icons/person.png'),
  Text:"About this account"
},
{
  icon:require('@/assets/icons/report.png'),
  Text:"Report"
},

]

const Details=({item})=>{
  return(
    <View style={[, { marginTop: 20, flexDirection: 'row', gap: 6, padding: 10 ,alignItems:'center'}]}>
      <TouchableOpacity>
        <Image style={{ height: 25, width: 25 }} source={item.icon} />
      </TouchableOpacity>
      <TouchableOpacity>
        <Text style={{ fontSize: 15 }}>{item.Text}</Text>
      </TouchableOpacity>
    </View>
  )
}

const MenuInsta = ({ setModalShow, }) => {

  return (
        <Modal
          transparent={true}
          // visible={undefined}
          animationType="slide">

          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View style={[styles.modalView]}>
              <View style={{ paddingHorizontal: 49 }}>
                <TouchableOpacity style={{ justifyContent: 'flex-start', alignItems: 'center' }} onPress={() => setModalShow(false)}>
                  <Image style={{ height: 25, width: 25 }} source={require('@/assets/icons/cancel.png')} />
                </TouchableOpacity>
                <View style={{ flexDirection: 'row', columnGap: 100, marginLeft: 23 }}>
                  <View style={{ height: 60, width: 60, borderRadius: 80, borderWidth: 1, borderColor: 'black' }}>
                    <Image style={{ height: 20, width: 20, margin: 19 }} source={require('@/assets/images/saved.png')} />
                    <Text style={{ textAlign: 'center', marginRight: 5 }}>Save</Text>
                  </View>
                  <View style={{ height: 60, width: 60, borderRadius: 80, borderWidth: 1, borderColor: 'black' }}>
                    <Image style={{ height: 20, width: 20, margin: 19 }} source={require('@/assets/icons/qr-code.png')} />
                    <Text style={{ textAlign: 'center', marginRight: 5 }}>qr-code</Text>
                  </View>
                </View>
              </View>
              <FlatList
                data={Moredetails}
                renderItem={({item})=><Details item={item}/>}
              />
              <View style={[, { marginTop: 20, flexDirection: 'row', gap: 6, alignItems: 'center', marginLeft: 10 }]}>
                {/* <Image style={{height:30,width:30}}source={require('@/assets/icons/report.png')}/> */}
                <Text style={{ fontSize: 18 }}>Manage content preferences</Text>
              </View>
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

export default MenuInsta;