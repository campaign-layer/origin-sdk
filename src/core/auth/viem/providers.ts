export interface Provider {
  info: {
    uuid: string;
    name?: string;
    icon?: string;
  };
  provider: any;
}

let providers: Provider[] = [];

export const providerStore = {
  value: (): Provider[] => providers,
  subscribe: (callback: (providers: Provider[]) => void): (() => void) | undefined => {
    function onAnnouncement(event: CustomEvent<Provider>) {
      if (providers.some((p) => p.info.uuid === event.detail.info.uuid)) return;

      providers = [...providers, event.detail];
      callback(providers);
    }
    if (typeof window === "undefined") return;
    window.addEventListener("eip6963:announceProvider", onAnnouncement as EventListener);
    window.dispatchEvent(new Event("eip6963:requestProvider"));

    return () =>
      window.removeEventListener("eip6963:announceProvider", onAnnouncement as EventListener);
  },
};
