import { ReactNode } from "react";

import { UseExtensionContext, useExtension } from "../useExtension";
import { ExtensionContext } from "./ExtensionContext";

export interface ExtensionContextProps {
  children: ReactNode;
  extension?: UseExtensionContext | null;
}

export function ExtensionsProvider({ children }: ExtensionContextProps) {
  const extension = useExtension();
  return (
    <ExtensionContext.Provider value={extension || null}>
      {children}
    </ExtensionContext.Provider>
  );
}
