import { HelpRequest, HelpRequestViewPublic, UserProfile } from "@/declarations/api/api.did";
import { createHelpRequest, getFeedItems, getProfileFull } from "@/services/ApiService";
import React, { createContext, useContext, useEffect, useState } from "react";
import { HelpRequest_, useAuth, UserProfileFull_ } from "./Auth";
export interface HelpRequestViewPublic_ extends HelpRequestViewPublic {
  currentUserActive: boolean;
}

export interface AppStateContext {
  currentItems: HelpRequestViewPublic_[];
  setCurrentItems: (p: HelpRequestViewPublic_[]) => void;
  notificationShow: boolean;
  notificationShowSet: (p: boolean) => void;
  hasCheckedAccountSetup: boolean;
  setHasCheckedAccountSetup: (p: any | undefined) => void;

  fetchFeed: () => Promise<void>;
}

// Provider hook that creates auth object and handles state
export function useProvideState(): AppStateContext {
  const { hasCheckedICUser, user, setUser } = useAuth();
  const [hasCheckedFeed, setHasCheckedFeed] = useState<boolean>(false);
  const [hasCheckedAccountSetup, setHasCheckedAccountSetup] = useState<boolean>(false);

  // const [user, setUser] = useState<UserProfileFull_ | undefined>();
  const [currentItems, setCurrentItems] = useState<HelpRequestViewPublic_[]>([]);
  const [notificationShow, notificationShowSet] = useState<boolean>(false);

  useEffect(() => {
    if (hasCheckedICUser) {
      //notificationShowSet(!(user == undefined) && user.helpRequestsNotifications.length > 0)
    }
  }, [hasCheckedICUser]);

  const fetchData = async () => {
    let items = await getFeedItems() as HelpRequestViewPublic_[];
    if (items)
      setCurrentItems(items);
  };

  useEffect(() => {
    if (currentItems?.length == 0 && hasCheckedICUser && !hasCheckedFeed) {
      setHasCheckedFeed(true)
      fetchData();
    }
  }, [currentItems, hasCheckedICUser]);

  return {

    currentItems,
    setCurrentItems,
    notificationShow,
    notificationShowSet,
    hasCheckedAccountSetup,
    setHasCheckedAccountSetup,
    fetchFeed:fetchData
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
