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
  apiKey
});
```

### ES6

```js
import { TwitterAPI } from "camp-sdk";

const twitter = new TwitterAPI({
  apiKey
});
```

## TwitterAPI

The TwitterAPI class is the entry point for fetching data from the Twitter API. It requires an API key to be instantiated.

### Methods

#### 

# React



# Building

To build the SDK, run the following command:

```bash
npm run build
```

This will generate the SDK in the `dist` folder.
You can also run the following command to watch for changes and rebuild the SDK:

```bash
npm run dev
```
