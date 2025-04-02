import { createContext, useContext } from "react";

import { UseExtensionContext } from "../useExtension";

export const ExtensionContext = createContext<UseExtensionContext | null>(null);

export const useExtensionSdk = () => {
  const context = useContext(ExtensionContext);
  if (!context) {
    throw new Error(
      "useExtensionContext must be used within an ExtensionProvider",
    );
  }

  return context;
};
