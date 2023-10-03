import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Button } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";

const EAN13 = 32;

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanning, setScanning] = useState(false);

  const [items, setItems] = useState([]);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = ({ data }) => {
    setScanning(false);
    setItems(prev => [...prev, data]);
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Hurtig</Text>
      <BarCodeScanner
        barCodeTypes={[EAN13]}
        onBarCodeScanned={scanning ? handleBarCodeScanned : undefined}
        style={styles.scanner}
      />
      <Button
        title={scanning ? "Cancel" : "Scan"}
        color={scanning ? "red" : "blue"}
        onPress={() => setScanning(prev => !prev)}
      />
      <View>
        {items.map((i, idx) => <Text key={`item-${idx}`}>{i}</Text>)}
        {items.length > 0 &&
          <Button title="Clear" onPress={() => setItems([])} />
        }
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "space-around",
  },
  header: {
    fontSize: 30
  },
  scanner: {
    width: "100%",
    height: "50%",
  },
});
