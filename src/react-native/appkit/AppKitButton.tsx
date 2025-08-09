import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { useAppKit } from './AppKitProvider';

interface AppKitButtonProps {
  onPress?: () => void;
  style?: any;
  textStyle?: any;
  children?: React.ReactNode;
}

export const AppKitButton: React.FC<AppKitButtonProps> = ({
  onPress,
  style,
  textStyle,
  children
}) => {
  const { openAppKit, isConnected, address } = useAppKit();

  const handlePress = async () => {
    if (onPress) {
      onPress();
    } else {
      await openAppKit();
    }
  };

  const displayText = children || (isConnected ? 
    `Connected (${address?.slice(0, 6)}...${address?.slice(-4)})` : 
    'Connect Wallet'
  );

  return (
    <TouchableOpacity 
      style={[styles.button, isConnected && styles.connectedButton, style]} 
      onPress={handlePress}
    >
      <Text style={[styles.buttonText, textStyle]}>
        {displayText}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#3498db',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 150,
  },
  connectedButton: {
    backgroundColor: '#27ae60',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
