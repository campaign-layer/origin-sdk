'use strict';

var tslib_es6 = require('../node_modules/tslib/tslib.es6.js');
var React = require('react');
var reactQuery = require('@tanstack/react-query');
var CampContext = require('./CampContext.js');

const OriginContext = React.createContext(null);
const OriginProvider = ({ children }) => {
    const { auth } = React.useContext(CampContext.CampContext);
    const statsQuery = reactQuery.useQuery({
        queryKey: ["origin-stats", auth === null || auth === void 0 ? void 0 : auth.userId],
        queryFn: () => tslib_es6.__awaiter(void 0, void 0, void 0, function* () {
            if (!(auth === null || auth === void 0 ? void 0 : auth.isAuthenticated) || !(auth === null || auth === void 0 ? void 0 : auth.origin)) {
                return null;
            }
            return yield auth.origin.getOriginUsage();
        }),
        enabled: !!(auth === null || auth === void 0 ? void 0 : auth.isAuthenticated) && !!(auth === null || auth === void 0 ? void 0 : auth.origin),
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
    });
    const uploadsQuery = reactQuery.useQuery({
        queryKey: ["origin-uploads", auth === null || auth === void 0 ? void 0 : auth.userId],
        queryFn: () => tslib_es6.__awaiter(void 0, void 0, void 0, function* () {
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

exports.OriginContext = OriginContext;
exports.OriginProvider = OriginProvider;
