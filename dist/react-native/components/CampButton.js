import React from 'react';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { CampIcon } from './icons.js';

const CampButton = ({ onPress, loading = false, disabled = false, children, style, authenticated = false, }) => {
    const isDisabled = disabled || loading;
    return (React.createElement(TouchableOpacity, { style: [styles.button, isDisabled && styles.disabled, style], onPress: onPress, disabled: isDisabled },
        React.createElement(View, { style: styles.buttonContent },
            React.createElement(View, { style: styles.iconContainer },
                React.createElement(CampIcon, null)),
            children || (React.createElement(Text, { style: styles.buttonText }, authenticated ? 'My Origin' : 'Connect')))));
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

export { CampButton };
