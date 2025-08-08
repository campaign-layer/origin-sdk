'use strict';

var React = require('react');
var reactNative = require('react-native');
var icons = require('./icons.js');

const CampButton = ({ onPress, loading = false, disabled = false, children, style, authenticated = false, }) => {
    const isDisabled = disabled || loading;
    return (React.createElement(reactNative.TouchableOpacity, { style: [styles.button, isDisabled && styles.disabled, style], onPress: onPress, disabled: isDisabled },
        React.createElement(reactNative.View, { style: styles.buttonContent },
            React.createElement(reactNative.View, { style: styles.iconContainer },
                React.createElement(icons.CampIcon, null)),
            children || (React.createElement(reactNative.Text, { style: styles.buttonText }, authenticated ? 'My Origin' : 'Connect')))));
};
const styles = reactNative.StyleSheet.create({
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

exports.CampButton = CampButton;
