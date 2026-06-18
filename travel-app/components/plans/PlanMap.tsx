import React, { useRef, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

export default function PlanMap({ places }: { places: any[] }) {
  const mapRef = useRef<MapView>(null);

  // Filter out places that don't have valid coordinates
  const validPlaces = places.filter(
    (p) => p.latitude != null && p.longitude != null
  );

  useEffect(() => {
    if (validPlaces.length > 0 && mapRef.current) {
      // Create bounds to fit all markers
      const coordinates = validPlaces.map((p) => ({
        latitude: p.latitude,
        longitude: p.longitude,
      }));

      // Fit map to markers with some padding
      setTimeout(() => {
        mapRef.current?.fitToCoordinates(coordinates, {
          edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
          animated: true,
        });
      }, 500);
    }
  }, [places]);

  if (validPlaces.length === 0) {
    return (
      <MapView
        provider={PROVIDER_GOOGLE}
        style={StyleSheet.absoluteFillObject}
        initialRegion={{
          latitude: 20.5937, // Default center on India
          longitude: 78.9629,
          latitudeDelta: 15,
          longitudeDelta: 15,
        }}
      />
    );
  }

  return (
    <MapView
      ref={mapRef}
      provider={PROVIDER_GOOGLE}
      style={StyleSheet.absoluteFillObject}
    >
      {validPlaces.map((place, index) => (
        <Marker
          key={place.id || index.toString()}
          coordinate={{
            latitude: place.latitude,
            longitude: place.longitude,
          }}
          title={place.name}
          description={place.category}
        />
      ))}
    </MapView>
  );
}
