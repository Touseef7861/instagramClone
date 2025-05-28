import React, { useState, useEffect } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, Image, TextInput, FlatList } from 'react-native';
import { firestore } from './../../config/Firebase'; // Adjust path as needed
import { collection, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';

// Custom function to format time
const formatTime = (timestamp) => {
  if (!(timestamp instanceof Date)) return ''; // Handle cases where timestamp is not a Date object

  const now = new Date();
  const timeDiff = Math.floor((now - timestamp) / 1000); // Time difference in seconds

  if (timeDiff < 60) {
    return `${timeDiff}s`; // Seconds
  } else if (timeDiff < 3600) {
    return `${Math.floor(timeDiff / 60)}m`; // Minutes
  } else if (timeDiff < 86400) {
    return `${Math.floor(timeDiff / 3600)}h`; // Hours
  } else {
    return `${Math.floor(timeDiff / 86400)}d`; // Days
  }
};

const Chat = ({ comment, ShowComment, postId }) => {
  const [text, setText] = useState('');
  const [comments, setComments] = useState([]);

  useEffect(() => {
    if (postId) {
      const unsubscribe = onSnapshot(collection(firestore, `instaCollection/${postId}/comments`), (snapshot) => {
        const fetchedComments = snapshot.docs.map(doc => {
          const data = doc.data();
          const createdAt = data.createdAt?.toDate() || new Date(); // Ensure createdAt is a Date object

          // Debug: Log the fetched comment and timestamp
          console.log('Fetched comment:', data.comment);
          console.log('CreatedAt timestamp:', createdAt);

          return {
            ...data,
            id: doc.id,
            createdAt,
          };
        });
        setComments(fetchedComments);
      });

      return () => unsubscribe();
    }
  }, [postId]);

  const handleAddComment = async () => {
    if (text.trim()) {
      try {
        await addDoc(collection(firestore, `instaCollection/${postId}/comments`), {
          comment: text,
          createdAt: serverTimestamp(),
        });
        setText(''); // Clear input field
      } catch (error) {
        console.error('Error adding comment: ', error);
      }
    }
  };

  const renderComment = ({ item }) => (
    <View style={styles.commentContainer}>
      <Image style={styles.pic} source={require('@/assets/images/th.png')} />
      <View style={styles.commentTextContainer}>
        <Text style={styles.commentText}>{item.comment}</Text>
        <Text style={styles.commentTime}>{formatTime(item.createdAt)}</Text>
      </View>
    </View>
  );

  return (
    <Modal
      transparent={true}
      visible={comment}
      animationType={'slide'}
    >
      <View style={styles.modalView}>
        <View style={{ alignItems: 'center' }}>
          <TouchableOpacity onPress={() => ShowComment(false)}>
            <Image style={{ height: 25, width: 25, marginTop: 10 }} source={require('@/assets/icons/cancel.png')} />
          </TouchableOpacity>
          <Text style={{ fontSize: 15 }}>Comment</Text>
        </View>
        <View style={{ flex: 9 }}>
          <FlatList
            data={comments}
            renderItem={renderComment}
            keyExtractor={(item) => item.id}
          />
        </View>
        <View style={{ flex: 1, alignItems: 'flex-end', flexDirection: 'row', columnGap: 5, alignItems: 'center' }}>
          <Image style={[styles.pic, { resizeMode: 'repeat' }]} source={require('@/assets/images/th.png')} />
          <TextInput
            placeholder='Add a comment'
            onChangeText={setText}
            style={{ color: 'gray', width: '75%' }}
            value={text}
          />
          <TouchableOpacity onPress={handleAddComment}>
            <Image style={{ height: 20, width: 20 }} source={require('@/assets/icons/up-arrow.png')} />
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
  pic: {
    height: 35,
    width: 35,
    borderRadius: 50,
    borderColor: 'gray',
    borderWidth: 1,
    marginLeft: 15
  },
  commentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  commentTextContainer: {
    flex: 1,
    marginLeft: 10,
    flexDirection:'row'
  },
  commentText: {
    fontSize: 15,
  },
  commentTime: {
    fontSize: 10,
    color: 'gray',
    marginTop: 5,
  }
});

export default Chat;
