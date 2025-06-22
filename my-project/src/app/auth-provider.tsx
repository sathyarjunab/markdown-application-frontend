// app/context/LocalStorageContext.js
"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const LocalStorageContext = createContext({
  userToken: "",
});
type Props = {
  children: React.ReactNode;
};

export const LocalStorageProvider = ({ children }: Props) => {
  const [userToken, setUserToken] = useState<string>("");

  useEffect(() => {
    const storedToken = localStorage.getItem("userToken");
    if (storedToken) {
      setUserToken(storedToken);
    }
  }, []);

  const contextValue = useMemo(() => ({ userToken }), [userToken]);

  return (
    <LocalStorageContext.Provider value={contextValue}>
      {children}
    </LocalStorageContext.Provider>
  );
};

export const useLocalStorage = () => useContext(LocalStorageContext);
