import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ScrollView,
} from 'react-native';
import {
  CampProvider,
  CampModal,
  useAuth,
  useAuthState,
  useOrigin,
} from '@campnetwork/origin/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';

const queryClient = new QueryClient();

// Simple Demo App
const SimpleCampDemo = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <CampProvider clientId="your-client-id-here">
        <SafeAreaView style={styles.container}>
          <DemoContent />
        </SafeAreaView>
      </CampProvider>
    </QueryClientProvider>
  );
};

const DemoContent = () => {
  const { authenticated, walletAddress } = useAuthState();
  const auth = useAuth();
  const { uploads, stats } = useOrigin();
  const [loading, setLoading] = useState(false);

  const handleMintPhoto = async () => {
    if (!authenticated) {
      Alert.alert('Please connect your wallet first');
      return;
    }

    try {
      setLoading(true);
      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        const metadata = {
          name: 'My Photo IP',
          description: 'A valuable photo turned into IP',
          tags: ['photo', 'demo'],
          creator: walletAddress,
        };

        const license = {
          price: BigInt(0), // Free for demo
          duration: 0n,
          royaltyBps: 250,
          paymentToken: "0x0000000000000000000000000000000000000000",
        };

        await auth.origin?.mintFile(result.assets[0], metadata, license);
        
        Alert.alert('Success!', 'Photo minted as IP NFT');
        uploads.refetch();
      }
    } catch (error) {
      console.error('Minting error:', error);
      Alert.alert('Error', 'Failed to mint photo');
    } finally {
      setLoading(false);
    }
  };

  const handleMintDocument = async () => {
    if (!authenticated) {
      Alert.alert('Please connect your wallet first');
      return;
    }

    try {
      setLoading(true);
      
      const result = await DocumentPicker.getDocumentAsync({
        type: ['*/*'],
        copyToCacheDirectory: true,
      });

      if (result.type === 'success') {
        const metadata = {
          name: 'My Document IP',
          description: 'Important document as IP',
          tags: ['document', 'demo'],
          creator: walletAddress,
        };

        const license = {
          price: BigInt(0),
          duration: 0n, 
          royaltyBps: 250,
          paymentToken: "0x0000000000000000000000000000000000000000",
        };

        await auth.origin?.mintFile(result, metadata, license);
        
        Alert.alert('Success!', 'Document minted as IP NFT');
        uploads.refetch();
      }
    } catch (error) {
      console.error('Minting error:', error);
      Alert.alert('Error', 'Failed to mint document');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Camp Network SDK Demo</Text>
        <CampModal />
      </View>

      {/* Authentication Status */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Authentication</Text>
        {authenticated ? (
          <View style={styles.authInfo}>
            <Text style={styles.statusText}>✅ Connected</Text>
            <Text style={styles.walletText}>
              {walletAddress?.slice(0, 6)}...{walletAddress?.slice(-4)}
            </Text>
          </View>
        ) : (
          <Text style={styles.statusText}>❌ Not connected</Text>
        )}
      </View>

      {/* Stats */}
      {authenticated && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Stats</Text>
          <Text>IPs Created: {uploads.data?.length || 0}</Text>
          <Text>Credits: {stats.data?.user?.points || 0}</Text>
          <Text>Status: {stats.data?.user?.active ? 'Active' : 'Inactive'}</Text>
        </View>
      )}

      {/* Minting Actions */}
      {authenticated && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Create IP</Text>
          
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleMintPhoto}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              📸 {loading ? 'Processing...' : 'Mint Photo as IP'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleMintDocument}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              📄 {loading ? 'Processing...' : 'Mint Document as IP'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Recent Uploads */}
      {authenticated && uploads.data && uploads.data.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent IPs</Text>
          {uploads.data.slice(0, 3).map((upload, index) => (
            <View key={index} style={styles.uploadItem}>
              <Text style={styles.uploadName}>{upload.name}</Text>
              <Text style={styles.uploadType}>{upload.type}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Instructions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>How to Use</Text>
        <Text style={styles.instruction}>
          1. Tap "Connect Wallet" to authenticate{'\n'}
          2. Choose a photo or document to mint{'\n'}
          3. Your file becomes a blockchain IP asset{'\n'}
          4. View your creations in the Recent IPs section
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F6F2',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6D01',
  },
  section: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2B2B2B',
    marginBottom: 12,
  },
  authInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 16,
    color: '#2B2B2B',
  },
  walletText: {
    fontSize: 14,
    color: '#2D5A66',
    fontFamily: 'monospace',
  },
  button: {
    backgroundColor: '#FF6D01',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonDisabled: {
    backgroundColor: '#D1D1D1',
    opacity: 0.6,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  uploadItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F9F6F2',
  },
  uploadName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2B2B2B',
  },
  uploadType: {
    fontSize: 14,
    color: '#2D5A66',
  },
  instruction: {
    fontSize: 14,
    color: '#2D5A66',
    lineHeight: 20,
  },
});

export default SimpleCampDemo;
