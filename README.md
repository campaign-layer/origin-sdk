<p align="center">
<img src="https://imgur.com/7nLZezD.png" height="200px"/>
</p>
<br/>

# Camp SDK

The @campnetwork/sdk currently exposes the following modules:

- `"@campnetwork/sdk"` - The main entry point for the SDK, exposes the TwitterAPI class and the Auth class
- `"@campnetwork/sdk/react"` - Exposes the CampProvider and CampContext for use in React applications
- `"@campnetwork/sdk/react/auth"` - Exposes React hooks for authentication and fetching user data via the Camp Auth Hub

# Core

The core modules can be imported either as a CommonJS module or as an ES6 module. The examples below show how to import and instantiate the TwitterAPI class using both methods.

### CommonJS

```js
const { TwitterAPI } = require("@campnetwork/sdk");

const twitter = new TwitterAPI({
  apiKey: "your-api-key",
});
```

### ES6

```js
import { TwitterAPI } from "@campnetwork/sdk";

const twitter = new TwitterAPI({
  apiKey: "your-api-key",
});
```

## Socials

### TwitterAPI

The TwitterAPI class is the entry point for fetching user Twitter data from the Auth Hub. It requires an API key to be instantiated.

**Note: The methods for fetching data will only return data for users who have authenticated to your app via the Camp SDK.**

#### Constructor

`apiKey` - The API key of your app.

```js
const twitter = new TwitterAPI({
  apiKey: string,
});
```

#### Methods

##### fetchUserByUsername

`fetchUserByUsername(twitterUserName: string)`

```js
const user = await twitter.fetchUserByUsername("jack");
```

##### fetchTweetsByUsername

`fetchTweetsByUsername(twitterUserName: string, page: number, limit: number)`

```js
const tweets = await twitter.fetchTweetsByUsername("jack", 1, 10);
```

##### fetchFollowersByUsername

`fetchFollowersByUsername(twitterUserName: string, page: number, limit: number)`

```js
const followers = await twitter.fetchFollowersByUsername("jack", 1, 10);
```

##### fetchFollowingByUsername

`fetchFollowingByUsername(twitterUserName: string, page: number, limit: number)`

```js
const following = await twitter.fetchFollowingByUsername("jack", 1, 10);
```

##### fetchTweetById

`fetchTweetById(tweetId: string)`

```js
const tweet = await twitter.fetchTweetById("1234567890");
```

##### fetchUserByWalletAddress

`fetchUserByWalletAddress(walletAddress: string, page: number, limit: number)`

```js
const user = await twitter.fetchUserByWalletAddress("0x1234567890", 1, 10);
```

##### fetchRepostedByUsername

`fetchRepostedByUsername(twitterUserName: string, page: number, limit: number)`

```js
const reposts = await twitter.fetchRepostedByUsername("jack", 1, 10);
```

##### fetchRepliesByUsername

`fetchRepliesByUsername(twitterUserName: string, page: number, limit: number)`

```js
const replies = await twitter.fetchRepliesByUsername("jack", 1, 10);
```

##### fetchLikesByUsername

`fetchLikesByUsername(twitterUserName: string, page: number, limit: number)`

```js
const likes = await twitter.fetchLikesByUsername("jack", 1, 10);
```

##### fetchFollowsByUsername

`fetchFollowsByUsername(twitterUserName: string, page: number, limit: number)`

```js
const follows = await twitter.fetchFollowsByUsername("jack", 1, 10);
```

##### fetchViewedTweetsByUsername

`fetchViewedTweetsByUsername(twitterUserName: string, page: number, limit: number)`

```js
const viewedTweets = await twitter.fetchViewedTweetsByUsername("jack", 1, 10);
```

## Auth

The Auth class is the entry point for authenticating users with the Camp SDK. It requires a clientId to be instantiated.
**Note: The Auth class is only to be used on the client side.**

### Constructor

- `clientId` - The client ID of your app. This is required to authenticate users with the Camp SDK.
- `redirectUri` - The URI to redirect to after the user completes oauth for any of the socials. Defaults to `window.location.href`.

```js
import { Auth } from "@campnetwork/sdk";

const auth = new Auth({
  clientId: string,
  redirectUri: string,
});
```

### Methods

#### connect

`connect() => void`

The `connect` method prompts the user to sign a message with their wallet in order to authenticate with the Camp SDK.
The wallet provider can be set by calling the `setProvider` method on the Auth instance beforehand. The default provider used is `window.ethereum`.

```js
auth.connect();
```

#### disconnect

`disconnect() => void`

The `disconnect` method logs the user out of the Camp SDK on the client side.

```js
auth.disconnect();
```

#### setProvider

`setProvider(provider: { provider: EIP1193Provider, info: EIP6963ProviderInfo }) => void`

