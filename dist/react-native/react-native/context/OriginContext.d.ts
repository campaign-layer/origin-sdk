import React, { ReactNode } from "react";
import { UseQueryResult } from "@tanstack/react-query";
interface OriginContextType {
    statsQuery: UseQueryResult<any, Error>;
    uploadsQuery: UseQueryResult<any, Error>;
}
declare const OriginContext: React.Context<OriginContextType | null>;
interface OriginProviderProps {
    children: ReactNode;
}
declare const OriginProvider: ({ children }: OriginProviderProps) => React.JSX.Element;
export { OriginContext, OriginProvider };
