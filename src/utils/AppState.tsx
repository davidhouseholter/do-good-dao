import { Item } from "@/declarations/api/api.did";
import { createHelpRequest, getFeedItems } from "@/services/ApiService";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./Auth";

export interface AppStateContext {
  user: any;
  setUser: (p: any | undefined) => void;
  currentItems: Item[];
  setCurrentItems: (p: Item[]) => void;
}

// Provider hook that creates auth object and handles state
export function useProvideState(): AppStateContext {
  const {hasCheckedICUser} = useAuth();
  const [hasCheckedFeed, setHasCheckedFeed] = useState<boolean>(false);

  const [user, setUser] = useState<any | undefined>();
  const [currentItems, setCurrentItems] = useState<Item[]>([]);


  useEffect(() => {
    const fetchData = async () => {
     const items = await getFeedItems();
     setCurrentItems(items);
     console.log(items)
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
    setCurrentItems
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
