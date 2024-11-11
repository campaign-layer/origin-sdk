# Camp SDK

The camp-sdk currently exposes the following modules:
`"camp-sdk"` - The main entry point for the SDK, exposes the TwitterAPI class and the Auth class
`"camp-sdk/react"` - Exposes the CampProvider and CampConext for use in React applications
`"camp-sdk/react/auth"` - Exposes React hooks for authentication and fetching user data via the Camp Auth Hub

# Core

The core modules can be imported either as a CommonJS module or as an ES6 module. The examples below show how to import and instantiate the TwitterAPI class using both methods.

### CommonJS

```js
const { TwitterAPI } = require("camp-sdk");

const twitter = new TwitterAPI({
  apiKey,
});
```

### ES6

```js
import { TwitterAPI } from "camp-sdk";

const twitter = new TwitterAPI({
  apiKey,
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

`clientId` - The client ID of your app. This is required to authenticate users with the Camp SDK.
`redirectUri` - The the URI to redirect to after the user completes oauth for any of the socials. Defaults to `window.location.href`.

```js
import { Auth } from "camp-sdk";

const auth = new Auth({
  clientId: string,
  redirectUri: string,
});
```

### Methods

#### connect

`connect() => void`

The `connect` method prompts the user to sign a message with their wallet in order to authenticate with the Camp SDK.
The wallet provider can be set by by calling the `setProvider` method on the Auth instance beforehand. The default provider used is `window.ethereum`.

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

##### "auth"

Possible states:

- `authenticated` - The user has successfully authenticated.
- `unauthenticated` - The user has been logged out.
- `loading` - The user is in the process of authenticating.

```js
auth.on("auth", (data) => {
  console.log(data); // "authenticated" | "unauthenticated" | "loading"
});
```

##### "provider"

Returns the provider that has been set via the `setProvider` method.
If using the Camp SDK React components, this event is emitted when the user selects a provider i the Auth modal.

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
```

---

After the user has authenticated, the following methods can be used to link and unlink social accounts.
When linking a social account, the user will be redirected to the OAuth flow for that social platform.
Afterwards, the user will be redirected back to the `redirectUri` specified in the Auth constructor.

#### linkTwitter

`linkTwitter() => void`

The `linkTwitter` method redirects the user to the Twitter OAuth flow to link their Twitter account to the Camp SDK.

```js
auth.linkTwitter();
```

#### linkDiscord

`linkDiscord() => void`

The `linkDiscord` method redirects the user to the Discord OAuth flow to link their Discord account to the Camp SDK.

```js
auth.linkDiscord();
```

#### linkSpotify

`linkSpotify() => void`

The `linkSpotify` method redirects the user to the Spotify OAuth flow to link their Spotify account to the Camp SDK.

```js
auth.linkSpotify();
```

#### unlinkTwitter

`unlinkTwitter() => Promise<void>`

The `unlinkTwitter` method unlinks the user's Twitter account from the Camp SDK.

```js
await auth.unlinkTwitter();
```

#### unlinkDiscord

`unlinkDiscord() => Promise<void>`

The `unlinkDiscord` method unlinks the user's Discord account from the Camp SDK.

```js
await auth.unlinkDiscord();
```

#### unlinkSpotify

`unlinkSpotify() => Promise<void>`

The `unlinkSpotify` method unlinks the user's Spotify account from the Camp SDK.

```js
await auth.unlinkSpotify();
```

# React

# Building

To build the SDK, run the following command:

```bash
npm run build
```

This will generate the SDK in the `dist` folder.
You can also run the following command to watch for changes and rebuild the SDK automatically:

```bash
npm run dev
```
