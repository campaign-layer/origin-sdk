import { _ as __awaiter } from '../tslib.es6.js';
import React, { createContext, useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CampContext } from './CampContext.js';
import '../AuthRN.js';
import 'viem/siwe';
import 'viem';
import '../../errors';
import 'viem/accounts';
import '../storage.js';

const OriginContext = createContext(null);
const OriginProvider = ({ children }) => {
    const { auth } = useContext(CampContext);
    const statsQuery = useQuery({
        queryKey: ["origin-stats", auth === null || auth === void 0 ? void 0 : auth.userId],
        queryFn: () => __awaiter(void 0, void 0, void 0, function* () {
            if (!(auth === null || auth === void 0 ? void 0 : auth.isAuthenticated) || !(auth === null || auth === void 0 ? void 0 : auth.origin)) {
                return null;
            }
            return yield auth.origin.getOriginUsage();
        }),
        enabled: !!(auth === null || auth === void 0 ? void 0 : auth.isAuthenticated) && !!(auth === null || auth === void 0 ? void 0 : auth.origin),
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
    });
    const uploadsQuery = useQuery({
        queryKey: ["origin-uploads", auth === null || auth === void 0 ? void 0 : auth.userId],
        queryFn: () => __awaiter(void 0, void 0, void 0, function* () {
            if (!(auth === null || auth === void 0 ? void 0 : auth.isAuthenticated) || !(auth === null || auth === void 0 ? void 0 : auth.origin)) {
                return [];
            }
            return yield auth.origin.getOriginUploads();
        }),
        enabled: !!(auth === null || auth === void 0 ? void 0 : auth.isAuthenticated) && !!(auth === null || auth === void 0 ? void 0 : auth.origin),
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
    });
    return (React.createElement(OriginContext.Provider, { value: { statsQuery, uploadsQuery } }, children));
};

export { OriginContext, OriginProvider };
