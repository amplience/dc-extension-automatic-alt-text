import { ReactNode, createContext, useContext } from "react";

import type { ContentFieldExtension } from "dc-extensions-sdk";

export const ExtensionsContext = createContext<ContentFieldExtension | null>(
  null
);

export const useExtensionsSdk = () => useContext(ExtensionsContext);

export interface ExtensionsContextProps {
  children: ReactNode;
  dcExtensionsSdk?: ContentFieldExtension | null;
}

export function ExtensionsProvider({
  children,
  dcExtensionsSdk,
}: ExtensionsContextProps) {
  return (
    <ExtensionsContext.Provider value={dcExtensionsSdk || null}>
      {children}
    </ExtensionsContext.Provider>
  );
}
