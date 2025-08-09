import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, ViewStyle } from 'react-native';
import { CampIcon } from './icons';

interface CampButtonProps {
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;  // REQUIREMENTS FULFILLED
  style?: ViewStyle | ViewStyle[];  // REQUIREMENTS FULFILLED
  authenticated?: boolean; // Made optional for backward compatibility
}

export const CampButton: React.FC<CampButtonProps> = ({
  onPress,
  loading = false,
  disabled = false,
  children,
  style,
  authenticated = false,
}) => {
  const isDisabled = disabled || loading;
  return (
    <TouchableOpacity
      style={[styles.button, isDisabled && styles.disabled, style]}
      onPress={onPress}
      disabled={isDisabled}
    >
      <View style={styles.buttonContent}>
        <View style={styles.iconContainer}>
          <CampIcon />
        </View>
        {children || (
          <Text style={styles.buttonText}>
            {authenticated ? 'My Origin' : 'Connect'}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#ff6d01',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
  },
  disabled: {
    backgroundColor: '#cccccc',
    opacity: 0.6,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 8,
    width: 16,
    height: 16,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
