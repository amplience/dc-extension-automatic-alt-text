import { useEffect, useState } from "react";
import RelativeJSONPointer from "../utils/RelativeJSONPointer";
import { MediaImageLink } from "dc-extensions-sdk/dist/types/lib/components/MediaLink";
import { useExtensionSdk } from "./providers/ExtensionContext";

const IMAGE_LINK_SCHEMA =
  "http://bigcontent.io/cms/schema/v1/core#/definitions/image-link";

export function useImageRef() {
  const { formValue, imagePointer, fieldPath, ready } = useExtensionSdk();

  const [imageRef, setImageRef] = useState<MediaImageLink>();
  const [initialImageRef, setInitialImageRef] = useState<MediaImageLink>();
  const [initialLookup, setInitialLookup] = useState(true);

  useEffect(() => {
    if (!ready) {
      return;
    }

    const image = RelativeJSONPointer.evaluate(
      imagePointer,
      formValue,
      fieldPath,
    );

    const isImage = image?._meta.schema === IMAGE_LINK_SCHEMA;
    const hasChanged = imageRef?.id !== image?.id;

    if (isImage && hasChanged) {
      setImageRef(image);
    }

    if (initialLookup) {
      setInitialImageRef(image);
      setInitialLookup(false);
    }
  }, [
    fieldPath,
    formValue,
    imagePointer,
    imageRef,
    initialImageRef,
    initialLookup,
    ready,
  ]);

  return { imageRef, initialImageRef };
}
