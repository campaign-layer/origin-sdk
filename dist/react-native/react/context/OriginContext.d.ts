import React, { ReactNode } from "react";
import { UseQueryResult } from "@tanstack/react-query";
interface OriginContextProps {
    statsQuery: UseQueryResult<any, unknown> | null;
    uploadsQuery: UseQueryResult<any, unknown> | null;
}
export declare const OriginContext: React.Context<OriginContextProps>;
interface OriginProviderProps {
    children: ReactNode;
}
export declare const OriginProvider: ({ children }: OriginProviderProps) => React.JSX.Element;
export {};