_Read more about the [EIP1193Provider](https://eips.ethereum.org/EIPS/eip-1193) and [EIP6963ProviderInfo](https://eips.ethereum.org/EIPS/eip-6963) interfaces._

The `setProvider` method sets the wallet provider to be used for authentication.

```js
auth.setProvider({
  provider: window.ethereum,
  info: { name: "MetaMask", icon: "https://..." },
});
```

#### on

`on(event: string, callback: (data: any) => void) => void`

The `on` method listens for events emitted by the Auth module of the Camp SDK.

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
If using the Camp SDK React components, this event is emitted when the user selects a provider in the Auth modal.

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

#### getLinkedSocials

`getLinkedSocials() => Promise<{ twitter: boolean, discord: boolean, spotify: boolean }>`

The `getLinkedSocials` method returns a promise that resolves to an object containing the possible socials that the user can link and whether they are linked or not.

```js
const linkedSocials = await auth.getLinkedSocials();

console.log(linkedSocials); // { twitter: true, discord: false, spotify: true }
```

---

After the user has authenticated, the following methods can be used to link and unlink social accounts.
When linking a social account, the user will be redirected to the OAuth flow for that social platform.
Afterwards, the user will be redirected back to the `redirectUri` specified in the Auth constructor.

#### linkTwitter

`linkTwitter() => void`

The `linkTwitter` method redirects the user to the Twitter OAuth flow to link their Twitter account to the Auth Hub.

```js
auth.linkTwitter();
```

#### linkDiscord

`linkDiscord() => void`

The `linkDiscord` method redirects the user to the Discord OAuth flow to link their Discord account to the Auth Hub.

```js
auth.linkDiscord();
```

#### linkSpotify

`linkSpotify() => void`

The `linkSpotify` method redirects the user to the Spotify OAuth flow to link their Spotify account to the Auth Hub.

```js
auth.linkSpotify();
```

#### unlinkTwitter

`unlinkTwitter() => Promise<void>`

The `unlinkTwitter` method unlinks the user's Twitter account from the Auth Hub.

```js
await auth.unlinkTwitter();
```

#### unlinkDiscord

`unlinkDiscord() => Promise<void>`

The `unlinkDiscord` method unlinks the user's Discord account from the Auth Hub.

```js
await auth.unlinkDiscord();
```

#### unlinkSpotify

`unlinkSpotify() => Promise<void>`

The `unlinkSpotify` method unlinks the user's Spotify account from the Auth Hub.

```js
await auth.unlinkSpotify();
```

# React

The React components and hooks can be imported as ES6 modules. The example below shows how to set up the `CampProvider` component and subsequently use the provided hooks and components.

```js
// main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { CampProvider } from "@campnetwork/sdk/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App.jsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <CampProvider apiKey="your-api-key" clientId="your-client-id">
        <App />
      </CampProvider>
    </QueryClientProvider>
  </StrictMode>
);
```

## Usage with Vite

If you are using Vite, you need to edit your `vite.config.js` file to include the following configuration:

```js
// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: ['react', 'react-dom'],
    },
  },
  optimizeDeps: {
    include: [
      '@walletconnect/ethereum-provider',
    ],
  }
});
```

We need to include the `@walletconnect/ethereum-provider` package in the `optimizeDeps` configuration in order to tell Vite to pre-bundle the package.

## CampModal

![@campnetwork/sdk](https://imgur.com/n9o0rJ3.png)

The **CampModal** is a one-line\* solution for authenticating users with the Camp SDK. It can be used to connect users to the Auth Hub and link and unlink social accounts.

It works as follows:

The **CampModal** component displays a button with the text "**Connect**" that the user can click on in order to summon the modal. The modal shows a list of available providers that the user can select from. After a provider has been selected, the `connect` method is called on the Auth instance to authenticate the user.

If the user is already authenticated, the button will instead say "**My Camp**" and the modal will display the user's Camp profile information and allow them to link and unlink social accounts.

The **CampModal** can take two props:

- `wcProjectId` - `string` - The WalletConnect project ID to use for authentication. Allows the users to authenticate via WalletConnect.
- `injectButton` - `boolean` - Whether to inject the button into the DOM or not. Defaults to `true`. If set to `false`, the button will not be rendered and the modal can be opened programmatically via the `openModal` function returned by the `useModal` hook.

### Usage

```jsx
import { CampModal } from "@campnetwork/sdk/react/auth";

function App() {
  return (
    <div>
      <CampModal />
    </div>
  );
}
```

Users can authenticate either via the Camp Modal as outlined above or programmatically by calling the `connect` method on the Auth instance.

After the user has authenticated, you can use the provided hooks to fetch user data and listen for events.

## Hooks

### useAuth

The `useAuth` hook returns the instance of the Auth class that is provided by the CampProvider.
It can be used as outlined in the Core section in order to build custom authentication flows, listen for events, and fetch user data.

```jsx
import { useAuth } from "@campnetwork/sdk/react/auth";

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
import { useAuthState } from "@campnetwork/sdk/react/auth";

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
import { useProvider } from "@campnetwork/sdk/react/auth";

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
import { useProviders, useAuth } from "@campnetwork/sdk/react/auth";

function App() {
  const providers = useProviders();
  const auth = useAuth();

  return (
    <div>
      {providers.map((provider) => (
        <button
          key={provider.info.name}
          onClick={() => auth.setProvider(provider)}
        >
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
import { useConnect, useAuthState } from "@campnetwork/sdk/react/auth";

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
import { useSocials } from "@campnetwork/sdk/react/auth";

function App() {
  const { data, error, loading } = useSocials();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <div>Twitter: {data.twitter ? "Linked" : "Not linked"}</div>
      <div>Discord: {data.discord ? "Linked" : "Not linked"}</div>
      <div>Spotify: {data.spotify ? "Linked" : "Not linked"}</div>
    </div>
  );
}
```

### useModal

The `useModal` hook returns the state of the Auth and My Camp modals, as well as functions to show and hide them.

**Note: The `<CampModal/>` component must be rendered in the component tree for the modals to be displayed.**

```jsx
import { useModal, CampModal } from "@campnetwork/sdk/react/auth";

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

The state and functions returned by the `useModal` hook can be used to show and hide the Auth and My Camp modals, as well as to check if they are currently open. The modal being controlled is dictated by the user's authentication state.

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
npm link
```

Then, in the project you want to use the sdk in, run:

```bash
npm link @campnetwork/sdk
```

This will link the local sdk to the project.
