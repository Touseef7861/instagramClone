import React from 'react';
import { View, Text, Modal, StyleSheet,TouchableOpacity,Image} from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from "./../../config/Firebase";
import Signin from '@/app/auth/Signin';
const Menulogout = ({ showMenu,setShowMenu }) => {

    const Logout=()=>{
        signOut(auth)
        .then(()=>{
            <Signin/>
        })
        .catch((error)=>{
            console.log('error',error);
            
        } )
    }


  return (
    <Modal
      transparent={true}
      visible={showMenu}
      animationType={'slide'}
    >
      <View style={styles.modalView}>
      <View style={{ alignItems: 'center' }}>
          <TouchableOpacity onPress={() => setShowMenu(false)}>
            <Image style={{ height: 25, width: 25, marginTop: 10 }} source={require('@/assets/icons/cancel.png')} />
          </TouchableOpacity>
          <TouchableOpacity onPress={Logout}>
            <Text style={{fontSize:30,color:'red'}}>Log out</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalView: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 10,
    width: '100%',
    height: '100%',
    shadowColor: 'black',
    elevation: 5,
  },
  
});

export default Menulogout;
