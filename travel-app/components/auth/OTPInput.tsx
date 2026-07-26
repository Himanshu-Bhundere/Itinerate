import React, { useRef, useState, useCallback } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
  Platform,
} from 'react-native';
import { Colors, Radius, Spacing, InputSize } from '../../constants/tokens';

interface OTPInputProps {
  length?: number;
  value: string;
  onChange: (code: string) => void;
  error?: boolean;
}

export default function OTPInput({
  length = 6,
  value,
  onChange,
  error = false,
}: OTPInputProps) {
  const inputs = useRef<(TextInput | null)[]>([]);
  const [focused, setFocused] = useState(0);

  const digits = value.split('').concat(Array(length).fill('')).slice(0, length);

  const handleChange = useCallback(
    (text: string, index: number) => {
      // Handle paste of full code
      if (text.length > 1) {
        const pasted = text.replace(/\D/g, '').slice(0, length);
        onChange(pasted);
        const nextFocus = Math.min(pasted.length, length - 1);
        inputs.current[nextFocus]?.focus();
        return;
      }

      const cleaned = text.replace(/\D/g, '');
      const newDigits = [...digits];
      newDigits[index] = cleaned;
      const newValue = newDigits.join('').slice(0, length);
      onChange(newValue);

      if (cleaned && index < length - 1) {
        inputs.current[index + 1]?.focus();
      }
    },
    [digits, length, onChange],
  );

  const handleKeyPress = useCallback(
    (e: NativeSyntheticEvent<TextInputKeyPressEventData>, index: number) => {
      if (e.nativeEvent.key === 'Backspace' && !digits[index] && index > 0) {
        inputs.current[index - 1]?.focus();
        const newDigits = [...digits];
        newDigits[index - 1] = '';
        onChange(newDigits.join(''));
      }
    },
    [digits, onChange],
  );

  return (
    <View style={styles.container}>
      {Array.from({ length }, (_, i) => (
        <TextInput
          key={i}
          ref={(ref) => { inputs.current[i] = ref; }}
          style={[
            styles.box,
            focused === i && styles.boxFocused,
            error && styles.boxError,
            digits[i] ? styles.boxFilled : null,
          ]}
          value={digits[i]}
          onChangeText={(text) => handleChange(text, i)}
          onKeyPress={(e) => handleKeyPress(e, i)}
          onFocus={() => setFocused(i)}
          keyboardType="number-pad"
          maxLength={i === 0 ? length : 1} // Allow paste on first box
          textContentType="oneTimeCode"
          autoComplete={Platform.OS === 'android' ? 'sms-otp' : 'one-time-code'}
          accessibilityLabel={`Digit ${i + 1} of ${length}`}
          accessibilityHint="Enter the verification code digit"
        />
      ))}
    </View>
  );
}

const BOX_SIZE = 48;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.s,
  },
  box: {
    width: BOX_SIZE,
    height: InputSize.height,
    borderWidth: 1.5,
    borderColor: Colors.divider,
    borderRadius: Radius.s,
    backgroundColor: Colors.white,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '700',
    color: Colors.primaryText,
  },
  boxFocused: {
    borderColor: Colors.blue500,
    borderWidth: 2,
  },
  boxError: {
    borderColor: Colors.danger,
    borderWidth: 2,
  },
  boxFilled: {
    backgroundColor: Colors.blue50,
    borderColor: Colors.blue200,
  },
});
