import { _ as __awaiter } from '../tslib.es6.js';
import React, { useState } from 'react';
import { Dimensions, StyleSheet, Modal, View, SafeAreaView, TouchableOpacity, Text, ScrollView } from 'react-native';
import { CloseIcon, CampIcon, CheckMarkIcon, getIconBySocial } from './icons.js';
import { useCampAuth, useSocials, useAppKit } from '../hooks/index.js';
import '../context/CampContext.js';
import '../AuthRN.js';
import 'viem/siwe';
import 'viem';
import '../../errors';
import 'viem/accounts';
import '../storage.js';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const CampModal = ({ visible = false, onClose = () => { }, children }) => {
    const { authenticated, loading, connect, disconnect, walletAddress } = useCampAuth();
    const { socials, isLoading: socialsLoading, refetch: refetchSocials } = useSocials();
    const { openAppKit, isAppKitConnected } = useAppKit();
    const [activeTab, setActiveTab] = useState('stats');
    const handleConnect = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Use AppKit for wallet connection in React Native
            yield openAppKit();
            // The connect will be handled by AppKit's callback
        }
        catch (error) {
            console.error('Connection failed:', error);
        }
    });
    const handleDisconnect = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield disconnect();
            onClose();
        }
        catch (error) {
            console.error('Disconnect failed:', error);
        }
    });
    if (!authenticated) {
        return (React.createElement(Modal, { animationType: "slide", transparent: true, visible: visible, onRequestClose: onClose },
            React.createElement(View, { style: styles.overlay },
                React.createElement(SafeAreaView, { style: styles.modalContainer },
                    React.createElement(View, { style: styles.modal },
                        React.createElement(View, { style: styles.header },
                            React.createElement(TouchableOpacity, { style: styles.closeButton, onPress: onClose },
                                React.createElement(CloseIcon, { width: 24, height: 24 }))),
                        React.createElement(View, { style: styles.authContent },
                            React.createElement(View, { style: styles.modalIcon },
                                React.createElement(CampIcon, { width: 48, height: 48 })),
                            React.createElement(Text, { style: styles.authTitle }, "Connect to Origin"),
                            React.createElement(TouchableOpacity, { style: [styles.connectButton, loading && styles.connectButtonDisabled], onPress: handleConnect, disabled: loading },
                                React.createElement(Text, { style: styles.connectButtonText }, loading ? 'Connecting...' : 'Connect Wallet'))),
                        React.createElement(Text, { style: styles.footerText }, "Powered by Camp Network"))))));
    }
    return (React.createElement(Modal, { animationType: "slide", transparent: true, visible: visible, onRequestClose: onClose },
        React.createElement(View, { style: styles.overlay },
            React.createElement(SafeAreaView, { style: styles.modalContainer },
                React.createElement(View, { style: styles.modal },
                    React.createElement(View, { style: styles.header },
                        React.createElement(TouchableOpacity, { style: styles.closeButton, onPress: onClose },
                            React.createElement(CloseIcon, { width: 24, height: 24 }))),
                    React.createElement(View, { style: styles.authenticatedHeader },
                        React.createElement(Text, { style: styles.modalTitle }, "My Origin"),
                        React.createElement(Text, { style: styles.walletAddress }, walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : '')),
                    React.createElement(View, { style: styles.tabContainer },
                        React.createElement(TouchableOpacity, { style: [styles.tab, activeTab === 'stats' && styles.activeTab], onPress: () => setActiveTab('stats') },
                            React.createElement(Text, { style: [styles.tabText, activeTab === 'stats' && styles.activeTabText] }, "Stats")),
                        React.createElement(TouchableOpacity, { style: [styles.tab, activeTab === 'socials' && styles.activeTab], onPress: () => setActiveTab('socials') },
                            React.createElement(Text, { style: [styles.tabText, activeTab === 'socials' && styles.activeTabText] }, "Socials"))),
                    React.createElement(ScrollView, { style: styles.tabContent },
                        activeTab === 'stats' && React.createElement(StatsTab, null),
                        activeTab === 'socials' && (React.createElement(SocialsTab, { socials: socials, loading: socialsLoading, onRefetch: refetchSocials }))),
                    React.createElement(TouchableOpacity, { style: styles.disconnectButton, onPress: handleDisconnect },
                        React.createElement(Text, { style: styles.disconnectButtonText }, "Disconnect")),
                    React.createElement(Text, { style: styles.footerText }, "Powered by Camp Network"))))));
};
const StatsTab = () => {
    return (React.createElement(View, { style: styles.statsContainer },
        React.createElement(View, { style: styles.statRow },
            React.createElement(View, { style: styles.statItem },
                React.createElement(CheckMarkIcon, { width: 20, height: 20 }),
                React.createElement(Text, { style: styles.statLabel }, "Authorized"))),
        React.createElement(View, { style: styles.divider }),
        React.createElement(View, { style: styles.statRow },
            React.createElement(View, { style: styles.statItem },
                React.createElement(Text, { style: styles.statValue }, "0"),
                React.createElement(Text, { style: styles.statLabel }, "Credits"))),
        React.createElement(TouchableOpacity, { style: styles.dashboardButton },
            React.createElement(Text, { style: styles.dashboardButtonText }, "Origin Dashboard \uD83D\uDD17"))));
};
const SocialsTab = ({ socials, loading, onRefetch }) => {
    const connectedSocials = ['twitter', 'discord', 'spotify', 'tiktok', 'telegram']
        .filter(social => socials === null || socials === void 0 ? void 0 : socials[social]);
    const notConnectedSocials = ['twitter', 'discord', 'spotify', 'tiktok', 'telegram']
        .filter(social => !(socials === null || socials === void 0 ? void 0 : socials[social]));
    if (loading) {
        return (React.createElement(View, { style: styles.loadingContainer },
            React.createElement(Text, null, "Loading socials...")));
    }
    return (React.createElement(ScrollView, { style: styles.socialsContainer },
        React.createElement(View, { style: styles.socialSection },
            React.createElement(Text, { style: styles.sectionTitle }, "Not Linked"),
            notConnectedSocials.map((social) => (React.createElement(SocialItem, { key: social, social: social, isConnected: false, onRefetch: onRefetch }))),
            notConnectedSocials.length === 0 && (React.createElement(Text, { style: styles.noSocials }, "You've linked all your socials!"))),
        React.createElement(View, { style: styles.socialSection },
            React.createElement(Text, { style: styles.sectionTitle }, "Linked"),
            connectedSocials.map((social) => (React.createElement(SocialItem, { key: social, social: social, isConnected: true, onRefetch: onRefetch }))),
            connectedSocials.length === 0 && (React.createElement(Text, { style: styles.noSocials }, "You have no socials linked.")))));
};
const SocialItem = ({ social, isConnected, onRefetch }) => {
    const [isLoading, setIsLoading] = useState(false);
    const { auth } = useCampAuth();
    const Icon = getIconBySocial(social);
    const handlePress = () => __awaiter(void 0, void 0, void 0, function* () {
        if (!auth)
            return;
        setIsLoading(true);
        try {
            if (isConnected) {
                // Unlink social
                const unlinkMethod = `unlink${social.charAt(0).toUpperCase() + social.slice(1)}`;
                if (typeof auth[unlinkMethod] === 'function') {
                    yield auth[unlinkMethod]();
                }
            }
            else {
                // Link social
                const linkMethod = `link${social.charAt(0).toUpperCase() + social.slice(1)}`;
                if (typeof auth[linkMethod] === 'function') {
                    yield auth[linkMethod]();
                }
            }
            onRefetch();
        }
        catch (error) {
            console.error(`Error ${isConnected ? 'unlinking' : 'linking'} ${social}:`, error);
        }
        finally {
            setIsLoading(false);
        }
    });
    return (React.createElement(TouchableOpacity, { style: [styles.socialItem, isConnected && styles.connectedSocialItem], onPress: handlePress, disabled: isLoading },
        React.createElement(Icon, { width: 24, height: 24 }),
        React.createElement(Text, { style: styles.socialName }, social.charAt(0).toUpperCase() + social.slice(1)),
        isLoading ? (React.createElement(Text, { style: styles.socialStatus }, "Loading...")) : (React.createElement(Text, { style: [styles.socialStatus, isConnected && styles.connectedStatus] }, isConnected ? 'Linked' : 'Link'))));
};
const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    modal: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 20,
        maxHeight: screenHeight * 0.8,
        width: Math.min(400, screenWidth - 40),
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginBottom: 10,
    },
    closeButton: {
        padding: 5,
    },
    authContent: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    modalIcon: {
        marginBottom: 16,
    },
    authTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 24,
        textAlign: 'center',
    },
    connectButton: {
        backgroundColor: '#ff6d01',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
        minWidth: 200,
    },
    connectButtonDisabled: {
        backgroundColor: '#cccccc',
        opacity: 0.6,
    },
    connectButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
    authenticatedHeader: {
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    walletAddress: {
        fontSize: 14,
        color: '#666',
        fontFamily: 'monospace',
    },
    tabContainer: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        marginBottom: 20,
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: '#ff6d01',
    },
    tabText: {
        fontSize: 16,
        color: '#666',
    },
    activeTabText: {
        color: '#ff6d01',
        fontWeight: '600',
    },
    tabContent: {
        flex: 1,
        marginBottom: 20,
    },
    statsContainer: {
        alignItems: 'center',
    },
    statRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statValue: {
        fontSize: 18,
        fontWeight: 'bold',
        marginRight: 8,
    },
    statLabel: {
        fontSize: 14,
        color: '#666',
        marginLeft: 8,
    },
    divider: {
        height: 1,
        backgroundColor: '#e0e0e0',
        width: '100%',
        marginVertical: 10,
    },
    dashboardButton: {
        backgroundColor: '#f0f0f0',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 6,
        marginTop: 20,
    },
    dashboardButtonText: {
        color: '#333',
        fontSize: 14,
    },
    loadingContainer: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    socialsContainer: {
        flex: 1,
    },
    socialSection: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#333',
    },
    noSocials: {
        textAlign: 'center',
        color: '#666',
        fontStyle: 'italic',
        paddingVertical: 20,
    },
    socialItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: '#f8f8f8',
        borderRadius: 8,
        marginBottom: 8,
    },
    connectedSocialItem: {
        backgroundColor: '#e8f5e8',
    },
    socialName: {
        flex: 1,
        fontSize: 16,
        marginLeft: 12,
        color: '#333',
    },
    socialStatus: {
        fontSize: 14,
        color: '#ff6d01',
        fontWeight: '600',
    },
    connectedStatus: {
        color: '#22c55e',
    },
    disconnectButton: {
        backgroundColor: '#dc3545',
        paddingVertical: 12,
        borderRadius: 8,
        marginBottom: 12,
    },
    disconnectButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
    footerText: {
        textAlign: 'center',
        fontSize: 12,
        color: '#666',
        marginTop: 8,
    },
});

export { CampModal };
