'use strict';

var tslib_es6 = require('../node_modules/tslib/tslib.es6.js');
var React = require('react');
var reactNative = require('react-native');
var AppKitProvider = require('./AppKitProvider.js');

const AppKitButton = ({ onPress, style, textStyle, children }) => {
    const { openAppKit, isConnected, address } = AppKitProvider.useAppKit();
    const handlePress = () => tslib_es6.__awaiter(void 0, void 0, void 0, function* () {
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
    return (React.createElement(reactNative.TouchableOpacity, { style: [styles.button, isConnected && styles.connectedButton, style], onPress: handlePress },
        React.createElement(reactNative.Text, { style: [styles.buttonText, textStyle] }, displayText)));
};
const styles = reactNative.StyleSheet.create({
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

exports.AppKitButton = AppKitButton;
