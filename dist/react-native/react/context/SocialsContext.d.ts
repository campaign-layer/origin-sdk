import React, { ReactNode } from "react";
import { UseQueryResult } from "@tanstack/react-query";
interface SocialsContextProps {
    query: UseQueryResult<any, unknown> | null;
}
export declare const SocialsContext: React.Context<SocialsContextProps>;
interface SocialsProviderProps {
    children: ReactNode;
}
export declare const SocialsProvider: ({ children }: SocialsProviderProps) => React.JSX.Element;
export {};
