export interface Provider {
    info: {
        uuid: string;
    };
    provider: any;
}
export declare const providerStore: {
    value: () => Provider[];
    subscribe: (callback: (providers: Provider[]) => void) => (() => void) | undefined;
};
