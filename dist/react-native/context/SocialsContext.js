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

const SocialsContext = createContext(null);
const SocialsProvider = ({ children }) => {
    const { auth } = useContext(CampContext);
    const query = useQuery({
        queryKey: ["socials", auth === null || auth === void 0 ? void 0 : auth.userId],
        queryFn: () => __awaiter(void 0, void 0, void 0, function* () {
            if (!(auth === null || auth === void 0 ? void 0 : auth.isAuthenticated)) {
                return {};
            }
            return yield auth.getLinkedSocials();
        }),
        enabled: !!(auth === null || auth === void 0 ? void 0 : auth.isAuthenticated),
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchOnWindowFocus: false,
    });
    return (React.createElement(SocialsContext.Provider, { value: { query } }, children));
};

export { SocialsContext, SocialsProvider };
