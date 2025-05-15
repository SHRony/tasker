import React, { createContext, useContext } from 'react';

interface RecordsContextType {
    getRecords: (key: string) => string | undefined;
}

const RecordsContext = createContext<RecordsContextType | undefined>(undefined);

export const RecordsProvider: React.FC<{
    children: React.ReactNode;
    getRecords: (key: string) => string | undefined;
}> = ({ children, getRecords }) => {
    return (
        <RecordsContext.Provider value={{ getRecords }}>
            {children}
        </RecordsContext.Provider>
    );
};

export const useRecords = () => {
    const context = useContext(RecordsContext);
    if (context === undefined) {
        throw new Error('useRecords must be used within a RecordsProvider');
    }
    return context;
}; 