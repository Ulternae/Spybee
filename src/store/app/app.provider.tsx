"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { useStore } from "zustand";
import { appStore, type AppStore, type AppStoreState } from "./app.store";

const AppContext = createContext<AppStore | null>(null);

interface AppStoreProviderProps {
  children: ReactNode;
  initialState?: Partial<AppStoreState>;
}

const AppStoreProvider = ({ children, initialState }: AppStoreProviderProps) => {
  const [store] = useState(() => appStore(initialState));

  return (
    <AppContext.Provider value={store}>{children}</AppContext.Provider>
  );
};

const useAppStore = <T,>(selector: (state: AppStoreState) => T): T => {
  const appStoreContext = useContext(AppContext);

  if (!appStoreContext) {
    throw new Error("useAppStore must be used within an AppStoreProvider");
  }

  return useStore(appStoreContext, selector);
};

const useAppStoreApi = () => {
  const appStoreContext = useContext(AppContext);

  if (!appStoreContext) {
    throw new Error("useAppStoreApi must be used within an AppStoreProvider");
  }

  return appStoreContext;
};

export { AppStoreProvider, useAppStore, useAppStoreApi };
export type { AppStoreProviderProps };
