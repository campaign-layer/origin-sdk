import {
  CampModal,
  useAuthState,
  useLinkSocials,
  useSocials,
} from "@campnetwork/sdk/react/auth";

function App() {
  const { authenticated, loading } = useAuthState();
  const { linkTwitter, unlinkTwitter } = useLinkSocials();
  const {
    data: socials,
    error: socialsError,
    loading: socialsLoading,
  } = useSocials();
  return (
    <div>
      <CampModal />
      {loading && <p>Loading...</p>}
      {authenticated && (
        <div>
          <p>Authenticated</p>
          {socialsLoading && <p>Loading socials...</p>}
          {socialsError && <p>Error loading socials: {socialsError.message}</p>}
          {socials && (
            <div>
              <p>Twitter: {socials.twitter ? "Linked" : "Not linked"}</p>
              {socials.twitter ? (
                <button onClick={unlinkTwitter}>Unlink Twitter</button>
              ) : (
                <button onClick={linkTwitter}>Link Twitter</button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
