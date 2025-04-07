import { useEffect, useState } from "react";
import { useImageRef } from "./useImageRef";
import { useExtensionSdk } from "./providers/ExtensionContext";

export function useAutoCaption() {
  const { ready, autoCaption } = useExtensionSdk();
  const { initialImageRef, imageRef } = useImageRef();

  const [autoCaptionEnabled, setAutoCaptionEnabled] = useState(true);

  useEffect(() => {
    if (!ready || !imageRef) {
      return;
    }
    console.log("useAutoCaption", autoCaption);
    if (autoCaption === false) {
      setAutoCaptionEnabled(false);
      return;
    }

    if (initialImageRef && initialImageRef.id === imageRef?.id) {
      setAutoCaptionEnabled(false);
    } else {
      setAutoCaptionEnabled(true);
    }
  }, [initialImageRef, imageRef?.id, ready, autoCaption, imageRef]);

  return { autoCaptionEnabled };
}
