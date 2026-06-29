import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function PlanMap({ places }: { places: any[] }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Map view is not supported on the web version of the Expo app.</Text>
      <Text style={styles.subText}>({places.length} places pinned)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill as any,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    color: '#64748b',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  subText: {
    color: '#94a3b8',
    textAlign: 'center',
    fontSize: 14,
    marginTop: 8,
  }
});
