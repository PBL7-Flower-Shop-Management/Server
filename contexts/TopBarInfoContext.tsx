"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

const TopBarInfoContext = createContext<any>(undefined);

export const TopBarInfoProvider = ({ children }: any) => {
    const [userInfo, setUserInfo] = useState({});
    useEffect(() => console.log(userInfo), [userInfo]);
    return (
        <TopBarInfoContext.Provider value={{ userInfo, setUserInfo }}>
            {children}
        </TopBarInfoContext.Provider>
    );
};

export const useTopBarInfoContext = () => {
    return useContext(TopBarInfoContext);
};
