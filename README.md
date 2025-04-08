<p align="center">
<img src="https://imgur.com/7nLZezD.png" height="200px"/>
</p>
<br/>

<p align="center">
  <a href="https://www.npmjs.com/package/@campnetwork/sdk"><img src="https://img.shields.io/npm/v/@campnetwork/sdk?style=for-the-badge" alt="npm version"/></a>
  <img alt="GitHub License" src="https://img.shields.io/github/license/campaign-layer/camp-sdk?style=for-the-badge">
  <img src="https://img.shields.io/npm/last-update/%40campnetwork%2Fsdk?style=for-the-badge" alt="npm last update"/>
  <img alt="NPM Downloads" src="https://img.shields.io/npm/d18m/%40campnetwork%2Fsdk?style=for-the-badge">
</p>

# Origin SDK

The Origin SDK currently exposes the following modules:

- `"@campnetwork/sdk"` - The main entry point for the SDK, exposes the following classes:
  - `TwitterAPI` - For fetching user Twitter data from the Auth Hub
  - `SpotifyAPI` - For fetching user Spotify data from the Auth Hub
  - `Auth` - For authenticating users with the Origin SDK
- `"@campnetwork/sdk/react"` - Exposes the CampProvider and CampContext, as well as React components and hooks for authentication and fetching user data via the Camp Auth Hub

# Installation

```bash
npm install @campnetwork/sdk
```

# Core

The core modules can be imported either as a CommonJS module or as an ES6 module.

### CommonJS

```js
const { TwitterAPI, SpotifyAPI, Auth } = require("@campnetwork/sdk");
```

### ES6

```js
import { TwitterAPI, SpotifyAPI, Auth } from "@campnetwork/sdk";
```

## Socials

### TwitterAPI

The TwitterAPI class is the entry point for fetching user Twitter data from the Auth Hub. It requires an API key to be instantiated.

**Note: The methods for fetching data will only return data for users who have authenticated to your app via the Origin SDK.**

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

### SpotifyAPI

The SpotifyAPI class is the entry point for fetching user Spotify data from the Auth Hub. It requires an API key to be instantiated.

**Note: The methods for fetching data will only return data for users who have authenticated to your app via the Origin SDK.**

#### Constructor

`apiKey` - The API key of your app.

```js
const spotify = new SpotifyAPI({
  apiKey: string,
});
```

#### Methods

##### fetchSavedTracksById

`fetchSavedTracksById(spotifyId: string)`

```js
const savedTracks = await spotify.fetchSavedTracksById("1234567890");
```

##### fetchPlayedTracksById

`fetchPlayedTracksById(spotifyId: string)`

```js
const playedTracks = await spotify.fetchPlayedTracksById("1234567890");
```

##### fetchSavedAlbumsById

`fetchSavedAlbumsById(spotifyId: string)`

```js
const savedAlbums = await spotify.fetchSavedAlbumsById("1234567890");
```

##### fetchSavedPlaylistsById

`fetchSavedPlaylistsById(spotifyId: string)`

```js
const savedPlaylists = await spotify.fetchSavedPlaylistsById("1234567890");
```

##### fetchTracksInAlbum

`fetchTracksInAlbum(spotifyId: string, albumId: string)`

```js
const tracks = await spotify.fetchTracksInAlbum("1234567890", "1234567890");
```

##### fetchTracksInPlaylist

`fetchTracksInPlaylist(spotifyId: string, playlistId: string)`

```js
const tracks = await spotify.fetchTracksInPlaylist("1234567890", "1234567890");
```

##### fetchUserByWalletAddress

`fetchUserByWalletAddress(walletAddress: string)`

```js
const user = await spotify.fetchUserByWalletAddress("0x1234567890");
```

### TikTokAPI

The TikTokAPI class is the entry point for fetching user TikTok data from the Auth Hub. It requires an API key to be instantiated.

**Note: The methods for fetching data will only return data for users who have authenticated to your app via the Origin SDK.**

