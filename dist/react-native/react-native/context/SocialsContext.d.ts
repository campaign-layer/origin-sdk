import React, { ReactNode } from "react";
import { UseQueryResult } from "@tanstack/react-query";
interface SocialsContextType {
    query: UseQueryResult<any, Error>;
}
declare const SocialsContext: React.Context<SocialsContextType | null>;
interface SocialsProviderProps {
    children: ReactNode;
}
declare const SocialsProvider: ({ children }: SocialsProviderProps) => React.JSX.Element;
export { SocialsContext, SocialsProvider };
