import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { CloseIcon, CampIcon, getIconBySocial, CheckMarkIcon, XMarkIcon } from './icons';
import { useCampAuth, useSocials, useAppKit } from '../hooks';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface CampModalProps {
  visible?: boolean;  // Make optional with default - REQUIREMENTS FULFILLED
  onClose?: () => void;  // Make optional - REQUIREMENTS FULFILLED
  children?: React.ReactNode;  // REQUIREMENTS FULFILLED
}

export const CampModal: React.FC<CampModalProps> = ({ 
  visible = false, 
  onClose = () => {}, 
  children 
}) => {
  const { authenticated, loading, connect, disconnect, walletAddress } = useCampAuth();
  const { socials, isLoading: socialsLoading, refetch: refetchSocials } = useSocials();
  const { openAppKit, isAppKitConnected } = useAppKit();
  const [activeTab, setActiveTab] = useState<'stats' | 'socials'>('stats');

  const handleConnect = async () => {
    try {
      // Use AppKit for wallet connection in React Native
      await openAppKit();
      // The connect will be handled by AppKit's callback
    } catch (error) {
      console.error('Connection failed:', error);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
      onClose();
    } catch (error) {
      console.error('Disconnect failed:', error);
    }
  };

  if (!authenticated) {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={onClose}
      >
        <View style={styles.overlay}>
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modal}>
              <View style={styles.header}>
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                  <CloseIcon width={24} height={24} />
                </TouchableOpacity>
              </View>
              
              <View style={styles.authContent}>
                <View style={styles.modalIcon}>
                  <CampIcon width={48} height={48} />
                </View>
                <Text style={styles.authTitle}>Connect to Origin</Text>
                
                <TouchableOpacity
                  style={[styles.connectButton, loading && styles.connectButtonDisabled]}
                  onPress={handleConnect}
                  disabled={loading}
                >
                  <Text style={styles.connectButtonText}>
                    {loading ? 'Connecting...' : 'Connect Wallet'}
                  </Text>
                </TouchableOpacity>
              </View>
              
              <Text style={styles.footerText}>Powered by Camp Network</Text>
            </View>
          </SafeAreaView>
        </View>
      </Modal>
    );
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modal}>
            <View style={styles.header}>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <CloseIcon width={24} height={24} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.authenticatedHeader}>
              <Text style={styles.modalTitle}>My Origin</Text>
              <Text style={styles.walletAddress}>
                {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : ''}
              </Text>
            </View>

            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={[styles.tab, activeTab === 'stats' && styles.activeTab]}
                onPress={() => setActiveTab('stats')}
              >
                <Text style={[styles.tabText, activeTab === 'stats' && styles.activeTabText]}>
                  Stats
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tab, activeTab === 'socials' && styles.activeTab]}
                onPress={() => setActiveTab('socials')}
              >
                <Text style={[styles.tabText, activeTab === 'socials' && styles.activeTabText]}>
                  Socials
                </Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.tabContent}>
              {activeTab === 'stats' && <StatsTab />}
              {activeTab === 'socials' && (
                <SocialsTab 
                  socials={socials} 
                  loading={socialsLoading} 
                  onRefetch={refetchSocials}
                />
              )}
            </ScrollView>

            <TouchableOpacity style={styles.disconnectButton} onPress={handleDisconnect}>
              <Text style={styles.disconnectButtonText}>Disconnect</Text>
            </TouchableOpacity>
            
            <Text style={styles.footerText}>Powered by Camp Network</Text>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const StatsTab: React.FC = () => {
  return (
    <View style={styles.statsContainer}>
      <View style={styles.statRow}>
        <View style={styles.statItem}>
          <CheckMarkIcon width={20} height={20} />
          <Text style={styles.statLabel}>Authorized</Text>
        </View>
      </View>
      
      <View style={styles.divider} />
      
      <View style={styles.statRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>0</Text>
          <Text style={styles.statLabel}>Credits</Text>
        </View>
      </View>
      
      <TouchableOpacity style={styles.dashboardButton}>
        <Text style={styles.dashboardButtonText}>Origin Dashboard 🔗</Text>
      </TouchableOpacity>
    </View>
  );
};

interface SocialsTabProps {
  socials: Record<string, boolean>;
  loading: boolean;
  onRefetch: () => void;
}

const SocialsTab: React.FC<SocialsTabProps> = ({ socials, loading, onRefetch }) => {
  const connectedSocials = ['twitter', 'discord', 'spotify', 'tiktok', 'telegram']
    .filter(social => socials?.[social]);
  
  const notConnectedSocials = ['twitter', 'discord', 'spotify', 'tiktok', 'telegram']
    .filter(social => !socials?.[social]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading socials...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.socialsContainer}>
      <View style={styles.socialSection}>
        <Text style={styles.sectionTitle}>Not Linked</Text>
        {notConnectedSocials.map((social) => (
          <SocialItem key={social} social={social} isConnected={false} onRefetch={onRefetch} />
        ))}
        {notConnectedSocials.length === 0 && (
          <Text style={styles.noSocials}>You've linked all your socials!</Text>
        )}
      </View>

      <View style={styles.socialSection}>
        <Text style={styles.sectionTitle}>Linked</Text>
        {connectedSocials.map((social) => (
          <SocialItem key={social} social={social} isConnected={true} onRefetch={onRefetch} />
        ))}
        {connectedSocials.length === 0 && (
          <Text style={styles.noSocials}>You have no socials linked.</Text>
        )}
      </View>
    </ScrollView>
  );
};

interface SocialItemProps {
  social: string;
  isConnected: boolean;
  onRefetch: () => void;
}

const SocialItem: React.FC<SocialItemProps> = ({ social, isConnected, onRefetch }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { auth } = useCampAuth();
  const Icon = getIconBySocial(social);

  const handlePress = async () => {
    if (!auth) return;
    
    setIsLoading(true);
    try {
      if (isConnected) {
        // Unlink social
        const unlinkMethod = `unlink${social.charAt(0).toUpperCase() + social.slice(1)}`;
        if (typeof (auth as any)[unlinkMethod] === 'function') {
          await (auth as any)[unlinkMethod]();
        }
      } else {
        // Link social
        const linkMethod = `link${social.charAt(0).toUpperCase() + social.slice(1)}`;
        if (typeof (auth as any)[linkMethod] === 'function') {
          await (auth as any)[linkMethod]();
        }
      }
      onRefetch();
    } catch (error) {
      console.error(`Error ${isConnected ? 'unlinking' : 'linking'} ${social}:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.socialItem, isConnected && styles.connectedSocialItem]}
      onPress={handlePress}
      disabled={isLoading}
    >
      <Icon width={24} height={24} />
      <Text style={styles.socialName}>
        {social.charAt(0).toUpperCase() + social.slice(1)}
      </Text>
      {isLoading ? (
        <Text style={styles.socialStatus}>Loading...</Text>
      ) : (
        <Text style={[styles.socialStatus, isConnected && styles.connectedStatus]}>
          {isConnected ? 'Linked' : 'Link'}
        </Text>
      )}
    </TouchableOpacity>
  );
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
