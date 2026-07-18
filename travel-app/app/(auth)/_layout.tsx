import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="auth-choice" />
      <Stack.Screen name="otp-verification" />
      <Stack.Screen name="age-consent" />
      <Stack.Screen name="profile-setup" />
      <Stack.Screen name="permissions" />
      <Stack.Screen name="auth-success" options={{ gestureEnabled: false }} />
    </Stack>
  );
}
