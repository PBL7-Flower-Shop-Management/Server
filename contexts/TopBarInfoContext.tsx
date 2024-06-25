"use client";
import { getCookiesItem, setCookiesItem } from "@/utils/auth";
import React, { createContext, useContext, useEffect, useState } from "react";

const TopBarInfoContext = createContext<any>(undefined);

export const TopBarInfoProvider = ({ children }: any) => {
    const [userInfo, setUserInfo] = useState<any>(null);
    useEffect(() => {
        if (userInfo) {
            setCookiesItem("name", userInfo.name);
            setCookiesItem("email", userInfo.email);
            setCookiesItem("avatarUrl", userInfo.avatarUrl);
        }
    }, [userInfo]);

    useEffect(() => {
        if (!userInfo) {
            const name = getCookiesItem("name");
            const email = getCookiesItem("email");
            const avatarUrl = getCookiesItem("avatarUrl");

            setUserInfo({ name, email, avatarUrl });
        }
    }, []);

    return (
        <TopBarInfoContext.Provider value={{ userInfo, setUserInfo }}>
            {children}
        </TopBarInfoContext.Provider>
    );
};

export const useTopBarInfoContext = () => {
    return useContext(TopBarInfoContext);
};