#### Constructor

`apiKey` - The API key of your app.

```js
const tiktok = new TikTokAPI({
  apiKey: string,
});
```

#### Methods

##### fetchUserByUsername

`fetchUserByUsername(tiktokUserName: string)`

```js
const user = await tiktok.fetchUserByUsername("jack");
```

##### fetchVideoById

`fetchVideoById(userHandle: string, videoId: string)`

```js
const video = await tiktok.fetchVideo("jack", "1234567890");
```

## Auth

The Auth class is the entry point for authenticating users with the Origin SDK. It requires a clientId to be instantiated.

**Note: The Auth class is only to be used on the client side.**

### Constructor

- `clientId` - The client ID of your app. This is required to authenticate users with the Origin SDK.
- `redirectUri` - The URI to redirect to after the user completes oauth for any of the socials. Defaults to `window.location.href`.
  The `redirectUri` can also be an object with the following optional properties:
  - `twitter` - The URI to redirect to after the user completes oauth for Twitter.
  - `discord` - The URI to redirect to after the user completes oauth for Discord.
  - `spotify` - The URI to redirect to after the user completes oauth for Spotify.
- `allowAnalytics` - Whether to allow analytics to be collected. Defaults to `true`.

You may use the `redirectUri` object to redirect the user to different pages based on the social they are linking.
You may only define the URIs for the socials you are using, the rest will default to `window.location.href`.

```js
import { Auth } from "@campnetwork/sdk";

const auth = new Auth({
  clientId: string,
  redirectUri: string | object,
  allowAnalytics: boolean,
});
```

