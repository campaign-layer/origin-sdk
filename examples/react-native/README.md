# Camp Network React Native Example

This is a comprehensive React Native/Expo example app showcasing the Camp Network Origin SDK in a mobile environment.

## Features

### 🔐 Web3 Authentication
- Wallet connection via Reown AppKit
- Sign-In with Ethereum (SIWE)
- Secure session management

### 📱 IP Marketplace
- **Create IP**: Transform photos and documents into blockchain assets
- **Browse Marketplace**: Discover and search intellectual property
- **Price Negotiation**: Chat-based price discussions with other users
- **Auctions & Lotteries**: Participate in timed bidding and lottery systems
- **Secure Transfers**: Escrow-protected ownership changes

### 🛠️ App Functionality
- Native mobile UI with Camp Network branding
- Real-time chat for negotiations
- File picker integration for IP creation
- Social media account linking
- User profile and activity tracking

## Getting Started

### Prerequisites

- Node.js 18 or later
- Expo CLI: `npm install -g @expo/cli`
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Installation

1. Clone the repository and navigate to the example:
```bash
cd examples/react-native
```

2. Install dependencies:
```bash
npm install
```

3. Configure your Camp Network credentials:
```bash
# Copy environment template
cp .env.example .env

# Edit .env with your credentials
EXPO_PUBLIC_CAMP_CLIENT_ID=your_client_id_here
```

4. Start the development server:
```bash
npm start
```

5. Run on your preferred platform:
```bash
# iOS Simulator
npm run ios

# Android Emulator
npm run android

# Web Browser
npm run web
```

## Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
EXPO_PUBLIC_CAMP_CLIENT_ID=your_camp_client_id
EXPO_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
```

### App Configuration

Update `app.json` with your app details:

```json
{
  "expo": {
    "name": "Your App Name",
    "slug": "your-app-slug",
    "ios": {
      "bundleIdentifier": "com.yourcompany.yourapp"
    },
    "android": {
      "package": "com.yourcompany.yourapp"
    }
  }
}
```

## App Architecture

### Main Components

- **CampNetworkApp**: Root component with providers
- **CreateIPScreen**: Interface for minting new IP from files
- **MarketplaceScreen**: Browse and search available IP
- **ChatScreen**: Negotiate prices with other users
- **AuctionScreen**: Participate in auctions and lotteries
- **ProfileScreen**: Manage account and view activity

### Key Features

#### IP Creation Flow
1. User selects photo or document
2. Fills metadata (name, description, tags, price)
3. File is uploaded and minted as NFT
4. IP becomes available in marketplace

#### Marketplace Interaction
1. Browse available IP with search/filtering
2. View detailed information and pricing
3. Choose to buy immediately or negotiate
4. Complete purchase with escrow protection

#### Negotiation System
1. Start chat conversation from marketplace listing
2. Exchange messages and counter-offers
3. Agree on final terms
4. Execute transaction through smart contract

## Customization

### Styling

The app uses Camp Network's official color palette:

```javascript
const colors = {
  campOrange: '#FF6D01',   // Primary brand color
  warm1: '#FF9160',        // Light orange
  cool1: '#2D5A66',        // Dark teal
  warm2: '#FFB400',        // Golden yellow
  // ... more colors
};
```

### Adding Features

1. **New Screens**: Add to the `tabs` array and create corresponding component
2. **API Integration**: Extend hooks in the Origin SDK
3. **Custom UI**: Modify StyleSheet objects for each component

## Troubleshooting

### Common Issues

**Metro bundler issues:**
```bash
npx expo start --clear
```

**iOS build problems:**
```bash
cd ios && pod install && cd ..
```

**Android permissions:**
- Ensure camera and storage permissions are granted
- Check AndroidManifest.xml for required permissions

### Development Tips

1. Use Expo Go app for quick testing on physical devices
2. Enable Fast Refresh for hot reloading during development
3. Use React DevTools for debugging component state
4. Test wallet connections with testnet first

## Deployment

### iOS App Store

1. Build for production:
```bash
eas build --platform ios
```

2. Submit to App Store Connect:
```bash
eas submit --platform ios
```

### Google Play Store

1. Build for production:
```bash
eas build --platform android
```

2. Submit to Google Play Console:
```bash
eas submit --platform android
```

## SDK Integration

This example demonstrates integration with:

- **@campnetwork/origin/react-native**: Core SDK functionality
- **Reown AppKit**: Wallet connection and Web3 interactions
- **AsyncStorage**: Persistent storage for React Native
- **React Query**: Data fetching and caching

## Learn More

- [Camp Network Documentation](https://docs.camp.network)
- [Expo Documentation](https://docs.expo.dev)
- [React Native Documentation](https://reactnative.dev)
- [Reown AppKit Documentation](https://docs.reown.com)

## Support

For issues specific to this example:
1. Check the [GitHub Issues](https://github.com/campnetwork/origin-sdk/issues)
2. Join our [Discord Community](https://discord.gg/campnetwork)
3. Contact support@camp.network

---

Built with ❤️ by the Camp Network team
