import { init, ContentFieldExtension, LocalModel } from "dc-extensions-sdk";
import { useCallback, useEffect, useState } from "react";
import { useFrameAutoResizer } from "./useFrameAutoResizer";
import ContentHubService from "../services/ContentHubService";

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

export interface Locale {
  locale: string;
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

export interface ExtensionParms {
  instance: {
    image: string;
    autoCaption: boolean;
  };
  installation: {
    image: string;
    autoCaption: boolean;
  };
}

export interface ExtensionOptions {
  collapseByDefault?: boolean;
}

export enum FIELD_TYPE {
  STRING = "STRING",
  LOCALIZED_VALUE = "LOCALIZED_VALUE",
}

export interface UseExtensionContext {
  readOnly: boolean;
  ready: boolean;
  schema: Record<string, unknown>;
  locales: LocalModel[];
  options: ExtensionOptions;
  fieldPath: string;
  dcExtensionsSdk: ContentFieldExtension | null;
  initialValue: FieldValue | null | undefined;
  value: FieldValue | null | undefined;
  fieldType: FIELD_TYPE;
  setFieldValue: (value?: string | FieldValue) => void;
  formValue: Record<string, unknown>;
  imagePointer: string;
  contentHubService: ContentHubService | undefined;
  autoCaption: boolean;
}

export function useExtension(): UseExtensionContext {
  const [dcExtensionsSdk, setDcExtensionsSdk] =
    useState<ContentFieldExtension | null>(null);
  const [schema, setSchema] = useState<Record<string, unknown>>({});
  const [ready, setReady] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [locales, setLocales] = useState<LocalModel[]>(DEFAULT_LOCALES);
  const [options, setOptions] = useState({} as ExtensionOptions);
  const [initialValue, setInitialValue] = useState<FieldValue | null>();
  const [value, setValue] = useState<FieldValue | undefined>();
  const [imagePointer, setImagePointer] = useState("");
  const [autoCaption, setAutoCaption] = useState(false);
  const [formValue, setFormValue] = useState({});
  const [fieldPath, setFieldPath] = useState("");
  const [fieldType, setFieldType] = useState(FIELD_TYPE.STRING);
  const [contentHubService, setContentHubService] =
    useState<ContentHubService>();

  useFrameAutoResizer(dcExtensionsSdk);

  const setFieldValue = useCallback(
    (value?: string | FieldValue) => {
      setValue(value);
      dcExtensionsSdk?.field.setValue(value);
    },
    [dcExtensionsSdk?.field],
  );

  useEffect(() => {
    init<ContentFieldExtension<string | FieldValue, ExtensionParms>>()
      .then(async (sdk) => {
        setDcExtensionsSdk(sdk);
        const params = {
          ...sdk.params.installation,
          ...sdk.params.instance,
        };
        const fieldValue = await sdk.field.getValue();
        setInitialValue(fieldValue);
        setFieldValue(fieldValue);
        setSchema(sdk.field.schema);
        setOptions({ collapseByDefault: sdk.collapseByDefault });
        setLocales(sdk.locales.available);
        setImagePointer(params.image);
        setAutoCaption(params.autoCaption);
        setFormValue(await sdk.form.getValue());
        setFieldPath(await sdk.field.getPath());
        setContentHubService(new ContentHubService(sdk, sdk.hub.id));

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
  }, [setFieldValue]);

  return {
    readOnly,
    ready,
    schema,
    locales,
    options,
    fieldPath,
    dcExtensionsSdk,
    initialValue,
    value,
    fieldType,
    setFieldValue,
    formValue,
    imagePointer,
    contentHubService,
    autoCaption,
  };
}
