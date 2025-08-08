import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from "react-native";
import { useAuthState, useConnect, useProvider, useSocials } from "./hooks";
import { ModalContext } from "../context/ModalContext";
import { CampContext } from "../context/CampContext";
import { CampButton, LoadingSpinner } from "./buttons";

interface CampModalProps {
  projectId?: string;
  onWalletConnect?: (provider: any) => void;
}

const CampModal = ({ projectId, onWalletConnect }: CampModalProps) => {
  const { authenticated, loading } = useAuthState();
  const { isVisible, setIsVisible } = useContext(ModalContext);
  const { connect, disconnect } = useConnect();
  const { auth } = useContext(CampContext);

  const handleConnect = async () => {
    try {
      await connect();
    } catch (error) {
      Alert.alert("Connection Error", "Failed to connect wallet");
    }
  };

  const handleModalButton = () => {
    setIsVisible(true);
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
      setIsVisible(false);
    } catch (error) {
      Alert.alert("Disconnect Error", "Failed to disconnect");
    }
  };

  const formatAddress = (address: string, chars = 4) => {
    if (!address) return "";
    return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
  };

  return (
    <View>
      <CampButton
        onPress={handleModalButton}
        authenticated={authenticated}
        disabled={loading}
      />
      
      <Modal
        visible={isVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setIsVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>
              {authenticated ? "My Origin" : "Connect to Origin"}
            </Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsVisible(false)}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            {loading && (
              <View style={styles.loadingContainer}>
                <LoadingSpinner />
                <Text style={styles.loadingText}>Connecting...</Text>
              </View>
            )}

            {!authenticated && !loading && (
              <AuthSection onConnect={handleConnect} />
            )}

            {authenticated && !loading && (
              <AuthenticatedSection
                walletAddress={auth?.walletAddress || undefined}
                onDisconnect={handleDisconnect}
              />
            )}
          </ScrollView>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Powered by Camp Network</Text>
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
};

const AuthSection = ({ onConnect }: { onConnect: () => void }) => (
  <View style={styles.authSection}>
    <View style={styles.logoContainer}>
      <Text style={styles.logo}>🏕️</Text>
    </View>
    <Text style={styles.description}>
      Connect your wallet to access Camp Network features
    </Text>
    <TouchableOpacity style={styles.connectButton} onPress={onConnect}>
      <Text style={styles.connectButtonText}>Connect Wallet</Text>
    </TouchableOpacity>
  </View>
);

const AuthenticatedSection = ({ 
  walletAddress, 
  onDisconnect 
}: { 
  walletAddress?: string; 
  onDisconnect: () => void;
}) => {
  const { socials, isLoading } = useSocials();
  
  const formatAddress = (address: string, chars = 6) => {
    if (!address) return "";
    return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
  };

  return (
    <View style={styles.authenticatedSection}>
      <View style={styles.profileSection}>
        <Text style={styles.walletAddress}>
          {formatAddress(walletAddress || "", 6)}
        </Text>
      </View>

      <View style={styles.socialsSection}>
        <Text style={styles.sectionTitle}>Connected Socials</Text>
        {isLoading ? (
          <LoadingSpinner size="small" />
        ) : (
          <View style={styles.socialsList}>
            {Object.entries(socials || {}).map(([platform, connected]) => (
              <View key={platform} style={styles.socialItem}>
                <Text style={styles.socialName}>{platform}</Text>
                <Text style={[
                  styles.socialStatus,
                  connected ? styles.connected : styles.notConnected
                ]}>
                  {connected ? "Connected" : "Not Connected"}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>

      <TouchableOpacity style={styles.disconnectButton} onPress={onDisconnect}>
        <Text style={styles.disconnectButtonText}>Disconnect</Text>
      </TouchableOpacity>
    </View>
  );
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
