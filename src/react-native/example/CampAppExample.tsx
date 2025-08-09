import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { 
  CampProvider, 
  CampButton, 
  CampModal, 
  useCampAuth, 
  useModal 
} from '../index';

// Example component showing how to use the React Native SDK
const CampAppExample: React.FC = () => {
  return (
    <CampProvider 
      clientId="your-client-id"
      redirectUri={{
        twitter: "app://redirect/twitter",
        discord: "app://redirect/discord", 
        spotify: "app://redirect/spotify"
      }}
    >
      <CampAppContent />
    </CampProvider>
  );
};

const CampAppContent: React.FC = () => {
  const { authenticated, loading, walletAddress, connect, disconnect } = useCampAuth();
  const { isOpen, openModal, closeModal } = useModal();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Camp Network SDK - React Native</Text>
      
      <View style={styles.status}>
        <Text style={styles.statusText}>
          Status: {loading ? 'Loading...' : authenticated ? 'Connected' : 'Disconnected'}
        </Text>
        {walletAddress && (
          <Text style={styles.address}>
            Address: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
          </Text>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <CampButton 
          onPress={openModal}
          authenticated={authenticated}
          disabled={loading}
        >
          <Text style={styles.statusText}>
            {authenticated ? 'My Origin' : 'Connect'}
          </Text>
        </CampButton>
      </View>

      <CampModal 
        visible={isOpen}
        onClose={closeModal}
      />

      <View style={styles.info}>
        <Text style={styles.infoTitle}>Features:</Text>
        <Text style={styles.infoText}>• Wallet connection via AppKit</Text>
        <Text style={styles.infoText}>• Social account linking</Text>
        <Text style={styles.infoText}>• Origin stats and uploads</Text>
        <Text style={styles.infoText}>• Full React Native compatibility</Text>
      </View>
    </View>
  );
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

export default CampAppExample;
