'use strict';

var tslib_es6 = require('../node_modules/tslib/tslib.es6.js');
var React = require('react');
var reactQuery = require('@tanstack/react-query');
var CampContext = require('./CampContext.js');

const SocialsContext = React.createContext(null);
const SocialsProvider = ({ children }) => {
    const { auth } = React.useContext(CampContext.CampContext);
    const query = reactQuery.useQuery({
        queryKey: ["socials", auth === null || auth === void 0 ? void 0 : auth.userId],
        queryFn: () => tslib_es6.__awaiter(void 0, void 0, void 0, function* () {
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

exports.SocialsContext = SocialsContext;
exports.SocialsProvider = SocialsProvider;