```js
const auth = new Auth({
  clientId: "your-client-id",
  redirectUri: {
    twitter: "https://your-website.com/twitter",
    discord: "https://your-website.com/discord",
    spotify: "https://your-website.com/spotify",
  },
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

`setProvider(provider: { provider: EIP1193Provider, info: EIP6963ProviderInfo }) => void`

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

#### linkTikTok

`linkTikTok(handle: string) => Promise<void>`

The `linkTikTok` method links the provided TikTok handle to the Auth Hub.

```js
auth.linkTikTok("tiktokhandle");
```

#### sendTelegramOTP

`sendTelegramOTP(phoneNumber: string) => Promise<void>`
The `sendTelegramOTP` method sends an OTP to the provided phone number via Telegram. The OTP can be used via the `linkTelegram` method to link the user's Telegram account to the Auth Hub.

```js
const { phone_code_hash } = await auth.sendTelegramOTP("+1234567890");
```

#### linkTelegram

`linkTelegram(phoneNumber: string, otp: string, phoneCodeHash: string) => Promise<void>`

The `linkTelegram` method links the provided phone number to the Auth Hub using the OTP and phone code hash received from the `sendTelegramOTP` method.

```js
await auth.linkTelegram("+1234567890", "123456", "abc123");
```

---

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

#### unlinkTikTok

`unlinkTikTok() => Promise<void>`

The `unlinkTikTok` method unlinks the user's TikTok account from the Auth Hub.

```js
await auth.unlinkTikTok();
```

#### unlinkTelegram

`unlinkTelegram() => Promise<void>`
The `unlinkTelegram` method unlinks the user's Telegram account from the Auth Hub.

```js
await auth.unlinkTelegram();
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
      <CampProvider clientId="your-client-id">
        <App />
      </CampProvider>
    </QueryClientProvider>
  </StrictMode>
);
```

## CampProvider

The `CampProvider` component requires a `clientId` prop to be passed in order link the users to your app.
It can also take the following optional props:

- `redirectUri` - `string | object` - Either a string that will be used as the redirect URI for all socials, or an object with the following optional properties: `twitter`, `discord`, `spotify`. This is used to redirect the user to different pages after they have completed the OAuth flow for a social.

```jsx
import { CampProvider } from "@campnetwork/sdk/react";
// ...
function App() {
  return (
    <CampProvider
      clientId="your-client-id"
      redirectUri="https://your-website.com"
    >
      <div>Your app</div>
    </CampProvider>
  );
}
```

Or, with an object for the `redirectUri`:

```jsx
import { CampProvider } from "@campnetwork/sdk/react";
// ...
function App() {
  return (
    <CampProvider
      clientId="your-client-id"
      redirectUri={{
        twitter: "https://your-website.com/twitter",
        discord: "https://your-website.com/discord",
        spotify: "https://your-website.com/spotify",
      }}
    >
      <div>Your app</div>
    </CampProvider>
  );
}
```

The `CampProvider` component sets up the context for the Origin SDK and provides the Auth instance to the rest of the app.

## CampModal

![@campnetwork/sdk](https://imgur.com/n9o0rJ3.png)

The **CampModal** is a one-line\* solution for authenticating users with the Origin SDK. It can be used to connect users to the Auth Hub and link and unlink social accounts.

It works as follows:

The **CampModal** component displays a button with the text "**Connect**" that the user can click on in order to summon the modal. The modal shows a list of available providers that the user can select from. After a provider has been selected, the `connect` method is called on the Auth instance to authenticate the user.

If the user is already authenticated, the button will instead say "**My Camp**" and the modal will display the user's Camp profile information and allow them to link and unlink social accounts.

The **CampModal** can take the following props:

- `wcProjectId` - `string` - The WalletConnect project ID to use for authentication. Allows the users to authenticate via WalletConnect.
- `injectButton` - `boolean` - Whether to inject the button into the DOM or not. Defaults to `true`. If set to `false`, the button will not be rendered and the modal can be opened programmatically via the `openModal` function returned by the `useModal` hook.
- `onlyWagmi` - `boolean` - Whether to only show the provider that the user is currently authenticated with. Defaults to `false`.
- `defaultProvider` - `{ provider: EIP1193Provider, info: EIP6963ProviderInfo, exclusive: boolean }` - Custom provider to set as the highlighted provider in the modal. If not set, the wagmi provider will be highlighted if it is available. The `exclusive` property can be set to `true` to only show this provider in the modal.
- `allowAnalytics` - `boolean` - Whether to allow analytics to be collected. Defaults to `true`.

### Usage

Basic usage of the **CampModal** component:

```jsx
import { CampModal } from "@campnetwork/sdk/react";

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
import { CampModal } from "@campnetwork/sdk/react";

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
import { CampModal } from "@campnetwork/sdk/react";

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

The Camp Modal can be used in conjunction with providers such as Privy and Appkit to create a seamless authentication experience for users. When using wagmi, it will automatically detect if the user is authenticated via a third party provider and give them the option to connect to the Auth Hub using that provider. Otherwise, you can set up the default provider to be whatever provider you are using.

[Example usage with Privy](./examples/client-side/react/privy-connector/)

[Example usage with Appkit](./examples/client-side/react/appkit-connector/)

[Example usage with magic.link](./examples/client-side/react/magic-link-connector/)

After the user has authenticated, you can use the provided hooks to fetch user data and listen for events.

## LinkButton

The **LinkButton** component is a button that can be used to link and unlink social accounts. Under the hood it uses the `useLinkModal` hook to open the Link Socials modal.

The **LinkButton** can take the following props:

- `social` - `string` - The social account to link or unlink. Can be one of: `twitter`, `discord`, `spotify`.
- `variant` - `string` - The variant of the button. Can be one of: `default`, `icon`. Defaults to `default`.
- `theme` - `string` - The theme of the button. Can be one of: `default`, `camp`. Defaults to `default`.

**Note: The `<CampModal/>` component must be rendered in the component tree for the buttons to work.**

### Usage

Basic usage of the **LinkButton** component:

```jsx
import { LinkButton, CampModal } from "@campnetwork/sdk/react";

function App() {
  return (
    <div>
      <CampModal />
      <LinkButton social="twitter" />
      <LinkButton social="discord" variant="icon" />
      <LinkButton social="spotify" theme="camp" />
      <LinkButton social="tiktok" variant="icon" theme="camp" />
      <LinkButton social="telegram" />
    </div>
  );
}
```

