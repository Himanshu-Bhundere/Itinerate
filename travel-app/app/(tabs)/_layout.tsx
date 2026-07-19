import { Tabs } from 'expo-router';
import { Platform, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Typography, Shadows } from '../../constants/tokens';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.blue500,
        tabBarInactiveTintColor: Colors.placeholder,
        headerShown: false,
        tabBarStyle: {
          borderTopWidth: 0,
          backgroundColor: Colors.white,
          minHeight: Platform.OS === 'android' ? 70 : 80,
          paddingBottom: Platform.OS === 'android' ? Math.max(insets.bottom, 12) : insets.bottom,
          paddingTop: 12,
          ...Shadows.card,
        },
        tabBarLabelStyle: {
          ...Typography.micro,
          fontWeight: '600',
          marginTop: 4,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused, color, size }) => <Ionicons name={focused ? "home" : "home-outline"} size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ focused, color, size }) => <Ionicons name={focused ? "search" : "search-outline"} size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: 'Create',
          tabBarIcon: ({ focused }) => (
            <View style={{
              backgroundColor: focused ? Colors.blue500 : Colors.blue400,
              width: 48,
              height: 48,
              borderRadius: 24,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: -15,
              ...Shadows.fab,
            }}>
              <Ionicons name="add" size={28} color={Colors.white} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: 'Saved',
          tabBarIcon: ({ focused, color, size }) => <Ionicons name={focused ? "heart" : "heart-outline"} size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused, color, size }) => <Ionicons name={focused ? "person" : "person-outline"} size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
