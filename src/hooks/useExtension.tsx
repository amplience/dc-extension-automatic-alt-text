import { init, ContentFieldExtension, LocalModel } from "dc-extensions-sdk";
import { useCallback, useEffect, useState } from "react";
import { useFrameAutoResizer } from "./useFrameAutoResizer";
import ContentHubService from "../services/ContentHubService";
import RelativeJSONPointer from "../utils/RelativeJSONPointer";

const DEFAULT_LOCALES = [
  {
    locale: "en-GB",
    language: "en",
    country: "GB",
    index: 0,
    label: "en-GB",
    selected: true,
  },
];
const IMAGE_LINK_SCHEMA =
  "http://bigcontent.io/cms/schema/v1/core#/definitions/image-link";

export interface Locale {
  locale: string;
}

export interface AltText {
  locales: Record<string, string>;
}

export interface LocalizedStringValue {
  locale: string;
  value: string;
}

export interface LocalizedString {
  values: LocalizedStringValue[];
  _meta: {
    schema: string;
  };
}

export type FieldValue = string | LocalizedString;

interface ExtensionOptions {
  collapseByDefault?: boolean;
}

export enum FIELD_TYPE {
  STRING = "STRING",
  LOCALIZED_VALUE = "LOCALIZED_VALUE",
}

export function useExtension() {
  const [dcExtensionsSdk, setDcExtensionsSdk] =
    useState<ContentFieldExtension | null>(null);
  const [contentHubService, setContentHubService] =
    useState<ContentHubService>();
  const [schema, setSchema] = useState<Record<string, unknown>>({});
  const [ready, setReady] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [locales, setLocales] = useState<LocalModel[]>(DEFAULT_LOCALES);
  const [options, setOptions] = useState({} as ExtensionOptions);
  const [initialValue, setInitialValue] = useState<FieldValue | null>();
  const [value, setValue] = useState<FieldValue | undefined>();
  const [imagePointer, setImagePointer] = useState("");
  const [formValue, setFormValue] = useState({});
  const [fieldPath, setFieldPath] = useState("");
  const [fieldType, setFieldType] = useState(FIELD_TYPE.STRING);
  const [imageAltText, setImageAltText] = useState<AltText>();
  const [imageRefId, setImageRefId] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useFrameAutoResizer(dcExtensionsSdk);

  const setFieldValue = useCallback(
    (value?: string | FieldValue) => {
      setValue(value);
      dcExtensionsSdk?.field.setValue(value);
    },
    [dcExtensionsSdk?.field]
  );

  useEffect(() => {
    init<ContentFieldExtension<string | FieldValue>>()
      .then(async (sdk) => {
        setDcExtensionsSdk(sdk);
        setContentHubService(new ContentHubService(sdk, sdk.hub.id));
        const params: { image: string } = {
          ...sdk.params.installation,
          ...sdk.params.instance,
        } as { image: string };
        const fieldValue = await sdk.field.getValue();
        setInitialValue(fieldValue);
        setFieldValue(fieldValue);
        setSchema(sdk.field.schema);
        setOptions({ collapseByDefault: sdk.collapseByDefault });
        setLocales(sdk.locales.available);
        setImagePointer(params.image);
        setFormValue(await sdk.form.getValue());
        setFieldPath(await sdk.field.getPath());

        if (sdk.field.schema.type !== "string") {
          setFieldType(FIELD_TYPE.LOCALIZED_VALUE);
        }

        sdk.form.onFormValueChange(setFormValue);
        sdk.form.onReadOnlyChange((isReadOnly) => {
          setReadOnly(isReadOnly);
        });

        return () => {};
      })
      .finally(() => {
        setReady(true);
      });
  }, []);

  useEffect(() => {
    const fetchImageAltText = async () => {
      if (!dcExtensionsSdk || !contentHubService) {
        return;
      }
      try {
        const referencedImage = RelativeJSONPointer.evaluate(
          imagePointer,
          formValue,
          fieldPath
        );
        const isImage = referencedImage?._meta?.schema === IMAGE_LINK_SCHEMA;
        const imageChanged = imageRefId !== referencedImage?.id;

        if (isImage && imageChanged) {
          setImageRefId(referencedImage.id);
          setImageAltText(
            await contentHubService.getAssetAltTextById(referencedImage?.id)
          );
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchImageAltText();

    return () => {
      // Cleanup logic here
    };
  }, [
    contentHubService,
    dcExtensionsSdk,
    fieldPath,
    formValue,
    imagePointer,
    imageRefId,
    setFieldValue,
  ]);

  const refetchAltText = async () => {
    setIsLoading(true);

    setImageAltText(
      await contentHubService?.getAssetAltTextById(imageRefId || "")
    );

    setIsLoading(false);
  };

  return {
    readOnly,
    ready,
    schema,
    locales,
    options,
    fieldPath,
    dcExtensionsSdk,
    imageAltText,
    imageRefId,
    initialValue,
    value,
    fieldType,
    isLoading,
    setFieldValue,
    refetchAltText,
  };
}
