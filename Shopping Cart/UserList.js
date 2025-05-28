import React,{useEffect} from "react";
import {View,Text} from 'react-native';
import {useDispatch,useSelector} from 'react-redux';
import {getUserList} from '../redux/action';
const UserList=()=>{
  const userList=useSelector((state)=>state.reducer)
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getUserList());
  });
  console.warn("in component saga",userList);
  
  return(
    <View style={{backgroundColor:'orange',padding:20}}>
    <Text style={{fontSize:30,textAlign:'right'}}>User List</Text>
  
  </View>
  )
}
export default UserList;