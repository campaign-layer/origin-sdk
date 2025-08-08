'use strict';

var React = require('react');
var reactNative = require('react-native');
var CampContext = require('../context/CampContext.js');
var index = require('../hooks/index.js');
require('../auth/AuthRN.js');
var CampButton = require('../components/CampButton.js');
var CampModal = require('../components/CampModal.js');
require('../node_modules/tslib/tslib.es6.js');
require('axios');
require('../src/core/origin/index.js');
require('../components/icons.js');

// Example component showing how to use the React Native SDK
const CampAppExample = () => {
    return (React.createElement(CampContext.CampProvider, { clientId: "your-client-id", redirectUri: {
            twitter: "app://redirect/twitter",
            discord: "app://redirect/discord",
            spotify: "app://redirect/spotify"
        } },
        React.createElement(CampAppContent, null)));
};
const CampAppContent = () => {
    const { authenticated, loading, walletAddress, connect, disconnect } = index.useCampAuth();
    const { isOpen, openModal, closeModal } = index.useModal();
    return (React.createElement(reactNative.View, { style: styles.container },
        React.createElement(reactNative.Text, { style: styles.title }, "Camp Network SDK - React Native"),
        React.createElement(reactNative.View, { style: styles.status },
            React.createElement(reactNative.Text, { style: styles.statusText },
                "Status: ",
                loading ? 'Loading...' : authenticated ? 'Connected' : 'Disconnected'),
            walletAddress && (React.createElement(reactNative.Text, { style: styles.address },
                "Address: ",
                walletAddress.slice(0, 6),
                "...",
                walletAddress.slice(-4)))),
        React.createElement(reactNative.View, { style: styles.buttonContainer },
            React.createElement(CampButton.CampButton, { onPress: openModal, authenticated: authenticated, disabled: loading },
                React.createElement(reactNative.Text, { style: styles.statusText }, authenticated ? 'My Origin' : 'Connect'))),
        React.createElement(CampModal.CampModal, { visible: isOpen, onClose: closeModal }),
        React.createElement(reactNative.View, { style: styles.info },
            React.createElement(reactNative.Text, { style: styles.infoTitle }, "Features:"),
            React.createElement(reactNative.Text, { style: styles.infoText }, "\u2022 Wallet connection via AppKit"),
            React.createElement(reactNative.Text, { style: styles.infoText }, "\u2022 Social account linking"),
            React.createElement(reactNative.Text, { style: styles.infoText }, "\u2022 Origin stats and uploads"),
            React.createElement(reactNative.Text, { style: styles.infoText }, "\u2022 Full React Native compatibility"))));
};
const styles = reactNative.StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 30,
        color: '#333',
    },
    status: {
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 8,
        marginBottom: 20,
        alignItems: 'center',
    },
    statusText: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        color: '#333',
    },
    address: {
        fontSize: 14,
        fontFamily: 'monospace',
        color: '#666',
    },
    buttonContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    info: {
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 8,
    },
    infoTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12,
        color: '#333',
    },
    infoText: {
        fontSize: 14,
        marginBottom: 8,
        color: '#666',
    },
});

module.exports = CampAppExample;
