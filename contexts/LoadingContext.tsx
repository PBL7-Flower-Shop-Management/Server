"use client";
import Loading from "@/components/Loading/Loading";
import React, { createContext, useContext, useEffect, useState } from "react";

const LoadingContext = createContext<any>(undefined);

export const LoadingProvider = ({ children }: any) => {
    const [loading, setLoading] = useState(false);
    // useEffect(() => console.log(loading), [loading]);
    return (
        <LoadingContext.Provider value={{ loading, setLoading }}>
            <Loading isShow={loading} />
            {children}
        </LoadingContext.Provider>
    );
};

export const useLoadingContext = () => {
    return useContext(LoadingContext);
};
