import { useCallback, useEffect, useState } from "react";
import { useImageRef } from "./useImageRef";
import { useExtensionSdk } from "./providers/ExtensionContext";

export interface AltText {
  locales: Record<string, string>;
}

export function useAltText() {
  const { ready, contentHubService } = useExtensionSdk();
  const { imageRef } = useImageRef();

  const [altText, setAltText] = useState<AltText>();

  const fetchAltText = useCallback(async () => {
    if (!imageRef || !ready) {
      return;
    }

    setAltText(
      await contentHubService?.getAssetAltTextById(imageRef?.id || "")
    );
  }, [contentHubService, imageRef, ready]);

  useEffect(() => {
    if (!imageRef || !ready) {
      return;
    }

    fetchAltText();
  }, [imageRef, ready, fetchAltText]);

  return { altText, fetchAltText };
}
