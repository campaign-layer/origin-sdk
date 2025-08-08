'use strict';

var tslib_es6 = require('../node_modules/tslib/tslib.es6.js');
var React = require('react');
var reactNative = require('react-native');
var hooks = require('./hooks.js');
var ModalContext = require('../context/ModalContext.js');
var CampContext = require('../context/CampContext.js');
var buttons = require('./buttons.js');

const CampModal = ({ projectId, onWalletConnect }) => {
    const { authenticated, loading } = hooks.useAuthState();
    const { isVisible, setIsVisible } = React.useContext(ModalContext.ModalContext);
    const { connect, disconnect } = hooks.useConnect();
    const { auth } = React.useContext(CampContext.CampContext);
    const handleConnect = () => tslib_es6.__awaiter(void 0, void 0, void 0, function* () {
        try {
            yield connect();
        }
        catch (error) {
            reactNative.Alert.alert("Connection Error", "Failed to connect wallet");
        }
    });
    const handleModalButton = () => {
        setIsVisible(true);
    };
    const handleDisconnect = () => tslib_es6.__awaiter(void 0, void 0, void 0, function* () {
        try {
            yield disconnect();
            setIsVisible(false);
        }
        catch (error) {
            reactNative.Alert.alert("Disconnect Error", "Failed to disconnect");
        }
    });
    return (React.createElement(reactNative.View, null,
        React.createElement(buttons.CampButton, { onPress: handleModalButton, authenticated: authenticated, disabled: loading }),
        React.createElement(reactNative.Modal, { visible: isVisible, animationType: "slide", presentationStyle: "pageSheet", onRequestClose: () => setIsVisible(false) },
            React.createElement(reactNative.SafeAreaView, { style: styles.modalContainer },
                React.createElement(reactNative.View, { style: styles.header },
                    React.createElement(reactNative.Text, { style: styles.title }, authenticated ? "My Origin" : "Connect to Origin"),
                    React.createElement(reactNative.TouchableOpacity, { style: styles.closeButton, onPress: () => setIsVisible(false) },
                        React.createElement(reactNative.Text, { style: styles.closeButtonText }, "\u2715"))),
                React.createElement(reactNative.ScrollView, { style: styles.content },
                    loading && (React.createElement(reactNative.View, { style: styles.loadingContainer },
                        React.createElement(buttons.LoadingSpinner, null),
                        React.createElement(reactNative.Text, { style: styles.loadingText }, "Connecting..."))),
                    !authenticated && !loading && (React.createElement(AuthSection, { onConnect: handleConnect })),
                    authenticated && !loading && (React.createElement(AuthenticatedSection, { walletAddress: (auth === null || auth === void 0 ? void 0 : auth.walletAddress) || undefined, onDisconnect: handleDisconnect }))),
                React.createElement(reactNative.View, { style: styles.footer },
                    React.createElement(reactNative.Text, { style: styles.footerText }, "Powered by Camp Network"))))));
};
const AuthSection = ({ onConnect }) => (React.createElement(reactNative.View, { style: styles.authSection },
    React.createElement(reactNative.View, { style: styles.logoContainer },
        React.createElement(reactNative.Text, { style: styles.logo }, "\uD83C\uDFD5\uFE0F")),
    React.createElement(reactNative.Text, { style: styles.description }, "Connect your wallet to access Camp Network features"),
    React.createElement(reactNative.TouchableOpacity, { style: styles.connectButton, onPress: onConnect },
        React.createElement(reactNative.Text, { style: styles.connectButtonText }, "Connect Wallet"))));
const AuthenticatedSection = ({ walletAddress, onDisconnect }) => {
    const { socials, isLoading } = hooks.useSocials();
    const formatAddress = (address, chars = 6) => {
        if (!address)
            return "";
        return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
    };
    return (React.createElement(reactNative.View, { style: styles.authenticatedSection },
        React.createElement(reactNative.View, { style: styles.profileSection },
            React.createElement(reactNative.Text, { style: styles.walletAddress }, formatAddress(walletAddress || "", 6))),
        React.createElement(reactNative.View, { style: styles.socialsSection },
            React.createElement(reactNative.Text, { style: styles.sectionTitle }, "Connected Socials"),
            isLoading ? (React.createElement(buttons.LoadingSpinner, { size: "small" })) : (React.createElement(reactNative.View, { style: styles.socialsList }, Object.entries(socials || {}).map(([platform, connected]) => (React.createElement(reactNative.View, { key: platform, style: styles.socialItem },
                React.createElement(reactNative.Text, { style: styles.socialName }, platform),
                React.createElement(reactNative.Text, { style: [
                        styles.socialStatus,
                        connected ? styles.connected : styles.notConnected
                    ] }, connected ? "Connected" : "Not Connected"))))))),
        React.createElement(reactNative.TouchableOpacity, { style: styles.disconnectButton, onPress: onDisconnect },
            React.createElement(reactNative.Text, { style: styles.disconnectButtonText }, "Disconnect"))));
};
const styles = reactNative.StyleSheet.create({
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

exports.CampModal = CampModal;
