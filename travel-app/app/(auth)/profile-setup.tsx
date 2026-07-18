import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
  ScrollView,
  Image,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { decode } from 'base64-arraybuffer';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../stores/useAuthStore';
import {
  Colors,
  Typography,
  Spacing,
  Radius,
  ButtonSize,
  InputSize,
  Shadows,
  AvatarSize,
  IconSize,
} from '../../constants/tokens';

const TRAVEL_INTERESTS = [
  'Adventure', 'Beach', 'Cultural', 'Food & Drink',
  'Nature', 'Nightlife', 'Relaxation', 'Road Trips',
  'Solo Travel', 'Photography', 'Hiking', 'Luxury',
];

const BUDGET_OPTIONS = ['Budget', 'Mid-Range', 'Luxury', 'No Preference'];

export default function ProfileSetupScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { session, setProfileComplete } = useAuthStore();

  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarBase64, setAvatarBase64] = useState<string | null>(null);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [budgetPref, setBudgetPref] = useState('');
  const [loading, setLoading] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');

  function toggleInterest(interest: string) {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest],
    );
  }

  async function pickImage() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      base64: true,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      const base64 = result.assets[0].base64;
      setAvatarUrl(uri);
      if (base64) setAvatarBase64(base64);
    }
  }

  async function checkUsername(value: string) {
    const cleaned = value.toLowerCase().replace(/[^a-z0-9_]/g, '');
    setUsername(cleaned);

    if (cleaned.length < 3) {
      setUsernameStatus('idle');
      return;
    }

    setUsernameStatus('checking');

    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', cleaned)
      .maybeSingle();

    if (error) {
      setUsernameStatus('idle');
      return;
    }

    setUsernameStatus(data ? 'taken' : 'available');
  }

  async function handleContinue() {
    if (!displayName.trim()) {
      Alert.alert('Name Required', 'Please enter your display name.');
      return;
    }
    if (!username.trim()) {
      Alert.alert('Username Required', 'Please enter a unique username.');
      return;
    }
    if (usernameStatus === 'taken') {
      Alert.alert('Username Taken', 'Please choose a different username.');
      return;
    }

    setLoading(true);

        let finalAvatarUrl = null;

        if (avatarUrl && avatarBase64) {
          const fileExt = avatarUrl.split('.').pop() || 'jpg';
          const fileName = `${session.user.id}-${Date.now()}.${fileExt}`;
          const filePath = `avatars/${fileName}`;
          
          const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(filePath, decode(avatarBase64), {
              contentType: `image/${fileExt === 'jpg' ? 'jpeg' : fileExt}`
            });

          if (!uploadError) {
            const { data: { publicUrl } } = supabase.storage
              .from('avatars')
              .getPublicUrl(filePath);
            finalAvatarUrl = publicUrl;
          } else {
            console.error('Avatar upload error:', uploadError);
          }
        }

        const { error } = await supabase
          .from('profiles')
          .upsert({
            id: session.user.id,
            display_name: displayName.trim(),
            username: username || null,
            avatar_url: finalAvatarUrl,
            is_verified: true,
          });

      if (error) {
        Alert.alert('Error', error.message);
        setLoading(false);
        return;
      }

    setProfileComplete();
    setLoading(false);
    router.push('/(auth)/permissions');
  }

  const usernameIcon = {
    idle: null,
    checking: <ActivityIndicator size="small" color={Colors.blue500} />,
    available: <Ionicons name="checkmark-circle" size={20} color={Colors.success} />,
    taken: <Ionicons name="close-circle" size={20} color={Colors.danger} />,
  }[usernameStatus];

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <StatusBar barStyle="dark-content" backgroundColor={Colors.surface} />

      <View style={{ paddingTop: Math.max(insets.top, 20) }}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Ionicons name="arrow-back" size={IconSize.primary} color={Colors.primaryText} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleContinue}
            disabled={loading}
            accessibilityRole="button"
            accessibilityLabel="Skip profile setup"
          >
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Set Up Your Profile</Text>
        <Text style={styles.subtitle}>Tell us a bit about yourself and your travel style.</Text>

        {/* Avatar */}
        <View style={styles.avatarSection}>
          <TouchableOpacity onPress={pickImage} style={styles.avatarPlaceholder} accessibilityLabel="Upload profile picture">
            {avatarUrl ? (
              <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
            ) : (
              <Ionicons name="person" size={40} color={Colors.placeholder} />
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={pickImage} style={styles.avatarButton} accessibilityLabel="Upload profile picture">
            <Ionicons name="camera" size={16} color={Colors.white} />
          </TouchableOpacity>
          <Text style={styles.avatarHint}>Skip Avatar</Text>
        </View>

        {/* Display Name */}
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Display Name</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={IconSize.small} color={Colors.placeholder} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="How should others call you?"
              placeholderTextColor={Colors.placeholder}
              value={displayName}
              onChangeText={setDisplayName}
              accessibilityLabel="Display name"
            />
          </View>
        </View>

        {/* Username */}
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Username</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="at" size={IconSize.small} color={Colors.placeholder} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Choose a unique username"
              placeholderTextColor={Colors.placeholder}
              value={username}
              onChangeText={checkUsername}
              autoCapitalize="none"
              accessibilityLabel="Username"
            />
            {usernameIcon && <View style={styles.trailingIcon}>{usernameIcon}</View>}
          </View>
          {usernameStatus === 'taken' && (
            <Text style={styles.fieldError}>This username is already taken.</Text>
          )}
          {usernameStatus === 'available' && (
            <Text style={styles.fieldSuccess}>Username is available!</Text>
          )}
        </View>

        {/* Travel Interests */}
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Travel Interests</Text>
          <View style={styles.chipsContainer}>
            {TRAVEL_INTERESTS.map((interest) => {
              const selected = selectedInterests.includes(interest);
              return (
                <TouchableOpacity
                  key={interest}
                  style={[styles.chip, selected && styles.chipSelected]}
                  onPress={() => toggleInterest(interest)}
                  activeOpacity={0.7}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: selected }}
                  accessibilityLabel={interest}
                >
                  <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                    {interest}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Budget */}
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Budget Preference</Text>
          <View style={styles.budgetRow}>
            {BUDGET_OPTIONS.map((option) => {
              const selected = budgetPref === option;
              return (
                <TouchableOpacity
                  key={option}
                  style={[styles.budgetOption, selected && styles.budgetSelected]}
                  onPress={() => setBudgetPref(option)}
                  activeOpacity={0.7}
                  accessibilityRole="radio"
                  accessibilityState={{ selected }}
                  accessibilityLabel={option}
                >
                  <Text style={[styles.budgetText, selected && styles.budgetTextSelected]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={[styles.bottomContainer, { paddingBottom: Math.max(insets.bottom, 24) }]}>
        <TouchableOpacity
          onPress={handleContinue}
          disabled={loading || !displayName.trim() || !username.trim() || usernameStatus === 'taken'}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Continue to permissions"
        >
          <View style={[styles.ctaButton, (loading || !displayName.trim() || !username.trim() || usernameStatus === 'taken') && styles.ctaDisabled]}>
            {loading ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <Text style={styles.ctaText}>Continue</Text>
            )}
          </View>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.l,
    paddingVertical: Spacing.m,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: Radius.circular,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.card,
  },
  skipText: {
    ...Typography.body,
    color: Colors.secondaryText,
    fontWeight: '600',
  },
  scrollContent: {
    paddingHorizontal: Spacing.l,
    paddingBottom: Spacing.xl,
  },
  title: {
    ...Typography.headingL,
    color: Colors.primaryText,
    marginBottom: Spacing.s,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.secondaryText,
    marginBottom: Spacing.xl,
    lineHeight: 24,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  avatarPlaceholder: {
    width: AvatarSize.hero,
    height: AvatarSize.hero,
    borderRadius: Radius.circular,
    backgroundColor: Colors.disabledBg,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Colors.blue50,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  avatarButton: {
    position: 'absolute',
    bottom: 20,
    right: '35%',
    width: 32,
    height: 32,
    borderRadius: Radius.circular,
    backgroundColor: Colors.blue500,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Colors.white,
  },
  avatarHint: {
    ...Typography.caption,
    color: Colors.secondaryText,
    marginTop: Spacing.s,
  },
  fieldContainer: {
    marginBottom: Spacing.l,
  },
  fieldLabel: {
    ...Typography.bodySmall,
    fontWeight: '700',
    color: Colors.primaryText,
    marginBottom: Spacing.s,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: InputSize.height,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.divider,
    borderRadius: InputSize.radius,
    paddingHorizontal: InputSize.padding,
  },
  inputIcon: {
    marginRight: Spacing.s,
  },
  input: {
    flex: 1,
    height: '100%',
    ...Typography.body,
    color: Colors.primaryText,
  },
  trailingIcon: {
    marginLeft: Spacing.s,
  },
  fieldError: {
    ...Typography.caption,
    color: Colors.danger,
    marginTop: Spacing.xs,
  },
  fieldSuccess: {
    ...Typography.caption,
    color: Colors.success,
    marginTop: Spacing.xs,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.s,
  },
  chip: {
    paddingHorizontal: Spacing.m,
    paddingVertical: Spacing.s,
    borderRadius: Radius.circular,
    borderWidth: 1,
    borderColor: Colors.divider,
    backgroundColor: Colors.white,
  },
  chipSelected: {
    backgroundColor: Colors.blue500,
    borderColor: Colors.blue500,
  },
  chipText: {
    ...Typography.bodySmall,
    color: Colors.primaryText,
    fontWeight: '500',
  },
  chipTextSelected: {
    color: Colors.white,
  },
  budgetRow: {
    flexDirection: 'row',
    gap: Spacing.s,
    flexWrap: 'wrap',
  },
  budgetOption: {
    flex: 1,
    minWidth: 80,
    paddingVertical: Spacing.s,
    paddingHorizontal: Spacing.m,
    borderRadius: Radius.s,
    borderWidth: 1,
    borderColor: Colors.divider,
    backgroundColor: Colors.white,
    alignItems: 'center',
  },
  budgetSelected: {
    backgroundColor: Colors.blue500,
    borderColor: Colors.blue500,
  },
  budgetText: {
    ...Typography.caption,
    fontWeight: '600',
    color: Colors.primaryText,
  },
  budgetTextSelected: {
    color: Colors.white,
  },
  bottomContainer: {
    paddingHorizontal: Spacing.l,
    paddingTop: Spacing.m,
    backgroundColor: Colors.surface,
  },
  ctaButton: {
    width: '100%',
    height: ButtonSize.primary,
    backgroundColor: Colors.blue500,
    borderRadius: ButtonSize.radius,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ctaDisabled: {
    opacity: 0.5,
  },
  ctaText: {
    ...Typography.body,
    fontWeight: '700',
    color: Colors.white,
  },
});
