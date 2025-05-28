// RootLayout.tsx
import React from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Provider } from 'react-redux'; // Import Provider
import  store  from './../redux/store'; // Adjust the path as needed
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useFonts({
    'outfit': require('./../assets/fonts/Outfit-Regular.ttf'),
    'outfit-medium': require('./../assets/fonts/Outfit-Medium.ttf'),
    'outfit-bold': require('./../assets/fonts/Outfit-Bold.ttf'),
  });
  
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <Provider store={store}> 
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack    screenOptions={{
       // Hide labels for all tabs
       headerShown: false 
    }}>
          {/* <Stack.Screen name="(App)" options={{ headerShown: false }} /> */}
          {/* <Stack.Screen name="+not-found" options={{ headerShown: false }}/> */}
        </Stack>
      </ThemeProvider>
    </Provider>
  );
}
