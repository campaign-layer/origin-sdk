import React, { createContext, useState } from 'react';

const ModalContext = createContext({
    isVisible: false,
    setIsVisible: () => { },
    isLinkingVisible: false,
    setIsLinkingVisible: () => { },
    currentlyLinking: "",
    setCurrentlyLinking: () => { },
    isButtonDisabled: false,
    setIsButtonDisabled: () => { },
});
const ModalProvider = ({ children }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isLinkingVisible, setIsLinkingVisible] = useState(false);
    const [currentlyLinking, setCurrentlyLinking] = useState("");
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    return (React.createElement(ModalContext.Provider, { value: {
            isVisible,
            setIsVisible,
            isLinkingVisible,
            setIsLinkingVisible,
            currentlyLinking,
            setCurrentlyLinking,
            isButtonDisabled,
            setIsButtonDisabled,
        } }, children));
};

export { ModalContext, ModalProvider };
