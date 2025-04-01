import { useEffect, useState } from "react";
import RelativeJSONPointer from "../utils/RelativeJSONPointer";
import { MediaImageLink } from "dc-extensions-sdk/dist/types/lib/components/MediaLink";
import { useExtensionSdk } from "./providers/ExtensionContext";

const IMAGE_LINK_SCHEMA =
  "http://bigcontent.io/cms/schema/v1/core#/definitions/image-link";

export function useImageRef() {
  const { formValue, imagePointer, fieldPath, ready } = useExtensionSdk();

  const [imageRef, setImageRef] = useState<MediaImageLink>();

  useEffect(() => {
    if (!ready) {
      return;
    }

    const image = RelativeJSONPointer.evaluate(
      imagePointer,
      formValue,
      fieldPath
    );

    if (
      imageRef?.id !== image?.id &&
      image._meta.schema === IMAGE_LINK_SCHEMA
    ) {
      setImageRef(image);
    }
  }, [fieldPath, formValue, imagePointer, imageRef?.id, ready]);

  return { imageRef };
}
