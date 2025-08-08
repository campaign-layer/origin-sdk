'use strict';

var React = require('react');
var AuthRN = require('../auth/AuthRN.js');

/**
 * CampContext for React Native
 */
const CampContext = React.createContext({
    auth: null,
    setAuth: () => { },
    clientId: "",
});
const CampProvider = ({ children, clientId, redirectUri }) => {
    const [auth, setAuth] = React.useState(null);
    React.useEffect(() => {
        if (!clientId) {
            console.error("CampProvider: clientId is required");
            return;
        }
        try {
            const authInstance = new AuthRN.AuthRN({ clientId, redirectUri });
            setAuth(authInstance);
        }
        catch (error) {
            console.error("Failed to create AuthRN instance:", error);
        }
    }, [clientId, redirectUri]);
    return (React.createElement(CampContext.Provider, { value: {
            auth,
            setAuth,
            clientId,
        } }, children));
};

exports.CampContext = CampContext;
exports.CampProvider = CampProvider;
