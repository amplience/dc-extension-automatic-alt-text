import { useEffect, useState } from "react";
import { useImageRef } from "./useImageRef";
import { useExtensionSdk } from "./providers/ExtensionContext";

export function useAutoCaption() {
  const { ready, autoCaption } = useExtensionSdk();
  const { initialImageRef, imageRef } = useImageRef();

  const [autoCaptionEnabled, setAutoCaptionEnabled] = useState(false);

  useEffect(() => {
    if (!ready || !autoCaption || !imageRef) {
      return;
    }

    if (!initialImageRef || initialImageRef.id !== imageRef?.id) {
      setAutoCaptionEnabled(true);
    }
  }, [initialImageRef, imageRef?.id, ready, autoCaption, imageRef]);

  return { autoCaptionEnabled };
}
