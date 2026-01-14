<p align="center">
<img src="https://imgur.com/7nLZezD.png" height="200px"/>
</p>
<br/>

<p align="center">
  <a href="https://www.npmjs.com/package/@campnetwork/origin"><img src="https://img.shields.io/npm/v/@campnetwork/origin?style=for-the-badge" alt="npm version"/></a>
  <img alt="GitHub License" src="https://img.shields.io/github/license/campaign-layer/camp-sdk?style=for-the-badge">
  <img src="https://img.shields.io/npm/last-update/%40campnetwork%2Forigin?style=for-the-badge" alt="npm last update"/>
  <img alt="NPM Downloads" src="https://img.shields.io/npm/d18m/%40campnetwork%2Forigin?style=for-the-badge">
</p>

# Origin SDK

The Origin SDK currently exposes the following modules:

- `"@campnetwork/origin"` - The main entry point for the SDK, exposes the following classes:
  - `Auth` - For authenticating users with the Origin SDK (browser and Node.js)
  - Signer adapters and utilities for Node.js support (ethers, viem, custom signers)
  - Camp Network chain configurations (`campMainnet`, `campTestnet`)
  - Origin utilities (`createLicenseTerms`, `LicenseTerms`, `LicenseType`, `DataStatus`, `DisputeStatus`, `Dispute`, `AppInfo`, `TokenInfo`)
- `"@campnetwork/origin/react"` - Exposes the CampProvider and CampContext, as well as React components and hooks for authentication and fetching user data via Origin

## Features

- **Browser & Node.js Support** - Use in client-side and server-side applications
- **Multiple Signer Types** - Works with ethers, viem, or custom signers
- **Social Account Linking** - Connect Twitter, Spotify, and TikTok
- **React Components** - Pre-built UI components and hooks
- **TypeScript Support** - Full type definitions included
- **Flexible Storage** - Custom storage adapters for session persistence
- **Multiple License Types** - Duration-based, single payment, and X402 micropayment licenses
- **Dispute Resolution** - Raise and resolve IP disputes with CAMP token voting
- **NFT Fractionalization** - Fractionalize IP NFTs into tradable ERC20 tokens
- **App Revenue Sharing** - Built-in app fee support via AppRegistry
- **Bulk Operations** - Purchase multiple IP NFTs in a single transaction

# Installation

```bash
npm install @campnetwork/origin
```

# Core

The core modules can be imported either as a CommonJS module or as an ES6 module.

### CommonJS

```js
const { Auth } = require("@campnetwork/origin");
```

### ES6

```js
import { Auth } from "@campnetwork/origin";
```

## Auth

The Auth class is the entry point for authenticating users with the Origin SDK. It requires a clientId to be instantiated.

### Constructor

- `clientId` - `string` - The client ID of your app. This is required to authenticate users with the Origin SDK.
- `redirectUri` - The URI to redirect to after the user completes oauth for any of the socials. Defaults to `window.location.href`.
  The `redirectUri` can also be an object with the following optional properties:
  - `twitter` - The URI to redirect to after the user completes oauth for Twitter.
  - `spotify` - The URI to redirect to after the user completes oauth for Spotify.
- `environment` - `string` - The environment to use. Can be either `DEVELOPMENT` or `PRODUCTION`. Defaults to `DEVELOPMENT`.
- `baseParentId` - `bigint` - A valid tokenID to be used as the parent of all IPNFTs minted on your platform, making them all derivatives of your base asset.

You may use the `redirectUri` object to redirect the user to different pages based on the social they are linking.
You may only define the URIs for the socials you are using, the rest will default to `window.location.href`.

```js
import { Auth } from "@campnetwork/origin";

const auth = new Auth({
  clientId: string,
  redirectUri: string | object,
});
```

```js
const auth = new Auth({
  clientId: "your-client-id",
  redirectUri: {
    twitter: "https://your-website.com/twitter",
    spotify: "https://your-website.com/spotify",
  },
});
```

```js
const auth = new Auth({
  clientId: "your-client-id",
  baseParentId: 123n,
});
```

### Methods

#### connect

`connect() => void`

The `connect` method prompts the user to sign a message with their wallet in order to authenticate with the Origin SDK.
The wallet provider can be set by calling the `setProvider` method on the Auth instance beforehand. The default provider used is `window.ethereum`.

```js
auth.connect();
```

#### disconnect

`disconnect() => void`

The `disconnect` method logs the user out of the Origin SDK on the client side.

```js
auth.disconnect();
```

#### setProvider

`setProvider(provider: { provider: EIP1193Provider, info: EIP6963ProviderInfo, address?: string }) => void`

