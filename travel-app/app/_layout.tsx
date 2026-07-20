import { useFonts } from 'expo-font';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider, useRouter, useSegments, useNavigationContainerRef } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import '../global.css';

import { useColorScheme } from '@/components/useColorScheme';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/useAuthStore';

if (__DEV__) {
  const originalFetch = global.fetch;
  global.fetch = async (url, options) => {
    console.log(`[DEBUG API Request] ${options?.method || 'GET'} -> ${url}`);
    try {
      const response = await originalFetch(url, options);
      console.log(`[DEBUG API Response] ${response.status} <- ${url}`);
      return response;
    } catch (err) {
      console.error(`[DEBUG API Error] Failed: ${url}`, err);
      throw err;
    }
  };
}

export {
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const {
    setSession,
    setProfile,
    setInitialized,
    isInitialized,
    session,
    hasCompletedOnboarding,
  } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();
  const navRef = useNavigationContainerRef();

  useEffect(() => {
    if (!navRef) return;
    const unsubscribe = navRef.addListener('state', (e) => {
      if (__DEV__) {
        console.log('[DEBUG Navigation]', JSON.stringify(e.data.state.routes[e.data.state.routes.length - 1]));
      }
    });
    return unsubscribe;
  }, [navRef]);

  // Listen for auth state changes
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
        if (data) setProfile(data);
      }
      setInitialized(true);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session?.user) {
        const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
        if (data) setProfile(data);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Navigation guard
  useEffect(() => {
    if (!isInitialized || !loaded) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!session && !inAuthGroup) {
      // Not authenticated → start onboarding (or auth-choice if onboarding done)
      if (hasCompletedOnboarding) {
        router.replace('/(auth)/auth-choice');
      } else {
        router.replace('/(auth)/onboarding');
      }
    } else if (session && inAuthGroup) {
      // Authenticated but still in auth group — only redirect if on onboarding/auth-choice
      // Let other auth screens (age-consent, profile, permissions, success) complete their flow
      const currentScreen = segments[1];
      if (currentScreen === 'onboarding' || currentScreen === 'auth-choice' || currentScreen === 'otp-verification') {
        // After OTP verification, check if they already have a completed profile
        supabase.from('profiles').select('username').eq('id', session.user.id).single().then(({ data }) => {
          if (data?.username) {
            router.replace('/(tabs)');
          } else {
            router.replace('/(auth)/age-consent');
          }
        });
      }
      // For all other auth screens, let them navigate naturally
    }
  }, [session, isInitialized, loaded, segments]);

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded && isInitialized) {
      SplashScreen.hideAsync();
    }
  }, [loaded, isInitialized]);

  if (!loaded || !isInitialized) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', headerShown: false }} />
        <Stack.Screen name="plans/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="publish_success" options={{ headerShown: false }} />
        <Stack.Screen name="search" options={{ headerShown: false }} />
        <Stack.Screen name="settings" options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
}
