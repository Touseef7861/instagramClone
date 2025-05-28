import React, { useEffect, useState } from "react";
import { View, Image, Text } from 'react-native';
import { auth } from "./../../config/Firebase"; // Adjust this import as needed
import { onAuthStateChanged } from "firebase/auth"; // Remove signOut since we are not using it
import Signin from '@/app/auth/Signin';
import Main from '@/app/auth/Tabs';

const SplashScreen = () => {
  const [isSignedIn, setIsSignedIn] = useState<boolean | null>(null); // null until we know the state

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setTimeout(() => {
        console.log('user',user);
        
        setIsSignedIn(!!user); // true if user is signed in, false otherwise
      }, 2000);
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  // Render based on the sign-in state
  if (isSignedIn === null) {
    // Still checking the auth state
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Image style={{ width: 100, height: 100 }} source={require('@/assets/icons/instagram.png')} />
        <Text style={{ fontSize: 20, color: 'red' }}>Loading...</Text>
      </View>
    );
  }

  return isSignedIn ? (
    // User is signed in, render your main app content
    <Main />
  ) : (
    // User is not signed in, render the Signin component
    <Signin />
  );
};

export default SplashScreen;
