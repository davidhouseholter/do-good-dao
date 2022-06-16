import { HelpRequest } from "@/declarations/api/api.did";
import { createHelpRequest, getFeedItems } from "@/services/ApiService";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./Auth";

export interface AppStateContext {
  user: any;
  setUser: (p: any | undefined) => void;
  currentItems: HelpRequest[];
  setCurrentItems: (p: HelpRequest[]) => void;

  hasCheckedAccountSetup: boolean; 
  setHasCheckedAccountSetup:(p: any | undefined) => void;
}

// Provider hook that creates auth object and handles state
export function useProvideState(): AppStateContext {
  const {hasCheckedICUser} = useAuth();
  const [hasCheckedFeed, setHasCheckedFeed] = useState<boolean>(false);
  const [hasCheckedAccountSetup, setHasCheckedAccountSetup] = useState<boolean>(false);

  const [user, setUser] = useState<any | undefined>();
  const [currentItems, setCurrentItems] = useState<HelpRequest[]>([]);


  useEffect(() => {
    const fetchData = async () => {
     const items = await getFeedItems();
     setCurrentItems(items);
    };
    if (currentItems?.length == 0 && hasCheckedICUser && !hasCheckedFeed) {
      setHasCheckedFeed(true)
      fetchData();
    }
  }, [currentItems, hasCheckedICUser]);

  return {
    user,
    setUser,
    currentItems,
    setCurrentItems,
    hasCheckedAccountSetup,
    setHasCheckedAccountSetup,
  }
}

const AppStateContext = createContext<AppStateContext>(null!);

export function ProvideState({ children }) {
  const auth = useProvideState();
  return <AppStateContext.Provider value={auth}>{children}</AppStateContext.Provider>;
}

export const useAppState = () => {
  return useContext(AppStateContext);
};
