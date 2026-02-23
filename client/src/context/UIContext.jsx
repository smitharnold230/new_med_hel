import { createContext, useState, useContext } from 'react';

const UIContext = createContext();

export const useUI = () => {
    const context = useContext(UIContext);
    if (!context) {
        throw new Error('useUI must be used within UIProvider');
    }
    return context;
};

export const UIProvider = ({ children }) => {
    const [showLogger, setShowLogger] = useState(false);
    const [showSafetyCheck, setShowSafetyCheck] = useState(false);

    const openLogger = () => setShowLogger(true);
    const closeLogger = () => setShowLogger(false);

    const openSafetyCheck = () => setShowSafetyCheck(true);
    const closeSafetyCheck = () => setShowSafetyCheck(false);

    const value = {
        showLogger,
        openLogger,
        closeLogger,
        showSafetyCheck,
        openSafetyCheck,
        closeSafetyCheck
    };

    return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
};
