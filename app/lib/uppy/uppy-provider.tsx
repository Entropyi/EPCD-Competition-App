"use client";
import React, { createContext, useContext, ReactNode, useState } from "react";
import Uppy from "@uppy/core";


// Define the shape of your context
interface AppContextProps {
    // Add your global state properties here
    uppy: Uppy;
}

// Create the initial context with default values
const AppContext = createContext<AppContextProps | undefined>(undefined);

// Create a context provider component
interface AppProviderProps {
    children: ReactNode;
}

export const UppyProvider: React.FC<AppProviderProps> = ({ children }) => {
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

    // Provide the context value to the components
    return (
        <AppContext.Provider value={{ uppy }}>{children}</AppContext.Provider>
    );
};

// Custom hook for using the context
export const useUppy = () => {
    const context = useContext(AppContext);

    if (!context) {
        throw new Error("useAppContext must be used within an AppProvider");
    }

    return context;
};