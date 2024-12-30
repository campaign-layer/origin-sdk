let providers = [];

export const providerStore = {
  value: () => providers,
  subscribe: (callback) => {
    function onAnnouncement(event) {
      if (providers.some((p) => p.info.uuid === event.detail.info.uuid)) return;

      providers = [...providers, event.detail];
      callback(providers);
    }
    if (typeof window === "undefined") return;
    window.addEventListener("eip6963:announceProvider", onAnnouncement);
    window.dispatchEvent(new Event("eip6963:requestProvider"));

    return () =>
      window.removeEventListener("eip6963:announceProvider", onAnnouncement);
  },
};
