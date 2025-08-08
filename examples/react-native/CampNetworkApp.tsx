import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
  Image,
  Alert,
  Modal,
  FlatList,
} from 'react-native';
import {
  CampProvider,
  CampModal,
  useAuth,
  useAuthState,
  useOrigin,
  useSocials,
} from '@campnetwork/origin/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';

const queryClient = new QueryClient();

// Camp Network Brand Colors
const colors = {
  campOrange: '#FF6D01',
  warm1: '#FF9160', 
  cool1: '#2D5A66',
  warm2: '#FFB400',
  warm3: '#FFC75F',
  cool2: '#6CA9B0',
  cool3: '#A2D5D1',
  light: '#F9F6F2',
  gray: '#D1D1D1',
  dark: '#2B2B2B',
  black: '#000000',
};

// Main App Component
const CampNetworkApp = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <CampProvider clientId={process.env.EXPO_PUBLIC_CAMP_CLIENT_ID || "your-client-id"}>
        <SafeAreaView style={styles.container}>
          <AppContent />
        </SafeAreaView>
      </CampProvider>
    </QueryClientProvider>
  );
};

const AppContent = () => {
  const { authenticated } = useAuthState();
  const [currentTab, setCurrentTab] = useState('marketplace');

  const tabs = [
    { id: 'create', title: 'Create IP', icon: '📝' },
    { id: 'marketplace', title: 'Marketplace', icon: '🏪' },
    { id: 'chat', title: 'Negotiate', icon: '💬' },
    { id: 'auction', title: 'Auctions', icon: '🔨' },
    { id: 'profile', title: 'Profile', icon: '👤' },
  ];

  const renderTabContent = () => {
    switch (currentTab) {
      case 'create':
        return <CreateIPScreen />;
      case 'marketplace':
        return <MarketplaceScreen />;
      case 'chat':
        return <ChatScreen />;
      case 'auction':
        return <AuctionScreen />;
      case 'profile':
        return <ProfileScreen />;
      default:
        return <MarketplaceScreen />;
    }
  };

  return (
    <View style={styles.appContainer}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Camp Network</Text>
        <CampModal />
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {authenticated ? renderTabContent() : <WelcomeScreen />}
      </View>

      {/* Bottom Navigation */}
      {authenticated && (
        <View style={styles.bottomNav}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tabButton,
                currentTab === tab.id && styles.activeTab
              ]}
              onPress={() => setCurrentTab(tab.id)}
            >
              <Text style={styles.tabIcon}>{tab.icon}</Text>
              <Text style={[
                styles.tabText,
                currentTab === tab.id && styles.activeTabText
              ]}>
                {tab.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

// Welcome Screen for unauthenticated users
const WelcomeScreen = () => (
  <View style={styles.welcomeContainer}>
    <Text style={styles.welcomeTitle}>Welcome to Camp Network</Text>
    <Text style={styles.welcomeSubtitle}>
      Create, trade, and auction intellectual property on the blockchain
    </Text>
    <Text style={styles.welcomeDescription}>
      • Create IP from photos, documents, or any content{'\n'}
      • List in marketplace for others to discover{'\n'} 
      • Negotiate prices through secure chat{'\n'}
      • Participate in auctions and lotteries{'\n'}
      • Transfer ownership with escrow protection
    </Text>
    <View style={styles.connectPrompt}>
      <Text style={styles.connectText}>Connect your wallet to get started</Text>
    </View>
  </View>
);

// Create IP Screen
const CreateIPScreen = () => {
  const auth = useAuth();
  const { uploads, stats } = useOrigin();
  const [creating, setCreating] = useState(false);
  const [ipData, setIpData] = useState({
    name: '',
    description: '',
    tags: '',
    price: '',
  });

  const handleCreateFromPhoto = async () => {
    try {
      setCreating(true);
      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        await mintIP(result.assets[0], 'image');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to create IP from photo');
    } finally {
      setCreating(false);
    }
  };

  const handleCreateFromDocument = async () => {
    try {
      setCreating(true);
      
      const result = await DocumentPicker.getDocumentAsync({
        type: ['*/*'],
        copyToCacheDirectory: true,
      });

      if (result.type === 'success') {
        await mintIP(result, 'document');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to create IP from document');
    } finally {
      setCreating(false);
    }
  };

  const mintIP = async (file: any, type: string) => {
    if (!ipData.name || !ipData.description) {
      Alert.alert('Error', 'Please fill in name and description');
      return;
    }

    try {
      const metadata = {
        name: ipData.name,
        description: ipData.description,
        tags: ipData.tags.split(',').map(tag => tag.trim()),
        creator: auth.walletAddress,
        type,
        price: parseFloat(ipData.price) || 0,
      };

      const license = {
        price: BigInt(Math.floor((parseFloat(ipData.price) || 0) * 1e18)),
        duration: 0n,
        royaltyBps: 250, // 2.5% royalty
        paymentToken: "0x0000000000000000000000000000000000000000",
      };

      await auth.origin?.mintFile(file, metadata, license);
      
      Alert.alert(
        'Success!', 
        'Your IP has been created and minted as an NFT',
        [{ text: 'OK', onPress: () => {
          setIpData({ name: '', description: '', tags: '', price: '' });
          uploads.refetch();
        }}]
      );
    } catch (error) {
      console.error('Minting error:', error);
      Alert.alert('Error', 'Failed to mint IP');
    }
  };

  return (
    <ScrollView style={styles.screenContainer}>
      <Text style={styles.screenTitle}>Create Intellectual Property</Text>
      
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="IP Name"
          value={ipData.name}
          onChangeText={(text) => setIpData({ ...ipData, name: text })}
        />
        
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Description"
          value={ipData.description}
          onChangeText={(text) => setIpData({ ...ipData, description: text })}
          multiline
          numberOfLines={4}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Tags (comma separated)"
          value={ipData.tags}
          onChangeText={(text) => setIpData({ ...ipData, tags: text })}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Initial Price (ETH)"
          value={ipData.price}
          onChangeText={(text) => setIpData({ ...ipData, price: text })}
          keyboardType="decimal-pad"
        />
      </View>

      <View style={styles.createOptions}>
        <TouchableOpacity
          style={[styles.createButton, creating && styles.buttonDisabled]}
          onPress={handleCreateFromPhoto}
          disabled={creating}
        >
          <Text style={styles.createButtonText}>
            📸 {creating ? 'Creating...' : 'Create from Photo'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.createButton, creating && styles.buttonDisabled]}
          onPress={handleCreateFromDocument}
          disabled={creating}
        >
          <Text style={styles.createButtonText}>
            📄 {creating ? 'Creating...' : 'Create from Document'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Recent Creations */}
      <View style={styles.recentSection}>
        <Text style={styles.sectionTitle}>Your Recent Creations</Text>
        {uploads.isLoading ? (
          <Text>Loading...</Text>
        ) : uploads.data && uploads.data.length > 0 ? (
          uploads.data.slice(0, 3).map((upload, index) => (
            <View key={index} style={styles.uploadItem}>
              <Text style={styles.uploadName}>{upload.name}</Text>
              <Text style={styles.uploadType}>{upload.type}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.emptyState}>No creations yet. Create your first IP!</Text>
        )}
      </View>
    </ScrollView>
  );
};

// Marketplace Screen
const MarketplaceScreen = () => {
  const [listings, setListings] = useState([
    {
      id: 1,
      name: "Digital Art Concept",
      description: "Unique digital artwork concept for NFT collection",
      creator: "0x123...abc",
      price: "0.5 ETH",
      tags: ["art", "digital", "nft"],
      image: "https://via.placeholder.com/150",
    },
    {
      id: 2,
      name: "Music Composition",
      description: "Original music composition with rights",
      creator: "0x456...def",
      price: "1.2 ETH", 
      tags: ["music", "composition"],
      image: "https://via.placeholder.com/150",
    },
  ]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredListings = listings.filter(listing =>
    listing.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    listing.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleBuyNow = (listing: any) => {
    Alert.alert(
      'Purchase IP',
      `Do you want to buy "${listing.name}" for ${listing.price}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Negotiate', onPress: () => startNegotiation(listing) },
        { text: 'Buy Now', onPress: () => purchaseIP(listing) },
      ]
    );
  };

  const startNegotiation = (listing: any) => {
    Alert.alert('Negotiation Started', 'Opening chat to negotiate price...');
  };

  const purchaseIP = (listing: any) => {
    Alert.alert('Purchase Successful', 'IP ownership transferred with escrow protection!');
  };

  return (
    <View style={styles.screenContainer}>
      <Text style={styles.screenTitle}>IP Marketplace</Text>
      
      <TextInput
        style={styles.searchInput}
        placeholder="Search IP by name or tags..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <FlatList
        data={filteredListings}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.listingCard}>
            <View style={styles.listingHeader}>
              <Text style={styles.listingName}>{item.name}</Text>
              <Text style={styles.listingPrice}>{item.price}</Text>
            </View>
            <Text style={styles.listingDescription}>{item.description}</Text>
            <Text style={styles.listingCreator}>Creator: {item.creator}</Text>
            <View style={styles.tagsContainer}>
              {item.tags.map(tag => (
                <Text key={tag} style={styles.tag}>{tag}</Text>
              ))}
            </View>
            <View style={styles.listingActions}>
              <TouchableOpacity
                style={styles.negotiateButton}
                onPress={() => startNegotiation(item)}
              >
                <Text style={styles.negotiateButtonText}>Negotiate</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.buyButton}
                onPress={() => handleBuyNow(item)}
              >
                <Text style={styles.buyButtonText}>Buy Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

// Chat/Negotiation Screen
const ChatScreen = () => {
  const [conversations, setConversations] = useState([
    {
      id: 1,
      ipName: "Digital Art Concept",
      otherUser: "0x123...abc",
      lastMessage: "I can offer 0.4 ETH for this piece",
      timestamp: "2 min ago",
      status: "negotiating",
    },
    {
      id: 2,
      ipName: "Music Composition",
      otherUser: "0x789...ghi", 
      lastMessage: "Deal agreed at 1.0 ETH",
      timestamp: "1 hour ago",
      status: "agreed",
    },
  ]);

  const openChat = (conversation: any) => {
    Alert.alert(
      'Chat',
      `Opening chat for "${conversation.ipName}" with ${conversation.otherUser}`
    );
  };

  return (
    <View style={styles.screenContainer}>
      <Text style={styles.screenTitle}>Negotiations</Text>
      
      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.conversationCard} onPress={() => openChat(item)}>
            <View style={styles.conversationHeader}>
              <Text style={styles.conversationIP}>{item.ipName}</Text>
              <Text style={styles.conversationTime}>{item.timestamp}</Text>
            </View>
            <Text style={styles.conversationUser}>with {item.otherUser}</Text>
            <Text style={styles.lastMessage}>{item.lastMessage}</Text>
            <Text style={[
              styles.conversationStatus,
              item.status === 'agreed' ? styles.agreedStatus : styles.negotiatingStatus
            ]}>
              {item.status === 'agreed' ? '✅ Agreed' : '💬 Negotiating'}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

// Auction Screen
const AuctionScreen = () => {
  const [activeAuctions, setActiveAuctions] = useState([
    {
      id: 1,
      name: "Rare Patent Concept",
      currentBid: "2.1 ETH",
      timeLeft: "2h 35m",
      bidders: 5,
      type: "auction",
    },
    {
      id: 2,
      name: "Music Rights Bundle", 
      ticketPrice: "0.1 ETH",
      totalTickets: 100,
      soldTickets: 67,
      timeLeft: "1d 4h",
      type: "lottery",
    },
  ]);

  const placeBid = (auction: any) => {
    Alert.alert(
      'Place Bid',
      `Current highest bid: ${auction.currentBid}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Bid Higher', onPress: () => Alert.alert('Bid Placed!') },
      ]
    );
  };

  const buyTicket = (lottery: any) => {
    Alert.alert(
      'Buy Lottery Ticket',
      `Buy ticket for ${lottery.ticketPrice}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Buy Ticket', onPress: () => Alert.alert('Ticket Purchased!') },
      ]
    );
  };

  return (
    <View style={styles.screenContainer}>
      <Text style={styles.screenTitle}>Auctions & Lotteries</Text>
      
      <FlatList
        data={activeAuctions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.auctionCard}>
            <View style={styles.auctionHeader}>
              <Text style={styles.auctionName}>{item.name}</Text>
              <Text style={styles.auctionType}>
                {item.type === 'auction' ? '🔨' : '🎲'} {item.type.toUpperCase()}
              </Text>
            </View>
            
            {item.type === 'auction' ? (
              <>
                <Text style={styles.currentBid}>Current Bid: {item.currentBid}</Text>
                <Text style={styles.bidders}>{item.bidders} bidders</Text>
                <Text style={styles.timeLeft}>⏰ {item.timeLeft} left</Text>
                <TouchableOpacity style={styles.bidButton} onPress={() => placeBid(item)}>
                  <Text style={styles.bidButtonText}>Place Bid</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.ticketPrice}>Ticket Price: {item.ticketPrice}</Text>
                <Text style={styles.ticketsSold}>
                  {item.soldTickets}/{item.totalTickets} tickets sold
                </Text>
                <Text style={styles.timeLeft}>⏰ {item.timeLeft} left</Text>
                <TouchableOpacity style={styles.ticketButton} onPress={() => buyTicket(item)}>
                  <Text style={styles.ticketButtonText}>Buy Ticket</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        )}
      />
    </View>
  );
};

// Profile Screen
const ProfileScreen = () => {
  const auth = useAuth();
  const { stats, uploads } = useOrigin();
  const { socials } = useSocials();
  const [showSocials, setShowSocials] = useState(false);

  const formatAddress = (address: string) => {
    return address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '';
  };

  return (
    <ScrollView style={styles.screenContainer}>
      <Text style={styles.screenTitle}>My Profile</Text>
      
      <View style={styles.profileCard}>
        <Text style={styles.walletAddress}>
          {formatAddress(auth.walletAddress || '')}
        </Text>
        
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{uploads.data?.length || 0}</Text>
            <Text style={styles.statLabel}>IPs Created</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.data?.user?.points || 0}</Text>
            <Text style={styles.statLabel}>Credits</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {stats.data?.user?.active ? 'Active' : 'Inactive'}
            </Text>
            <Text style={styles.statLabel}>Status</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={styles.socialsButton}
        onPress={() => setShowSocials(true)}
      >
        <Text style={styles.socialsButtonText}>🔗 Manage Social Connections</Text>
      </TouchableOpacity>

      <View style={styles.recentActivitySection}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        {uploads.data && uploads.data.length > 0 ? (
          uploads.data.slice(0, 5).map((upload, index) => (
            <View key={index} style={styles.activityItem}>
              <Text style={styles.activityName}>{upload.name}</Text>
              <Text style={styles.activityType}>{upload.type}</Text>
              <Text style={styles.activityDate}>Created recently</Text>
            </View>
          ))
        ) : (
          <Text style={styles.emptyState}>No activity yet</Text>
        )}
      </View>

      <Modal visible={showSocials} animationType="slide">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Social Connections</Text>
            <TouchableOpacity onPress={() => setShowSocials(false)}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.socialsList}>
            {Object.entries(socials || {}).map(([platform, connected]: [string, any]) => (
              <View key={platform} style={styles.socialItem}>
                <Text style={styles.socialPlatform}>{platform}</Text>
                <Text style={[
                  styles.socialStatus,
                  connected ? styles.connected : styles.notConnected
                ]}>
                  {connected ? 'Connected' : 'Not Connected'}
                </Text>
              </View>
            ))}
          </View>
        </SafeAreaView>
      </Modal>
    </ScrollView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
  },
  appContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: colors.gray,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.campOrange,
  },
  content: {
    flex: 1,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: colors.gray,
    paddingBottom: 20,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  activeTab: {
    backgroundColor: colors.light,
  },
  tabIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  tabText: {
    fontSize: 10,
    color: colors.dark,
  },
  activeTabText: {
    color: colors.campOrange,
    fontWeight: '600',
  },
  screenContainer: {
    flex: 1,
    padding: 20,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: 20,
    textAlign: 'center',
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.campOrange,
    marginBottom: 10,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 18,
    color: colors.cool1,
    marginBottom: 20,
    textAlign: 'center',
  },
  welcomeDescription: {
    fontSize: 16,
    color: colors.dark,
    lineHeight: 24,
    marginBottom: 30,
  },
  connectPrompt: {
    backgroundColor: colors.campOrange,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  connectText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  formContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 12,
    backgroundColor: 'white',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  createOptions: {
    gap: 12,
    marginBottom: 20,
  },
  createButton: {
    backgroundColor: colors.campOrange,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: colors.gray,
    opacity: 0.6,
  },
  createButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  recentSection: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: 12,
  },
  uploadItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.light,
  },
  uploadName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark,
  },
  uploadType: {
    fontSize: 14,
    color: colors.cool1,
  },
  emptyState: {
    fontSize: 16,
    color: colors.cool1,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  searchInput: {
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.gray,
  },
  listingCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.gray,
  },
  listingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  listingName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.dark,
    flex: 1,
  },
  listingPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.campOrange,
  },
  listingDescription: {
    fontSize: 14,
    color: colors.cool1,
    marginBottom: 8,
  },
  listingCreator: {
    fontSize: 12,
    color: colors.dark,
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  tag: {
    backgroundColor: colors.light,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 12,
    color: colors.cool1,
    marginRight: 8,
    marginBottom: 4,
  },
  listingActions: {
    flexDirection: 'row',
    gap: 12,
  },
  negotiateButton: {
    flex: 1,
    backgroundColor: colors.cool1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  negotiateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  buyButton: {
    flex: 1,
    backgroundColor: colors.campOrange,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  conversationCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.gray,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  conversationIP: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.dark,
  },
  conversationTime: {
    fontSize: 12,
    color: colors.cool1,
  },
  conversationUser: {
    fontSize: 14,
    color: colors.cool1,
    marginBottom: 8,
  },
  lastMessage: {
    fontSize: 14,
    color: colors.dark,
    marginBottom: 8,
  },
  conversationStatus: {
    fontSize: 12,
    fontWeight: '600',
  },
  agreedStatus: {
    color: '#28A745',
  },
  negotiatingStatus: {
    color: colors.campOrange,
  },
  auctionCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.gray,
  },
  auctionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  auctionName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.dark,
    flex: 1,
  },
  auctionType: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.campOrange,
  },
  currentBid: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.campOrange,
    marginBottom: 4,
  },
  bidders: {
    fontSize: 14,
    color: colors.cool1,
    marginBottom: 8,
  },
  timeLeft: {
    fontSize: 14,
    color: colors.dark,
    marginBottom: 12,
  },
  bidButton: {
    backgroundColor: colors.campOrange,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  bidButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  ticketPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.warm2,
    marginBottom: 4,
  },
  ticketsSold: {
    fontSize: 14,
    color: colors.cool1,
    marginBottom: 8,
  },
  ticketButton: {
    backgroundColor: colors.warm2,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  ticketButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  profileCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
  },
  walletAddress: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.campOrange,
  },
  statLabel: {
    fontSize: 12,
    color: colors.cool1,
    marginTop: 4,
  },
  socialsButton: {
    backgroundColor: colors.cool1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  socialsButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  recentActivitySection: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
  },
  activityItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.light,
  },
  activityName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark,
  },
  activityType: {
    fontSize: 14,
    color: colors.cool1,
  },
  activityDate: {
    fontSize: 12,
    color: colors.cool1,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.light,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: colors.gray,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.dark,
  },
  closeButton: {
    fontSize: 24,
    color: colors.dark,
  },
  socialsList: {
    padding: 20,
  },
  socialItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 12,
  },
  socialPlatform: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark,
    textTransform: 'capitalize',
  },
  socialStatus: {
    fontSize: 14,
    fontWeight: '500',
  },
  connected: {
    color: '#28A745',
  },
  notConnected: {
    color: colors.cool1,
  },
});

export default CampNetworkApp;