_Read more about the [EIP1193Provider](https://eips.ethereum.org/EIPS/eip-1193) and [EIP6963ProviderInfo](https://eips.ethereum.org/EIPS/eip-6963) interfaces._

The `setProvider` method sets the wallet provider to be used for authentication.

```js
auth.setProvider({
  provider: window.ethereum,
  info: { name: "MetaMask", icon: "https://..." },
});
```

#### setWalletAddress

`setWalletAddress(walletAddress: string) => void`

The `setWalletAddress` method sets the wallet address to be used for authentication (via the `connect` method).

**This is only needed if the provider does not support the `eth_requestAccounts` method. Only use this method if you are sure you need to set the wallet address manually.**

```js
auth.setWalletAddress("0x1234567890");
```

#### on

`on(event: string, callback: (data: any) => void) => void`

The `on` method listens for events emitted by the Auth module of the Origin SDK.

The following events are emitted:

##### "state"

Possible states:

- `authenticated` - The user has successfully authenticated.
- `unauthenticated` - The user has been logged out.
- `loading` - The user is in the process of authenticating.

```js
auth.on("state", (data) => {
  console.log(data); // "authenticated" | "unauthenticated" | "loading"
});
```

##### "provider"

Returns the provider that has been set via the `setProvider` method.
If using the Origin SDK React components, this event is emitted when the user selects a provider in the Auth modal.

```js
auth.on("provider", (data) => {
  console.log(data); // { provider: EIP1193Provider, info: EIP6963ProviderInfo }
});
```

##### "providers"

Returns the list of providers that have been injected via EIP6963 and that the user can select from.

```js
auth.on("providers", (data) => {
  console.log(data); // [{ provider: EIP1193Provider, info: EIP6963ProviderInfo }]
});
```

You may use this event to update the UI with the available providers. The user can then select a provider to authenticate with, and the `setProvider` method can be called with the selected provider. The `connect` method can then be called to authenticate the user.

```js
auth.on("providers", (data) => {
  // Update UI with providers
  // User selects a provider
  const selectedProvider = data[0];

  auth.setProvider(selectedProvider);

  auth.connect();
});
```

#### off

`off(event: string, callback: (data: any) => void) => void`

The `off` method unsubscribes from events emitted by the Auth module of the Origin SDK.

```js
auth.off("state", callback);
```

#### getLinkedSocials

`getLinkedSocials() => Promise<{ twitter: boolean, tiktok: boolean, spotify: boolean }>`

The `getLinkedSocials` method returns a promise that resolves to an object containing the possible socials that the user can link and whether they are linked or not.

```js
const linkedSocials = await auth.getLinkedSocials();

console.log(linkedSocials); // { twitter: true, tiktok: false, spotify: true }
```

---

After the user has authenticated, the following methods can be used to link and unlink social accounts.
When linking a social account, the user will be redirected to the OAuth flow for that social platform.
Afterwards, the user will be redirected back to the `redirectUri` specified in the Auth constructor.

**Note: Linking socials is only available in a browser environment**

#### linkTwitter

`linkTwitter() => void`

The `linkTwitter` method redirects the user to the Twitter OAuth flow to link their Twitter account to Origin.

```js
auth.linkTwitter();
```

#### linkSpotify

`linkSpotify() => void`

The `linkSpotify` method redirects the user to the Spotify OAuth flow to link their Spotify account to Origin.

```js
auth.linkSpotify();
```

#### linkTikTok

`linkTikTok(handle: string) => Promise<void>`

The `linkTikTok` method links the provided TikTok handle to Origin.

```js
auth.linkTikTok("tiktokhandle");
```

---

#### unlinkTwitter

`unlinkTwitter() => Promise<void>`

The `unlinkTwitter` method unlinks the user's Twitter account from Origin.

```js
await auth.unlinkTwitter();
```

#### unlinkSpotify

`unlinkSpotify() => Promise<void>`

The `unlinkSpotify` method unlinks the user's Spotify account from Origin.

```js
await auth.unlinkSpotify();
```

#### unlinkTikTok

`unlinkTikTok() => Promise<void>`

The `unlinkTikTok` method unlinks the user's TikTok account from Origin.

```js
await auth.unlinkTikTok();
```

## Node.js Support

The Origin SDK supports Node.js environments, allowing you to authenticate and interact with Origin using server-side signers like ethers or viem.

### Installation for Node.js

```bash
# With ethers
npm install @campnetwork/origin ethers

# With viem
npm install @campnetwork/origin viem
```

### Key Differences from Browser Usage

1. **No Browser Provider Detection**: In Node.js, you explicitly provide a signer instead of detecting browser wallets
2. **Storage**: By default, Node.js uses in-memory storage (not persisted). You can provide a custom storage adapter
3. **OAuth Social Linking**: Social account linking requires browser environment for OAuth flow
4. **SIWE Domain/URI**: You must provide domain and URI for SIWE messages

### Using with ethers

```js
import { Auth, campMainnet } from "@campnetwork/origin";
import { ethers } from "ethers";

// Setup ethers provider and signer
const provider = new ethers.JsonRpcProvider(
  process.env.RPC_URL || campMainnet.rpcUrls.default.http[0]
);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// Create Auth instance
const auth = new Auth({
  clientId: process.env.CLIENT_ID,
  redirectUri: "https://myapp.com/callback",
  environment: "PRODUCTION",
});

// Connect using ethers signer
const result = await auth.connectWithSigner(signer, {
  domain: "myapp.com",
  uri: "https://myapp.com",
});

console.log("Connected!", result.walletAddress);

// Use origin methods
if (auth.origin) {
  const terms = await auth.origin.getTerms(tokenId);
  console.log("Terms:", terms);
}
```

### Using with viem

```js
import { Auth, createNodeWalletClient, campMainnet } from "@campnetwork/origin";
import { privateKeyToAccount } from "viem/accounts";

// Create viem account from private key
const account = privateKeyToAccount(process.env.PRIVATE_KEY);

// Create wallet client for Node.js using Camp Network chain
const client = createNodeWalletClient(
  account,
  campMainnet,
  process.env.RPC_URL || campMainnet.rpcUrls.default.http[0]
);

// Create Auth instance
const auth = new Auth({
  clientId: process.env.CLIENT_ID,
  redirectUri: "https://myapp.com/callback",
  environment: "PRODUCTION",
});

// Connect using viem client
await auth.connectWithSigner(client, {
  domain: "myapp.com",
  uri: "https://myapp.com",
});

console.log("Authenticated:", auth.isAuthenticated);
```

### Exported Chain Configurations

The SDK exports Camp Network chain configurations for easy use:

```js
import { campMainnet, campTestnet } from "@campnetwork/origin";

// campMainnet - Chain ID: 484 (Production)
// campTestnet - Chain ID: 123420001114 (Basecamp testnet)

console.log(campMainnet.rpcUrls.default.http[0]); // RPC URL
console.log(campMainnet.blockExplorers.default.url); // Block explorer
```

### Custom Storage Adapter

By default, Node.js uses in-memory storage. You can provide a custom storage adapter for persistence:

```js
import { Auth, MemoryStorage } from "@campnetwork/origin";

// Custom file-based storage
class FileStorage {
  async getItem(key) {
    /* read from file */
  }
  async setItem(key, value) {
    /* write to file */
  }
  async removeItem(key) {
    /* delete from file */
  }
}

const auth = new Auth({
  clientId: process.env.CLIENT_ID,
  redirectUri: "https://myapp.com/callback",
  environment: "PRODUCTION",
  storage: new FileStorage(), // Custom storage
});
```

### Methods

#### connectWithSigner

`connectWithSigner(signer: any, options?: { domain?: string, uri?: string }) => Promise<{ success: boolean, message: string, walletAddress: string }>`

Connect with a custom signer (viem WalletClient, ethers Signer, or custom signer implementation).

```js
await auth.connectWithSigner(signer, {
  domain: "myapp.com", // Required: Your application domain
  uri: "https://myapp.com", // Required: Your application URI
});
```

**Supported Signer Types:**

- **viem WalletClient** - Automatically detected and used
- **ethers Signer** (v5 or v6) - Works with both versions
- **Custom Signer** - Must implement `getAddress()`, `signMessage()`, and `getChainId()` methods

### Exported Types and Utilities

```js
import {
  // Auth class
  Auth,

  // Origin class
  Origin,

  // Signer adapters
  ViemSignerAdapter,
  EthersSignerAdapter,
  CustomSignerAdapter,
  createSignerAdapter,

  // Storage adapters
  BrowserStorage,
  MemoryStorage,

  // Viem helpers
  createNodeWalletClient,

  // Chain configs
  campMainnet,
  campTestnet,

  // License utilities
  createLicenseTerms,
  LicenseTerms,
  LicenseType,

  // Status enums
  DataStatus,
  DisputeStatus,

  // Types
  Dispute,
  AppInfo,
  TokenInfo,
  BuyParams,
  TolerantResult,
  BulkCostPreview,
  VoteEligibility,
  DisputeProgress,
  FractionOwnership,
  FractionalizeEligibility,
} from "@campnetwork/origin";
```

### Examples

See the [examples/server-side](./examples/server-side) directory for complete Node.js examples including:

- `connect-with-ethers.js` - Using ethers v6 Signer
- `connect-with-viem.js` - Using viem WalletClient
- `connect-with-custom-signer.js` - Custom signer implementation
- `query-origin-data.js` - Querying blockchain data

# React

The React components and hooks can be imported as ES6 modules. The example below shows how to set up the `CampProvider` component and subsequently use the provided hooks and components.

```js
// main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { CampProvider } from "@campnetwork/origin/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App.jsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <CampProvider clientId="your-client-id">
        <App />
      </CampProvider>
    </QueryClientProvider>
  </StrictMode>
);
```

## CampProvider

The `CampProvider` component requires a `clientId` prop to be passed in order to link the users to your app.
It can also take the following optional props:

- `redirectUri` - `string | object` - Either a string that will be used as the redirect URI for all socials, or an object with the following optional properties: `twitter`, `spotify`. This is used to redirect the user to different pages after they have completed the OAuth flow for a social.
- `environment` - `string` - The environment to use. Can be either `DEVELOPMENT` or `PRODUCTION`. Defaults to `DEVELOPMENT`.
- - the `DEVELOPMENT` environment uses the Camp Testnet while the `PRODUCTION` environment uses the Camp Mainnet.
- `baseParentId` - `string | bigint` - A valid tokenID to be used as the parent of all IPNFTs minted on your platform, making them all derivatives of your base asset.

```jsx
import { CampProvider } from "@campnetwork/origin/react";
// ...
function App() {
  return (
    <CampProvider
      clientId="your-client-id"
      redirectUri="https://your-website.com"
      environment="DEVELOPMENT"
    >
      <div>Your app</div>
    </CampProvider>
  );
}
```

Or, with an object for the `redirectUri`:

```jsx
import { CampProvider } from "@campnetwork/origin/react";
// ...
function App() {
  return (
    <CampProvider
      clientId="your-client-id"
      redirectUri={{
        twitter: "https://your-website.com/twitter",
        spotify: "https://your-website.com/spotify",
      }}
      environment="DEVELOPMENT"
    >
      <div>Your app</div>
    </CampProvider>
  );
}
```

The `CampProvider` component sets up the context for the Origin SDK and provides the Auth instance to the rest of the app.

## CampModal

![@campnetwork/origin](https://imgur.com/AFmorL4.png)

The **CampModal** is a one-line\* solution for authenticating users with the Origin SDK. It can be used to connect users to Origin, link and unlink social accounts, mint IPNFTs, and view the user's Origin stats.

It works as follows:

The **CampModal** component displays a button with the text "**Connect**" that the user can click on in order to summon the modal. The modal shows a list of available providers that the user can select from. After a provider has been selected, the `connect` method is called on the Auth instance to authenticate the user.

If the user is already authenticated, the button will instead say "**My Origin**" and the modal will display the user's Origin profile information and allow them to link and unlink social accounts.

The **CampModal** can take the following props:

- `wcProjectId` - `string` - The WalletConnect project ID to use for authentication. Allows the users to authenticate via WalletConnect.
- `injectButton` - `boolean` - Whether to inject the button into the DOM or not. Defaults to `true`. If set to `false`, the button will not be rendered and the modal can be opened programmatically via the `openModal` function returned by the `useModal` hook.
- `onlyWagmi` - `boolean` - Whether to only show the provider that the user is currently authenticated with. Defaults to `false`.
- `defaultProvider` - `{ provider: EIP1193Provider, info: EIP6963ProviderInfo, exclusive: boolean }` - Custom provider to set as the highlighted provider in the modal. If not set, the wagmi provider will be highlighted if it is available. The `exclusive` property can be set to `true` to only show this provider in the modal.

### Usage

Basic usage of the **CampModal** component:

```jsx
import { CampModal } from "@campnetwork/origin/react";

function App() {
  return (
    <div>
      <CampModal />
    </div>
  );
}
```

With custom props:

```jsx
import { CampModal } from "@campnetwork/origin/react";

function App() {
  return (
    <div>
      <CampModal
        wcProjectId="your-wc-project-id"
        defaultProvider={{
          provider: window.ethereum,
          info: { name: "MetaMask", icon: "https://..." },
          exclusive: false,
        }}
      />
    </div>
  );
}
```

You can find more [examples here](./examples/client-side/react/providers-configuration).

Only show the provider that the user is currently authenticated with (if using wagmi):

```jsx
import { CampModal } from "@campnetwork/origin/react";

function App() {
  return (
    <div>
      <CampModal onlyWagmi />
    </div>
  );
}
```

Users can be authenticated either via the Camp Modal as outlined above or programmatically by calling the `connect` method on the Auth instance.

### Usage with third party providers (Privy, Appkit, Magic, etc.)

The Camp Modal can be used in conjunction with providers such as Privy and Appkit to create a seamless authentication experience for users. When using wagmi, it will automatically detect if the user is authenticated via a third party provider and give them the option to connect to Origin using that provider. Otherwise, you can set up the default provider to be whatever provider you are using.

[Example usage with Privy](./examples/client-side/react/privy-connector/)

[Example usage with Appkit](./examples/client-side/react/appkit-connector/)

[Example usage with magic.link](./examples/client-side/react/magic-link-connector/)

After the user has authenticated, you can use the provided hooks to fetch user data and listen for events.

## LinkButton

The **LinkButton** component is a button that can be used to link and unlink social accounts. Under the hood it uses the `useLinkModal` hook to open the Link Socials modal.

The **LinkButton** can take the following props:

- `social` - `string` - The social account to link or unlink. Can be one of: `twitter`, `tiktok`, `spotify`.
- `variant` - `string` - The variant of the button. Can be one of: `default`, `icon`. Defaults to `default`.
- `theme` - `string` - The theme of the button. Can be one of: `default`, `camp`. Defaults to `default`.

**Note: The `<CampModal/>` component must be rendered in the component tree for the buttons to work.**

### Usage

Basic usage of the **LinkButton** component:

```jsx
import { LinkButton, CampModal } from "@campnetwork/origin/react";

function App() {
  return (
    <div>
      <CampModal />
      <LinkButton social="twitter" />
      <LinkButton social="spotify" theme="camp" />
      <LinkButton social="tiktok" variant="icon" theme="camp" />
    </div>
  );
}
```

## CampButton

The **CampButton** component allows you to render a button that opens the Auth or My Origin modal when clicked. It can be used as an alternative to the button that is injected by the **CampModal** component. It allows you to have multiple buttons in your app that open the modal, or to have the button in a different location than where the **CampModal** component is rendered.

```jsx
import { CampButton, CampModal } from "@campnetwork/origin/react";

function App() {
  return (
    <div>
      <CampModal injectButton={false} />
      <CampButton />
    </div>
  );
}
```

## Hooks

### useAuth

The `useAuth` hook returns the instance of the Auth class that is provided by the CampProvider.
It can be used as outlined in the Core section in order to build custom authentication flows, listen for events, and fetch user data.

```jsx
import { useAuth } from "@campnetwork/origin/react";

function App() {
  const auth = useAuth();

  return (
    <div>
      <button onClick={auth.connect}>Connect</button>
    </div>
  );
}
```

### useAuthState

The `useAuthState` hook returns the current authentication state of the user.

```jsx
import { useAuthState } from "@campnetwork/origin/react";

function App() {
  const { authenticated, loading } = useAuthState();

  return (
    <div>
      {loading && <div>Loading...</div>}
      {authenticated && <div>Authenticated</div>}
    </div>
  );
}
```

### useProvider

The `useProvider` hook returns the provider that has been set via the `setProvider` method, as well as a `setProvider` function that can be used to update the provider.

```jsx
import { useProvider } from "@campnetwork/origin/react";

function App() {
  const { provider, setProvider } = useProvider();

  return (
    <div>
      <div>Current provider: {provider.info.name}</div>
      <button
        onClick={() =>
          setProvider({ provider: window.ethereum, info: { name: "Metamask" } })
        }
      >
        Set Provider
      </button>
    </div>
  );
}
```

### useProviders

The `useProviders` hook returns the list of providers that have been injected via EIP6963 and that the user or app can select from.

```jsx
import { useProviders, useProvider } from "@campnetwork/origin/react";

function App() {
  const providers = useProviders();
  const { setProvider } = useProvider();

  return (
    <div>
      {providers.map((provider) => (
        <button key={provider.info.name} onClick={() => setProvider(provider)}>
          {provider.info.name}
        </button>
      ))}
    </div>
  );
}
```

### useConnect

The `useConnect` hook returns functions that can be used to connect and disconnect the user.

```jsx
import { useConnect, useAuthState } from "@campnetwork/origin/react";

function App() {
  const { connect, disconnect } = useConnect();
  const { authenticated } = useAuthState();

  return (
    <div>
      {authenticated ? (
        <button onClick={disconnect}>Disconnect</button>
      ) : (
        <button onClick={connect}>Connect</button>
      )}
    </div>
  );
}
```

### useSocials

The `useSocials` hook returns the state of the user's linked social accounts.

```jsx
import { useSocials } from "@campnetwork/origin/react";

function App() {
  const { data, error, isLoading } = useSocials();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <div>Twitter: {data.twitter ? "Linked" : "Not linked"}</div>
      <div>Tiktok: {data.tiktok ? "Linked" : "Not linked"}</div>
      <div>Spotify: {data.spotify ? "Linked" : "Not linked"}</div>
    </div>
  );
}
```

### useLinkSocials

The `useLinkSocials` hook returns functions that can be used to link and unlink social accounts.

```jsx
import { useLinkSocials } from "@campnetwork/origin/react";

function App() {
  const {
    linkTwitter,
    linkSpotify,
    linkTiktok,
    unlinkTwitter,
    unlinkSpotify,
    unlinkTiktok,
  } = useLinkSocials();

  return (
    <div>
      <button onClick={linkTwitter}>Link Twitter</button>
      <button onClick={linkSpotify}>Link Spotify</button>
      <button onClick={() => linkTiktok("tiktokhandle")}>Link TikTok</button>
      </button>
      <button onClick={unlinkTwitter}>Unlink Twitter</button>
      <button onClick={unlinkTiktok}>Unlink TikTok</button>
      <button onClick={unlinkSpotify}>Unlink Spotify</button>
    </div>
  );
}
```

### useModal

The `useModal` hook returns the state of the Auth and My Origin modals, as well as functions to show and hide them.

**Note: The `<CampModal/>` component must be rendered in the component tree for the modals to be displayed.**

```jsx
import { useModal, CampModal } from "@campnetwork/origin/react";

function App() {
  const { isOpen, openModal, closeModal } = useModal();

  return (
    <div>
      <button onClick={openModal}>Open Modal</button>
      <button onClick={closeModal}>Close Modal</button>
      <CampModal injectButton={false} />
    </div>
  );
}
```

The state and functions returned by the `useModal` hook can be used to show and hide the Auth and My Origin modals, as well as to check if they are currently open. The modal being controlled is dictated by the user's authentication state.

### useLinkModal

The `useLinkModal` hook returns the state of the Link Socials modal, as well as functions to show and hide it.

**Note: The `<CampModal/>` component must be rendered in the component tree for the modal to be displayed.**

```jsx
import { useLinkModal, CampModal } from "@campnetwork/origin/react";

function App() {
  const { isLinkingOpen, openTwitterModal } = useLinkModal();

  return (
    <div>
      <CampModal />
      <button onClick={openTwitterModal}>Link Twitter</button>
    </div>
  );
}
```

It returns the following properties and functions:

- `isLinkingOpen` - `boolean` - Whether the Link Socials modal is open or not.
- `openTwitterModal` - `() => void`
- `openSpotifyModal` - `() => void`
- `openTiktokModal` - `() => void`
- `linkTwitter` - `() => void`
- `linkSpotify` - `() => void`
- `linkTiktok` - `() => void`
- `linkTelegram` - `() => void`
- `unlinkTwitter` - `() => void`
- `unlinkSpotify` - `() => void`
- `unlinkTiktok` - `() => void`
- `closeModal` - `() => void`

The difference between the `openXModal` functions and the `linkX / unlinkX` functions is that the former opens the modal regardless of the user's linking state, allowing them to either link or unlink their account, while the latter only opens the specified modal if the user's linking state allows for it.

For example, if the user is linked to Twitter, calling `openTwitterModal` will open the modal to _unlink_ their Twitter account, while calling `linkTwitter` will not do anything, and calling `unlinkTwitter` will open the modal to unlink their Twitter account.

## Origin Methods (`auth.origin`)

The `Origin` class provides blockchain and API methods for interacting with Origin IpNFTs, uploading files, managing user stats, and more. Access these via `auth.origin` after authentication.

### Types

#### `LicenseType`

Enum representing the type of license for an IP NFT:

```typescript
enum LicenseType {
  DURATION_BASED = 0, // License expires after a set duration (subscription model)
  SINGLE_PAYMENT = 1, // One-time payment for perpetual access
  X402 = 2, // HTTP 402-based micropayment license
}
```

#### `LicenseTerms`

The license terms object used in minting and updating methods:

```typescript
type LicenseTerms = {
  price: bigint; // Price in wei
  duration: number; // Duration in seconds (0 for SINGLE_PAYMENT and X402)
  royaltyBps: number; // Royalty in basis points (1-10000)
  paymentToken: Address; // Payment token address (address(0) for native currency)
  licenseType: LicenseType; // Type of license
};
```

#### `DataStatus`

Enum representing the status of data in the system:

```typescript
enum DataStatus {
  ACTIVE = 0, // Data is currently active and available
  DELETED = 1, // Data has been deleted
  DISPUTED = 2, // Data has been disputed and marked as potentially infringing
}
```

#### `DisputeStatus`

Enum representing the status of a dispute:

```typescript
enum DisputeStatus {
  Uninitialized = 0, // Dispute does not exist
  Raised = 1, // Dispute has been raised
  Asserted = 2, // IP owner has responded
  Resolved = 3, // Dispute has been resolved
  Cancelled = 4, // Dispute was cancelled
}
```

#### `Dispute`

Interface representing a dispute against an IP NFT:

```typescript
interface Dispute {
  initiator: Address;
  targetId: bigint;
  disputeTag: Hex;
  disputeEvidenceHash: Hex;
  counterEvidenceHash: Hex;
  disputeTimestamp: bigint;
  assertionTimestamp: bigint;
  yesVotes: bigint;
  noVotes: bigint;
  status: DisputeStatus;
  bondAmount: bigint;
  protocolFeeAmount: bigint;
}
```

#### `AppInfo`

Interface representing app information from the AppRegistry:

```typescript
interface AppInfo {
  treasury: Address;
  revenueShareBps: number;
  isActive: boolean;
}
```

#### `TokenInfo`

Comprehensive token information returned by `getTokenInfoSmart`:

```typescript
interface TokenInfo {
  tokenId: bigint;
  owner: Address;
  uri: string;
  status: DataStatus;
  terms: LicenseTerms;
  hasAccess: boolean;
  accessExpiry: bigint | null;
  appId: string;
}
```

### Minting Constraints

When minting or updating an IpNFT, the following constraints apply to the `LicenseTerms`:

- The price must be at least `1000000000000000` wei (0.001 $CAMP).
- The royaltyBps must be between `1` and `10000` (0.01% to 100%).
- For `DURATION_BASED` licenses, the duration must be between `86400` seconds and `2628000` seconds (1 day to 30 days).
- For `SINGLE_PAYMENT` and `X402` licenses, duration must be `0`.

### `createLicenseTerms(price, duration, royaltyBps, paymentToken, licenseType?)`

A utility function to create properly validated license terms for minting and updating IpNFTs.

- `price`: Price in wei (bigint)
- `duration`: Duration in seconds (number) - use 0 for SINGLE_PAYMENT and X402
- `royaltyBps`: Royalty in basis points (number)
- `paymentToken`: Payment token address (Address) - use `zeroAddress` from viem for native currency
- `licenseType`: Type of license (LicenseType) - defaults to `DURATION_BASED`
- **Returns:** A validated `LicenseTerms` object
- **Throws:** Error if any parameter violates the constraints

**Example:**

```typescript
import { createLicenseTerms, LicenseType } from "@campnetwork/origin";
import { zeroAddress } from "viem";

// Create duration-based license (subscription)
const subscriptionLicense = createLicenseTerms(
  BigInt("1000000000000000"), // 0.001 CAMP in wei
  86400, // 1 day in seconds
  1000, // 10% royalty (1000 basis points)
  zeroAddress // Native currency (CAMP)
);

// Create single payment license (perpetual access)
const perpetualLicense = createLicenseTerms(
  BigInt("10000000000000000"), // 0.01 CAMP
  0, // Duration must be 0 for single payment
  500, // 5% royalty
  zeroAddress,
  LicenseType.SINGLE_PAYMENT
);

// Use with minting functions
await auth.origin.mintFile(file, metadata, subscriptionLicense);
await auth.origin.mintSocial("twitter", metadata, perpetualLicense);
```

### File Upload & Minting

#### `mintFile(file, metadata, license, parents?, options?)`

Uploads a file and mints an IpNFT for it.

- `file`: File to upload and mint
- `metadata`: Additional metadata for the IpNFT
  - `name`: Name of the IpNFT
  - `description`: Description of the IpNFT
  - `image`: Optional image URL for the IpNFT
  - `attributes`: Optional array of attributes
- `license`: LicenseTerms object
- `parents`: Optional array of parent token IDs for derivatives
- `options.progressCallback`: Optional progress callback
- `options.previewImage`: Optional preview image file
- `options.useAssetAsPreview`: Optional flag to use the uploaded asset as the preview image - only for image files
- **Returns:** Minted token ID as a string, or throws on failure

#### `mintSocial(source, metadata, license)`

Mints an IpNFT for a connected social account.

- `source`: Social platform (`"spotify" | "twitter" | "tiktok"`)
- `metadata`: Additional metadata for the IpNFT
- `license`: LicenseTerms object
- **Returns:** Minted token ID as a string, or throws on failure

### IpNFT & Marketplace Methods

Most methods mirror smart contract functions and require appropriate permissions.

#### Core IpNFT Methods

- `mintWithSignature(to, tokenId, parents, isIp, hash, uri, license, deadline, signature, appId?)` — Mint with a backend signature. `appId` defaults to SDK's clientId.
- `registerIpNFT(source, deadline, license, metadata, fileKey?, parents?)` — Register IP with backend
- `updateTerms(tokenId, license)` — Update license terms
- `finalizeDelete(tokenId)` — Finalize deletion of an IP NFT
- `getOrCreateRoyaltyVault(tokenId)` — Get or create Token Bound Account for royalties
- `getTerms(tokenId)` — Get license terms for a token
- `ownerOf(tokenId)` — Get owner address
- `balanceOf(owner)` — Get token count for an owner
- `tokenURI(tokenId)` — Get metadata URI
- `dataStatus(tokenId)` — Get data status (ACTIVE, DELETED, or DISPUTED)
- `isApprovedForAll(owner, operator)` — Check operator approval
- `transferFrom(from, to, tokenId)` — Transfer token
- `safeTransferFrom(from, to, tokenId)` — Safe transfer token
- `approve(to, tokenId)` — Approve address for token
- `setApprovalForAll(operator, approved)` — Set operator approval

#### Marketplace Methods

- `buyAccess(buyer, tokenId, expectedPrice, expectedDuration, expectedPaymentToken, expectedProtocolFeeBps?, expectedAppFeeBps?, value?)` — Purchase access to an IP NFT
- `hasAccess(address, tokenId)` — Check if address has access
- `subscriptionExpiry(tokenId, address)` — Get subscription expiry timestamp

#### Smart Helper Methods (Recommended)

These methods handle complexity automatically and are recommended for most use cases:

- `getTokenInfoSmart(tokenId, owner?)` — Get comprehensive token info in a single call (owner, terms, status, access info, etc.)
- `buyAccessSmart(tokenId)` — Buys access with automatic fee fetching. Returns `null` if user already has access.
- `settlePaymentIntent(x402Response, signer?)` — Settle an X402 payment intent response

**Example:**

```typescript
// Get all token info at once
const info = await auth.origin.getTokenInfoSmart(1n);
console.log(`Owner: ${info.owner}`);
console.log(`Price: ${info.terms.price}`);
console.log(`Has access: ${info.hasAccess}`);
console.log(`License type: ${info.terms.licenseType}`);

// Smart purchase - checks access first, fetches fees automatically
const result = await auth.origin.buyAccessSmart(1n);
if (result === null) {
  console.log("Already have access!");
} else {
  console.log("Purchased:", result.txHash);
}
```

#### Bulk Purchase Methods

For purchasing multiple IP NFTs in a single transaction:

- `bulkBuyAccess(buyer, purchases, value?)` — Atomic bulk purchase (all succeed or all fail)
- `bulkBuyAccessTolerant(buyer, purchases, value?)` — Tolerant bulk purchase (partial success allowed)
- `bulkBuyAccessSmart(tokenIds, options?)` — Smart bulk purchase with automatic parameter building
- `previewBulkCost(tokenIds)` — Preview total cost for multiple tokens
- `buildPurchaseParams(tokenIds)` — Build purchase parameters from token IDs
- `checkActiveStatus(tokenIds)` — Check active status of multiple tokens

**Example:**

```typescript
// Smart bulk purchase - handles everything automatically
const result = await auth.origin.bulkBuyAccessSmart([1n, 2n, 3n], {
  tolerant: true, // Continue even if some fail
});

// Preview costs before purchasing
const preview = await auth.origin.previewBulkCost([1n, 2n, 3n]);
console.log(`Total cost: ${preview.totalNativeCost} wei`);
```

#### Dispute Module Methods

Methods for the IP dispute resolution system:

- `raiseDispute(targetIpId, evidenceHash, disputeTag)` — Raise a dispute against an IP NFT
- `disputeAssertion(disputeId, counterEvidenceHash)` — IP owner responds to dispute
- `voteOnDispute(disputeId, support)` — CAMP stakers vote on dispute
- `resolveDispute(disputeId)` — Finalize dispute after voting period
- `cancelDispute(disputeId)` — Cancel a dispute (initiator only)
- `tagChildIp(childIpId, infringerDisputeId)` — Tag derivative IPs of disputed content
- `getDispute(disputeId)` — Get dispute details
- `canVoteOnDispute(disputeId, voter?)` — Check if user can vote and why (recommended before voting)
- `getDisputeProgress(disputeId)` — Get voting stats, quorum progress, timeline, and projected outcome

**VoteEligibility Interface:**

```typescript
interface VoteEligibility {
  canVote: boolean; // Whether the user can vote
  reason?: string; // Why they can't vote (if canVote is false)
  votingWeight: bigint; // User's staked CAMP balance
  stakingThreshold: bigint; // Minimum required stake
  hasAlreadyVoted: boolean; // Whether user already voted
  userStakeTimestamp: bigint; // When user staked (0 if never)
  disputeTimestamp: bigint; // When dispute was raised
  disputeStatus: DisputeStatus; // Current status
  isVotingPeriodActive: boolean; // Whether voting is open
}
```

**DisputeProgress Interface:**

```typescript
interface DisputeProgress {
  disputeId: bigint;
  status: DisputeStatus;
  yesVotes: bigint; // Total YES votes (weighted)
  noVotes: bigint; // Total NO votes (weighted)
  totalVotes: bigint;
  yesPercentage: number; // 0-100
  noPercentage: number; // 0-100
  quorum: bigint; // Required for valid resolution
  quorumPercentage: number; // Progress toward quorum
  quorumMet: boolean;
  projectedOutcome: "dispute_succeeds" | "dispute_fails" | "no_quorum";
  timeline: {
    raisedAt: Date;
    cooldownEndsAt: Date; // Owner can assert until this time
    votingEndsAt: Date;
    canResolveNow: boolean;
    timeUntilResolution: number; // Seconds remaining
  };
}
```

**Example:**

```typescript
import { keccak256, toBytes } from "viem";

// Raise a dispute
const evidenceHash = keccak256(toBytes("ipfs://QmEvidence..."));
const disputeTag = keccak256(toBytes("copyright_infringement"));

const result = await auth.origin.raiseDispute(
  1n, // Token ID to dispute
  evidenceHash,
  disputeTag
);

// Check if you can vote before voting
const eligibility = await auth.origin.canVoteOnDispute(disputeId);

if (eligibility.canVote) {
  console.log(`Voting with weight: ${eligibility.votingWeight}`);
  await auth.origin.voteOnDispute(disputeId, true); // Vote YES
} else {
  console.log(`Cannot vote: ${eligibility.reason}`);
  // Possible reasons:
  // - "Dispute is not in a voteable status"
  // - "Voting period has ended"
  // - "You have already voted on this dispute"
  // - "You have never staked CAMP tokens"
  // - "You staked after this dispute was raised"
  // - "Insufficient stake: you have X but need at least Y"
}

// Get detailed dispute progress
const progress = await auth.origin.getDisputeProgress(disputeId);
console.log(`Yes: ${progress.yesPercentage}% | No: ${progress.noPercentage}%`);
console.log(`Quorum: ${progress.quorumPercentage}% (${progress.quorumMet ? "met" : "not met"})`);
console.log(`Projected outcome: ${progress.projectedOutcome}`);

if (progress.timeline.canResolveNow) {
  await auth.origin.resolveDispute(disputeId);
} else {
  console.log(`Can resolve in ${progress.timeline.timeUntilResolution} seconds`);
}
```

#### Fractionalizer Module Methods

Methods for fractionalizing IP NFTs into ERC20 tokens:

- `fractionalize(tokenId)` — Fractionalize an NFT into ERC20 tokens
- `fractionalizeWithApproval(tokenId)` — Fractionalize with automatic approval (recommended)
- `redeem(tokenId)` — Redeem fractional tokens for the underlying NFT
- `redeemIfComplete(tokenId)` — Redeem only if holding 100% of tokens (recommended)
- `getTokenForNFT(tokenId)` — Get the ERC20 token address for a fractionalized NFT
- `getFractionOwnership(tokenId, owner?)` — Get user's ownership percentage of fractional tokens
- `canFractionalize(tokenId, owner?)` — Check if user can fractionalize an NFT

**FractionOwnership Interface:**

```typescript
interface FractionOwnership {
  tokenId: bigint;
  erc20Address: Address; // Zero if not fractionalized
  isFractionalized: boolean;
  balance: bigint; // User's fractional token balance
  totalSupply: bigint; // Total supply of fractional tokens
  ownershipPercentage: number; // 0-100
  canRedeem: boolean; // True if owns 100%
  decimals: number;
}
```

**FractionalizeEligibility Interface:**

```typescript
interface FractionalizeEligibility {
  canFractionalize: boolean;
  reason?: string; // Why not (if false)
  isOwner: boolean;
  currentOwner: Address;
  isAlreadyFractionalized: boolean;
  existingErc20Address?: Address;
  dataStatus: DataStatus;
  isApproved: boolean; // Fractionalizer approved to transfer
  needsApproval: boolean;
}
```

**Example:**

```typescript
// Check if you can fractionalize
const eligibility = await auth.origin.canFractionalize(1n);

if (eligibility.canFractionalize) {
  // Fractionalize with automatic approval
  await auth.origin.fractionalizeWithApproval(1n);
} else {
  console.log(`Cannot fractionalize: ${eligibility.reason}`);
  // Possible reasons:
  // - "You don't own this NFT"
  // - "This NFT is already fractionalized"
  // - "This NFT has been deleted"
  // - "This NFT is disputed"
}

// Check your ownership of fractional tokens
const ownership = await auth.origin.getFractionOwnership(1n);

if (!ownership.isFractionalized) {
  console.log("This NFT has not been fractionalized");
} else {
  console.log(`You own ${ownership.ownershipPercentage}% of this NFT`);
  console.log(`Balance: ${ownership.balance} / ${ownership.totalSupply}`);

  if (ownership.canRedeem) {
    console.log("You can redeem the original NFT!");
    await auth.origin.redeemIfComplete(1n);
  }
}
```

#### AppRegistry Module Methods

Methods for querying app information:

- `getAppInfo(appId)` — Get app information from the registry

**Example:**

```typescript
const appInfo = await auth.origin.getAppInfo("my-app-id");
console.log(`Treasury: ${appInfo.treasury}`);
console.log(`Revenue Share: ${appInfo.revenueShareBps / 100}%`);
console.log(`Active: ${appInfo.isActive}`);
```

#### Royalty & Data Methods

- `getTokenBoundAccount(tokenId)` — Get the Token Bound Account address for a token
- `getRoyalties(tokenId, token?)` — Get royalty balance for a token
- `claimRoyalties(tokenId, recipient?, token?)` — Claim royalties from a token's TBA
- `getData(tokenId)` — Fetch the underlying IP data (requires access)

### Utility Methods

- `getJwt()` — Get current JWT token
- `setViemClient(client)` — Set viem wallet client for blockchain interactions

---

Call these methods as `await auth.origin.methodName(...)` after authenticating. See inline code documentation for full details and parameter types.

---

# Advanced flows

## App Revenue Share in Origin using derivatives

You can enable app-level revenue sharing in **Origin** using the following setup:

1. **Mint a base (genesis) IPNFT** for your platform and set its royalty percentage to whatever share you want the platform to receive. This can be done using the Origin UI, or the SDK.
2. **Make all user-created IPNFTs derivatives** of this base IPNFT. There are two ways to do this:
   - **Automatic (recommended):**
     Set the `baseParentId` parameter on the `CampProvider` or `Auth` class (depending on your integration) to the tokenId of the base IPNFT.
     → This automatically applies to _all mints_, including those made through the **Camp SDK Modal**.
   - **Manual:**
     If you’re using a custom mint flow, add the base IPNFT’s tokenId to the `parents` array before calling `origin.mintFile` or `origin.mintSocial`.
     → Note: this does **not** affect mints made through the Camp SDK Modal.
3. **Royalties flow automatically:**

   The royalty percentage defined on the base IPNFT will be collected from every subscription to its derivative IPNFTs.

4. **Claim your platform royalties:**

   You can view and claim the accumulated platform royalties directly from your **Creator Dashboard** in the **Origin UI**.

**Note:** Each IPNFT can have a maximum of 8 parents. Using one parent slot for app-level revenue sharing reduces the available slots for user-defined parent–derivative relationships to 7.

---

# Contributing

Install the dependencies.

```bash
npm install
```

Build the SDK.

```bash
npm run build
```

This will generate the SDK in the `dist` folder.

You can also run the following command to watch for changes and rebuild the SDK automatically:

```bash
npm run dev
```

In order to use the sdk in a local project, you can link the sdk to the project.

```bash
npm link .
```

Then, in the project you want to use the sdk in, run:

```bash
npm link @campnetwork/origin
```

This will link the local sdk to the project.
