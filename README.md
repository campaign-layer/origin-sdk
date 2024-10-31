# camp sdk

### commonjs

```js
const { TwitterAPI } = require("camp-sdk");

const twitter = new TwitterAPI({
  apiKey: "your-api-key",
  clientId: "your-client-id",
});
```

### es6

```js
import { TwitterAPI } from "camp-sdk";

const twitter = new TwitterAPI({
  apiKey: "your-api-key",
  clientId: "your-client-id",
});

twitter.fetchUserByUsername("andithemudkip").then((data) => {
  console.log(data);
});
```

### react

```js
// main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { CampProvider } from "camp-sdk/react";
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

```js
// App.jsx
import { useGetUserByUsername } from "camp-sdk/react/twitter";
function App() {
  const { data, isLoading, error } = useGetUserByUsername("andithemudkip");
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  return <div>{JSON.stringify(data)}</div>;
}
export default App;
```


## building for commonjs

```bash
npm run build
```