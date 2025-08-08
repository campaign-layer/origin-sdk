import { _ as __awaiter } from '../tslib.es6.js';
import React from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useAppKit } from './AppKitProvider.js';
import '@tanstack/react-query';

const AppKitButton = ({ onPress, style, textStyle, children }) => {
    const { openAppKit, isConnected, address } = useAppKit();
    const handlePress = () => __awaiter(void 0, void 0, void 0, function* () {
        if (onPress) {
            onPress();
        }
        else {
            yield openAppKit();
        }
    });
    const displayText = children || (isConnected ?
        `Connected (${address === null || address === void 0 ? void 0 : address.slice(0, 6)}...${address === null || address === void 0 ? void 0 : address.slice(-4)})` :
        'Connect Wallet');
    return (React.createElement(TouchableOpacity, { style: [styles.button, isConnected && styles.connectedButton, style], onPress: handlePress },
        React.createElement(Text, { style: [styles.buttonText, textStyle] }, displayText)));
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

export { AppKitButton };
