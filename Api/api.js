import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Button ,Modal,TextInput,StyleSheet,FlatList} from 'react-native';
interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}
const ApiData = () => {
  const [data, setData] = useState<User[]>([]);
  const [showModal,setShowModal]=useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchUser, setSearchUser] = useState<User[]>([]);
  const [showModalAdd,setShowModalAdd]=useState(false)
  const [noUser,setNoUser]=useState(false)
 
// json-server --watch db.json in cmd location of api folder
  const fetchAPIData = async () => {
    const url = 'http://192.168.2.41:3000/users';
    try {
      let response = await fetch(url);
      let result = await response.json();
      setData(result );
    } catch (error) {
      console.error("Error fetching data:", error);
      setData([]);
    }
  };

  const deleteUser = async (id:any) => {
    const url = `http://192.168.2.41:3000/users/${id}`;
    try {
      let response = await fetch(url, {
        method: 'DELETE'
      });

      if (response.ok) {
        console.warn('User deleted');
        setSearchUser(prevSearch => prevSearch.filter(user => user.id !== id));
        fetchAPIData()
      } else {
        console.error('Error deleting user:', response.statusText);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  useEffect(() => {
    fetchAPIData();
  }, []);
  const ModalShow=(item:any)=>{
    setShowModal(true)
    setSelectedUser(item)
  }
  const userSearch=async (text:any)=>{
    const URL=`http://192.168.2.41:3000/users?q=${text}`
    let result=await fetch(URL)
    result=await result.json()
      if (text.trim() === "") {
        setSearchUser([]); 
        setNoUser(false)// Reset search results
        return;
      }
    
      const filteredUsers = result.filter(user =>
        user.name.toLowerCase().includes(text.toLowerCase()) ||
        // user.email.toLowerCase().includes(text.toLowerCase())||
        user.age.toString().includes(text)
      );
    // if(filteredUsers!=text){
    //   <Text>No user found</Text>
    // }
     
    if(filteredUsers.length>0){
      setSearchUser(filteredUsers)
    }else{
      
      setNoUser(true)
    }
  }
  return (
    
      <View style={{ flex: 1 }}>
      <TextInput style={{borderWidth:1,padding:5,margin:5,marginTop:50}} placeholder={"Search"} onChangeText={(text)=>userSearch(text)}/>
        <View style={{ margin: 5, marginTop: 10, flexDirection: 'row' }}>
          <View style={{ flex: 1 }}><Text style={{ fontSize: 18 }}>ID</Text></View>
          <View style={{ flex: 2 }}><Text style={{ marginLeft: 20 }}>Name</Text></View>
          <View style={{ flex: 3 }}><Text style={{ marginLeft: 20 }}>Age</Text></View>
          <View style={{ flex: 3 }}><Text style={{ marginLeft: 20 }}>Operations</Text></View>
        </View>
        {/* {(searchUser.length > 0 ? searchUser : data).map((item) => (
        <View key={item.id} style={{ margin: 5, flexDirection: 'row', backgroundColor: 'orange', padding: 5, justifyContent: 'space-between' }}>
          <View style={{ flex: 0.5 }}><Text style={{ fontSize: 18 }}>{item.id}</Text></View>
          <View style={{ flex: 1 }}><Text style={{ marginLeft: 20 }}>{item.name}</Text></View>
          <View style={{ flex: 1 }}><Text style={{ marginLeft: 20 }}>{item.age}</Text></View>
          <View style={{ flex: 1 }}><Button onPress={() => deleteUser(item.id)} title="Delete" /></View>
          <View style={{ flex: 1 }}><Button title="Update" onPress={() => ModalShow(item)} /></View>
        </View>
      ))} */}
       {(searchUser.length > 0 && noUser==false)? 
        (<FlatList
        data={searchUser}
        renderItem={({item})=> (
        <View key={item.id} style={{ margin: 5, flexDirection: 'row', backgroundColor: 'orange', padding: 5, justifyContent: 'space-between' }}>
          <View style={{ flex: 0.5 }}><Text style={{ fontSize: 18 }}>{item.id}</Text></View>
          <View style={{ flex: 1 }}><Text style={{ marginLeft: 20 }}>{item.name}</Text></View>
          <View style={{ flex: 1 }}><Text style={{ marginLeft: 20 }}>{item.age}</Text></View>
          <View style={{ flex: 1 }}><Button onPress={() => deleteUser(item.id)} title="Delete" /></View>
          <View style={{ flex: 1 }}><Button title="Update" onPress={() => ModalShow(item)} /></View>
        </View>
      )}/>): noUser?<Text style={{fontSize:18,color:'red',marginLeft:20}}>no user  found</Text>:(<FlatList
        data={data}
         renderItem={({item})=> (
         <View key={item.id} style={{ margin: 5, flexDirection: 'row', backgroundColor: 'orange', padding: 5, justifyContent: 'space-between' }}>
           <View style={{ flex: 0.5 }}><Text style={{ fontSize: 18 }}>{item.id}</Text></View>
           <View style={{ flex: 1 }}><Text style={{ marginLeft: 20 }}>{item.name}</Text></View>
           <View style={{ flex: 1 }}><Text style={{ marginLeft: 20 }}>{item.age}</Text></View>
           <View style={{ flex: 1 }}><Button onPress={() => deleteUser(item.id)} title="Delete" /></View>
           <View style={{ flex: 1 }}><Button title="Update" onPress={() => ModalShow(item)} /></View>
         </View>
       )}/>)}

      <Button title="Add User" onPress={()=>setShowModalAdd(true)} />
      <Modal
        visible={showModal}
        animationType="slide"
        transparent>
         <UserModal setShowModal={setShowModal} selectedUser={selectedUser} fetchAPIData={fetchAPIData} />
        </Modal>
        <Modal
        visible={showModalAdd}
        animationType="slide"
        transparent>
         <AddUserData setShowModalAdd={setShowModalAdd} data={data} setData={setData}/>
        </Modal>
      </View>
     
    
    
  );
};
const AddUserData=({setShowModalAdd,data,setData}:{setShowModalAdd:any,data:any,setData:any})=>{
  const [name,setName]=useState('')
  const [email,setEmail]=useState('')
  const [age,setAge]=useState('')

  const addUser = async () => {
    const url = 'http://192.168.2.41:3000/users';
    try {
      const currentIds = data.map(user => user.id);
      const newId = (currentIds.length > 0 ? Math.max(...currentIds.map(id => parseInt(id))) + 1 : 1).toString();
      const userToAdd = {
        id: newId,
        name,
        age,
        email,
      };
  
      let response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userToAdd),
      });
  
      let result = await response.json();
      if (result && result.id) {
        setData(prevData => [...prevData, userToAdd]);
        setShowModalAdd(false)
      } else {
        console.error("Unexpected response format:", result);
      }
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };
  return(
    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
    <View style={{backgroundColor:'white',padding:20,borderRadius:5,shadowColor:'gray',shadowOpacity:1,elevation:5}}>
    <Text>Name</Text>
    <TextInput style={styles.input} value={name} onChangeText={(value)=>setName(value)}/>
    <Text>Age</Text>
    <TextInput style={styles.input} value={age} onChangeText={(value)=>setAge(value)}/>
    <Text>Email</Text>
    <TextInput style={styles.input} value={email} onChangeText={(value)=>setEmail(value)}/>
    <View style={{marginBottom:10}}><Button title="Add" onPress={addUser}/></View>
    <Button title="close" onPress={()=>setShowModalAdd(false)}/>
    </View>
    </View>
  )
}
const UserModal=({setShowModal,selectedUser,fetchAPIData}:{setShowModal:any,selectedUser:any,fetchAPIData:any})=>{
  const [name,setName]=useState('')
  const [email,setEmail]=useState('')
  const [age,setAge]=useState('')
  useEffect(()=>{
    setName(selectedUser.name)
    setAge(selectedUser.age.toString())
    setEmail(selectedUser.email)
  },[])
  const updateUser=async ()=>{
    const url='http://192.168.2.41:3000/users';
    const id=selectedUser.id
    let result= await fetch(`${url}/${id}`,{
      method:'PUT',
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({name,age,email})
    })
    result=await result.json()
    if(result){
      console.warn('result',result)
      fetchAPIData()
      setShowModal(false)
    }
  }
  return(
    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
    <View style={{backgroundColor:'white',padding:20,borderRadius:5,shadowColor:'gray',shadowOpacity:1,elevation:5}}>
    <Text>Name</Text>
    <TextInput style={styles.input} value={name} onChangeText={(value)=>setName(value)}/>
    <Text>Age</Text>
    <TextInput style={styles.input} value={age} onChangeText={(value)=>setAge(value)}/>
    <Text>Email</Text>
    <TextInput style={styles.input} value={email} onChangeText={(value)=>setEmail(value)}/>
    <View style={{marginBottom:10}}><Button title="update" onPress={updateUser}/></View>
    <Button title="close" onPress={()=>setShowModal(false)}/>
    </View>
    </View>
  )
}
const styles=StyleSheet.create({
  input:{
    borderWidth:1,
    padding:5,
    width:300,
    marginBottom:10
  }
})
export default ApiData;
