import React, { useState, useEffect } from 'react';
import { SearchBar } from '@rneui/themed';
import { View, Text, StyleSheet,FlatList,Image,TextInput,TouchableOpacity ,SafeAreaView} from 'react-native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { firestore,auth } from './../../config/Firebase';
import { useRouter } from 'expo-router';
// import { getAuth } from 'firebase/auth';

// type SearchBarComponentProps = {};
// const firestore = getFirestore();
// const auth = getAuth();

const SearchData= () => {

const [queryText, setQueryText] = useState('');
const [results, setResults] = useState([]);
const router=useRouter();

useEffect(() => {
  const fetchData = async () => {
    if (queryText.length > 0) {
      try {
        // Get the authenticated user's UID
        const user = auth.currentUser;
        if (!user) {
          throw new Error('No user is currently authenticated');
        }

        // Query Firestore for users matching the query
        const usersQuery = query(
          collection(firestore, 'Users'),
          where('fullName', '>=', queryText),
          where('fullName', '<=', queryText + '\uf8ff')
          
        );
     
        const snapshot = await getDocs(usersQuery);
       
        // Map the results
        const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // console.log('ProfileName',users.fullName)
        // console.log('ProfileImage',users.ProfileImage)
        setResults(users);
        
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    } else {
      setResults([]);
    }
  };

  fetchData();
}, [queryText]);

const handlePress = (item) => {
  router.push({
    pathname: '/auth/UserProfile',
    params: {
      userName: item.userName,
      ProfileImage: item.ProfileImage,
      fullName: item.fullName,
      UserId:item.UserId
    }
  });
};
const Search=({item})=>{
  
  return(
   
    <View style={{flexDirection:"row",gap:20,alignItems:'center',padding:10}}>
   

    {item.ProfileImage ? (
      <Image
        source={{ uri: item.ProfileImage }}
        style={{width:50,height:50,borderRadius:25,marginLeft:20,}}
      />
    ) : (
      <View style={styles.placeholderImage} />
    )}
    
    <View style={{}}>
    <TouchableOpacity onPress={()=> handlePress(item)}>
    <Text style={{}}>{item.fullName}</Text>
    </TouchableOpacity>
    </View>
    
  </View>
  
  )
}
return (
  
  <View style={styles.view}>
   <View style={{flexDirection:'row',gap:20,alignItems:'center',marginTop:40}}>
      <Image style={{height:20,width:20,marginLeft:20}} source={require('@/assets/icons/loupe.png')}/>
      
      <TextInput 
      value={queryText}
      onChangeText={setQueryText}
      placeholder='Search the People'
       style={{borderColor:'gray',borderRadius:50,borderWidth:1,width:'80%',color:'gray',paddingHorizontal:10,paddingVertical:5}}/>
    </View>
  <View style={{}}>
 
    
    <FlatList
        data={results}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <Search item={item}/>}
      />
  </View>
 
    {/* <SearchBar */}
  {/* // inputContainerStyle={{borderRadius:10,borderWidth:1,borderColor:'gray'}}
  // containerStyle={{borderRadius:10,borderWidth:1,borderColor:'gray'}}
  //   platform='android'
  //     placeholder="Search for people"
  //       value={queryText}
  //       onChangeText={setQueryText}
  //   /> */}
  </View>
  
);
};

const styles = StyleSheet.create({
view: {
  flex:1,
  width:'100%',
 
  backgroundColor:'white'
},

});

export default SearchData;
