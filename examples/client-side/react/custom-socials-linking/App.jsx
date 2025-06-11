import {
  CampModal,
  useAuthState,
  useLinkSocials,
  useSocials,
} from "@campnetwork/origin/react";

function App() {
  const { authenticated, loading } = useAuthState();
  const { linkTwitter, unlinkTwitter } = useLinkSocials();
  const {
    data: socials,
    error: socialsError,
    isLoading: socialsLoading,
    refetch: refetchSocials,
  } = useSocials();

  // refetch the socials after unlinking
  const handleUnlinkTwitter = async () => {
    try {
      await unlinkTwitter();
      refetchSocials();
    } catch (error) {
      console.error(error);
    }
  };
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
                <button onClick={handleUnlinkTwitter}>Unlink Twitter</button>
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
