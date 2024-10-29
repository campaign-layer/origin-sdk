import React from 'react';
import { createContext } from 'react';

const TwitterContext = createContext({
    apiKey: ''
});

const TwitterProvider = ({ apiKey, children }) => {
    return (
        <TwitterContext.Provider value={{ apiKey }}>
            {children}
        </TwitterContext.Provider>
    );
}

export { TwitterContext, TwitterProvider };