## Hooks

### useAuth

The `useAuth` hook returns the instance of the Auth class that is provided by the CampProvider.
It can be used as outlined in the Core section in order to build custom authentication flows, listen for events, and fetch user data.

```jsx
import { useAuth } from "@campnetwork/sdk/react";

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
import { useAuthState } from "@campnetwork/sdk/react";

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
import { useProvider } from "@campnetwork/sdk/react";

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
import { useProviders, useProvider } from "@campnetwork/sdk/react";

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
import { useConnect, useAuthState } from "@campnetwork/sdk/react";

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
import { useSocials } from "@campnetwork/sdk/react";

function App() {
  const { data, error, isLoading } = useSocials();

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

### useLinkSocials

The `useLinkSocials` hook returns functions that can be used to link and unlink social accounts.

```jsx
import { useLinkSocials } from "@campnetwork/sdk/react";

function App() {
  const {
    linkTwitter,
    linkDiscord,
    linkSpotify,
    linkTiktok,
    linkTelegram,
    sendTelegramOTP,
    unlinkTwitter,
    unlinkDiscord,
    unlinkSpotify,
    unlinkTiktok,
    unlinkTelegram,
  } = useLinkSocials();

  return (
    <div>
      <button onClick={linkTwitter}>Link Twitter</button>
      <button onClick={linkDiscord}>Link Discord</button>
      <button onClick={linkSpotify}>Link Spotify</button>
      <button onClick={() => linkTiktok("tiktokhandle")}>Link TikTok</button>
      <button onClick={() => sendTelegramOTP("+1234567890")}>
        Send Telegram OTP
      </button>
      <button onClick={() => linkTelegram("+1234567890", "123456", "abc123")}>
        Link Telegram
      </button>
      <button onClick={unlinkTwitter}>Unlink Twitter</button>
      <button onClick={unlinkDiscord}>Unlink Discord</button>
      <button onClick={unlinkSpotify}>Unlink Spotify</button>
      <button onClick={unlinkTiktok}>Unlink TikTok</button>
      <button onClick={unlinkTelegram}>Unlink Telegram</button>
    </div>
  );
}
```

### useModal

The `useModal` hook returns the state of the Auth and My Camp modals, as well as functions to show and hide them.

**Note: The `<CampModal/>` component must be rendered in the component tree for the modals to be displayed.**

```jsx
import { useModal, CampModal } from "@campnetwork/sdk/react";

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

### useLinkModal

The `useLinkModal` hook returns the state of the Link Socials modal, as well as functions to show and hide it.

**Note: The `<CampModal/>` component must be rendered in the component tree for the modal to be displayed.**

```jsx
import { useLinkModal, CampModal } from "@campnetwork/sdk/react";

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
- `openDiscordModal` - `() => void`
- `openSpotifyModal` - `() => void`
- `openTiktokModal` - `() => void`
- `openTelegramModal` - `() => void`
- `linkTwitter` - `() => void`
- `linkDiscord` - `() => void`
- `linkSpotify` - `() => void`
- `linkTiktok` - `() => void`
- `linkTelegram` - `() => void`
- `unlinkTwitter` - `() => void`
- `unlinkDiscord` - `() => void`
- `unlinkSpotify` - `() => void`
- `unlinkTiktok` - `() => void`
- `unlinkTelegram` - `() => void`
- `closeModal` - `() => void`

The difference between the `openXModal` functions and the `linkX / unlinkX` functions is that the former opens the modal regardless of the user's linking state, allowing them to either link or unlink their account, while the latter only opens the specified modal if the user's linking state allows for it.

For example, if the user is linked to Twitter, calling `openTwitterModal` will open the modal to _unlink_ their Twitter account, while calling `linkTwitter` will not do anything, and calling `unlinkTwitter` will open the modal to unlink their Twitter account.

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
