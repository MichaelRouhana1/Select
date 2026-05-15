"use client";

import {
  createContext,
  useContext,
  type ReactNode,
} from "react";

const GuidePatchContext = createContext<string>("15.24.1");

export function GuidePatchProvider({
  patch,
  children,
}: {
  patch: string;
  children: ReactNode;
}) {
  return (
    <GuidePatchContext.Provider value={patch}>
      {children}
    </GuidePatchContext.Provider>
  );
}

export function useGuidePatch() {
  return useContext(GuidePatchContext);
}
