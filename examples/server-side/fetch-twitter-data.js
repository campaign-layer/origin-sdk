// Full list of methods: https://github.com/campaign-layer/camp-sdk#methods

import { TwitterAPI } from "@campnetwork/sdk";

// Create a new TwitterAPI instance
const api = new TwitterAPI({
  apiKey: process.env.CAMP_API_KEY,
});

// Fetch a user by username
api.fetchUserByUsername(username).then((user) => {
  console.log(user);
});

// Fetch a user by wallet address
api.fetchUserByWalletAddress(walletAddress).then((user) => {
  console.log(user);
});
