import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { CampProvider } from '../context/CampContext';
import { useCampAuth, useModal } from '../hooks/index.js';
import '../auth/AuthRN';
import { CampButton } from '../components/CampButton.js';
import { CampModal } from '../components/CampModal.js';
import '../../core/twitter';
import '../../core/spotify';
import '../../core/tiktok';
import '../../core/origin';
import '../storage';
import '../components/icons.js';
import '../../constants';
import '../../utils';
import '../../errors';
import '../errors';
import '../types';
import '../tslib.es6.js';
import '../context/CampContext.js';
import '../AuthRN.js';
import 'viem/siwe';
import 'viem';
import 'viem/accounts';
import '../storage.js';

// Example component showing how to use the React Native SDK
const CampAppExample = () => {
    return (React.createElement(CampProvider, { clientId: "your-client-id", redirectUri: {
            twitter: "app://redirect/twitter",
            discord: "app://redirect/discord",
            spotify: "app://redirect/spotify"
        } },
        React.createElement(CampAppContent, null)));
};
const CampAppContent = () => {
    const { authenticated, loading, walletAddress, connect, disconnect } = useCampAuth();
    const { isOpen, openModal, closeModal } = useModal();
    return (React.createElement(View, { style: styles.container },
        React.createElement(Text, { style: styles.title }, "Camp Network SDK - React Native"),
        React.createElement(View, { style: styles.status },
            React.createElement(Text, { style: styles.statusText },
                "Status: ",
                loading ? 'Loading...' : authenticated ? 'Connected' : 'Disconnected'),
            walletAddress && (React.createElement(Text, { style: styles.address },
                "Address: ",
                walletAddress.slice(0, 6),
                "...",
                walletAddress.slice(-4)))),
        React.createElement(View, { style: styles.buttonContainer },
            React.createElement(CampButton, { onPress: openModal, authenticated: authenticated, disabled: loading },
                React.createElement(Text, { style: styles.statusText }, authenticated ? 'My Origin' : 'Connect'))),
        React.createElement(CampModal, { visible: isOpen, onClose: closeModal }),
        React.createElement(View, { style: styles.info },
            React.createElement(Text, { style: styles.infoTitle }, "Features:"),
            React.createElement(Text, { style: styles.infoText }, "\u2022 Wallet connection via AppKit"),
            React.createElement(Text, { style: styles.infoText }, "\u2022 Social account linking"),
            React.createElement(Text, { style: styles.infoText }, "\u2022 Origin stats and uploads"),
            React.createElement(Text, { style: styles.infoText }, "\u2022 Full React Native compatibility"))));
};
const styles = StyleSheet.create({
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

export { CampAppExample as default };
