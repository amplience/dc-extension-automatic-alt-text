import {
  ContentEditorExtension,
  ContentFieldExtension,
} from "dc-extensions-sdk";
import { useEffect } from "react";

export function useFrameAutoResizer(
  sdk: ContentEditorExtension | ContentFieldExtension | null,
) {
  useEffect(() => {
    const isContentFormExtension = sdk instanceof ContentEditorExtension;

    if (!sdk || isContentFormExtension || sdk.frame.isAutoResizing) {
      return;
    }

    sdk.frame.startAutoResizer();

    return () => sdk.frame.stopAutoResizer();
  }, [sdk]);
}
