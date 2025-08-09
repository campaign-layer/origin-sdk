import { _ as __awaiter } from '../tslib.es6.js';
import React, { useContext } from 'react';
import { StyleSheet, View, Modal, SafeAreaView, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useAuthState, useConnect, useSocials } from './hooks.js';
import { ModalContext } from '../context/ModalContext.js';
import { CampContext } from '../context/CampContext.js';
import { CampButton, LoadingSpinner } from './buttons.js';
import '../context/SocialsContext.js';
import '@tanstack/react-query';
import '../context/OriginContext.js';
import '../AuthRN.js';
import 'viem/siwe';
import 'viem';
import '../../errors';
import 'viem/accounts';
import '../storage.js';

const CampModal = ({ projectId, onWalletConnect }) => {
    const { authenticated, loading } = useAuthState();
    const { isVisible, setIsVisible } = useContext(ModalContext);
    const { connect, disconnect } = useConnect();
    const { auth } = useContext(CampContext);
    const handleConnect = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield connect();
        }
        catch (error) {
            Alert.alert("Connection Error", "Failed to connect wallet");
        }
    });
    const handleModalButton = () => {
        setIsVisible(true);
    };
    const handleDisconnect = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield disconnect();
            setIsVisible(false);
        }
        catch (error) {
            Alert.alert("Disconnect Error", "Failed to disconnect");
        }
    });
    return (React.createElement(View, null,
        React.createElement(CampButton, { onPress: handleModalButton, authenticated: authenticated, disabled: loading }),
        React.createElement(Modal, { visible: isVisible, animationType: "slide", presentationStyle: "pageSheet", onRequestClose: () => setIsVisible(false) },
            React.createElement(SafeAreaView, { style: styles.modalContainer },
                React.createElement(View, { style: styles.header },
                    React.createElement(Text, { style: styles.title }, authenticated ? "My Origin" : "Connect to Origin"),
                    React.createElement(TouchableOpacity, { style: styles.closeButton, onPress: () => setIsVisible(false) },
                        React.createElement(Text, { style: styles.closeButtonText }, "\u2715"))),
                React.createElement(ScrollView, { style: styles.content },
                    loading && (React.createElement(View, { style: styles.loadingContainer },
                        React.createElement(LoadingSpinner, null),
                        React.createElement(Text, { style: styles.loadingText }, "Connecting..."))),
                    !authenticated && !loading && (React.createElement(AuthSection, { onConnect: handleConnect })),
                    authenticated && !loading && (React.createElement(AuthenticatedSection, { walletAddress: (auth === null || auth === void 0 ? void 0 : auth.walletAddress) || undefined, onDisconnect: handleDisconnect }))),
                React.createElement(View, { style: styles.footer },
                    React.createElement(Text, { style: styles.footerText }, "Powered by Camp Network"))))));
};
const AuthSection = ({ onConnect }) => (React.createElement(View, { style: styles.authSection },
    React.createElement(View, { style: styles.logoContainer },
        React.createElement(Text, { style: styles.logo }, "\uD83C\uDFD5\uFE0F")),
    React.createElement(Text, { style: styles.description }, "Connect your wallet to access Camp Network features"),
    React.createElement(TouchableOpacity, { style: styles.connectButton, onPress: onConnect },
        React.createElement(Text, { style: styles.connectButtonText }, "Connect Wallet"))));
const AuthenticatedSection = ({ walletAddress, onDisconnect }) => {
    const { socials, isLoading } = useSocials();
    const formatAddress = (address, chars = 6) => {
        if (!address)
            return "";
        return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
    };
    return (React.createElement(View, { style: styles.authenticatedSection },
        React.createElement(View, { style: styles.profileSection },
            React.createElement(Text, { style: styles.walletAddress }, formatAddress(walletAddress || "", 6))),
        React.createElement(View, { style: styles.socialsSection },
            React.createElement(Text, { style: styles.sectionTitle }, "Connected Socials"),
            isLoading ? (React.createElement(LoadingSpinner, { size: "small" })) : (React.createElement(View, { style: styles.socialsList }, Object.entries(socials || {}).map(([platform, connected]) => (React.createElement(View, { key: platform, style: styles.socialItem },
                React.createElement(Text, { style: styles.socialName }, platform),
                React.createElement(Text, { style: [
                        styles.socialStatus,
                        connected ? styles.connected : styles.notConnected
                    ] }, connected ? "Connected" : "Not Connected"))))))),
        React.createElement(TouchableOpacity, { style: styles.disconnectButton, onPress: onDisconnect },
            React.createElement(Text, { style: styles.disconnectButtonText }, "Disconnect"))));
};
const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: "#F9F6F2",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#D1D1D1",
    },
    title: {
        fontSize: 20,
        fontWeight: "600",
        color: "#2B2B2B",
    },
    closeButton: {
        padding: 8,
    },
    closeButtonText: {
        fontSize: 18,
        color: "#2B2B2B",
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    loadingContainer: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 40,
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: "#2B2B2B",
    },
    authSection: {
        alignItems: "center",
        paddingVertical: 40,
    },
    logoContainer: {
        marginBottom: 24,
    },
    logo: {
        fontSize: 64,
    },
    description: {
        fontSize: 16,
        textAlign: "center",
        color: "#2B2B2B",
        marginBottom: 32,
        paddingHorizontal: 20,
    },
    connectButton: {
        backgroundColor: "#FF6D01",
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 12,
        minWidth: 200,
        alignItems: "center",
    },
    connectButtonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "600",
    },
    authenticatedSection: {
        paddingVertical: 20,
    },
    profileSection: {
        alignItems: "center",
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#D1D1D1",
        marginBottom: 20,
    },
    walletAddress: {
        fontSize: 18,
        fontWeight: "600",
        color: "#2B2B2B",
    },
    socialsSection: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#2B2B2B",
        marginBottom: 16,
    },
    socialsList: {
        gap: 12,
    },
    socialItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: "white",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#D1D1D1",
    },
    socialName: {
        fontSize: 16,
        fontWeight: "500",
        color: "#2B2B2B",
        textTransform: "capitalize",
    },
    socialStatus: {
        fontSize: 14,
        fontWeight: "500",
    },
    connected: {
        color: "#28A745",
    },
    notConnected: {
        color: "#6C757D",
    },
    disconnectButton: {
        backgroundColor: "#DC3545",
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: "center",
    },
    disconnectButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "600",
    },
    footer: {
        alignItems: "center",
        paddingVertical: 16,
        borderTopWidth: 1,
        borderTopColor: "#D1D1D1",
    },
    footerText: {
        fontSize: 12,
        color: "#6C757D",
    },
});

export { CampModal };
