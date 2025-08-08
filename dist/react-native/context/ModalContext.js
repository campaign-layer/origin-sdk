'use strict';

var React = require('react');

const ModalContext = React.createContext({
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
    const [isVisible, setIsVisible] = React.useState(false);
    const [isLinkingVisible, setIsLinkingVisible] = React.useState(false);
    const [currentlyLinking, setCurrentlyLinking] = React.useState("");
    const [isButtonDisabled, setIsButtonDisabled] = React.useState(false);
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

exports.ModalContext = ModalContext;
exports.ModalProvider = ModalProvider;
