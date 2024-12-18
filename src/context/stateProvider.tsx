/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface StateContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  user: any | undefined;
  setUser: React.Dispatch<React.SetStateAction<any>>;
  refetchFilesList: boolean;
  setRefetchFilesList: React.Dispatch<React.SetStateAction<boolean>>;
}

const StateContext = createContext<StateContextType | undefined>(undefined);

interface StateProviderProps {
  children: ReactNode;
}

const StateProvider: React.FC<StateProviderProps> = ({ children }): ReactNode => {
  const [user, setUser] = useState<any | undefined>(undefined);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [refetchFilesList, setRefetchFilesList] = useState<boolean>(false);

  const readCookie = () => {
    if (localStorage.getItem("token")) {
      setIsLoggedIn(true);
    }
  };

  useEffect(() => {
    readCookie();
  }, []);

  return (
    <StateContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        user,
        setUser,
        refetchFilesList, setRefetchFilesList
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

// Custom hook to use the context
export const useUniversalState = (): StateContextType => {
  const context = useContext(StateContext);
  if (context === undefined) {
    throw new Error("useUniversalState must be used within a StateProvider");
  }
  return context;
};

export default StateProvider;
