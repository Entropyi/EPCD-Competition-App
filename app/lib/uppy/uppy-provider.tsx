"use client";
import React, {createContext, useContext, ReactNode, useState} from "react";
import Uppy from "@uppy/core";


interface AppContextProps {
    uppy: Uppy;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

interface AppProviderProps {
    children: ReactNode;
}

export const UppyProvider: React.FC<AppProviderProps> = ({children}) => {
    const [uppy] = useState(() =>
        new Uppy()
    );

    uppy.on("file-added", (file) => {
        file.meta = {
            ...file.meta,
            objectName: file.name,
            contentType: file.type,
        };
    });

    return (
        <AppContext.Provider value={{uppy}}>{children}</AppContext.Provider>
    );
};

export const useUppy = () => {
    const context = useContext(AppContext);

    if (!context) {
        throw new Error("useAppContext must be used within an AppProvider");
    }

    return context;
};