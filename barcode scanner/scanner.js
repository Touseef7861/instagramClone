import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';

const BarcodeScanner = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<string | null>(null);

  // Request camera permission
  const askForCameraPermission = async () => {
    const { status } = await BarCodeScanner.requestPermissionsAsync();
    setHasPermission(status === 'granted');
  };

  // Request permission as soon as the component mounts
  useEffect(() => {
    askForCameraPermission();
  }, []); // Empty dependency array ensures this runs once on mount

  const handleScan = ({ data }: { data: string }) => {
    setScanned(true);
    setScanResult(data);
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text>Requesting for camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text>No access to camera</Text>
        <TouchableOpacity onPress={askForCameraPermission}>
          <Text>Request Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleScan}
        style={styles.scanner}
      />
      {scanned && scanResult && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>Scan Result:</Text>
          <Text style={styles.resultData}>{scanResult}</Text>
          <TouchableOpacity onPress={() => setScanned(false)}>
            <Text>Scan again</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanner: {
    width: 300,
    height: 250,
  },
  resultContainer: {
    padding: 10,
    backgroundColor: '#f7f7f7',
    borderRadius: 5,
  },
  resultText: {
    fontSize: 16,
    color: '#333',
  },
  resultData: {
    fontSize: 18,
    color: '#666',
  },
});

export default BarcodeScanner;
