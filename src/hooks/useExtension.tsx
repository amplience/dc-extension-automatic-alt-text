import { init, ContentFieldExtension } from "dc-extensions-sdk";
import { useEffect, useState } from "react";
import { useFrameAutoResizer } from "./useFrameAutoResizer";
import ContentHubService from "../services/ContentHubService";

export const DEFAULT_LOCALES = [{ locale: "en-GB" }];

interface ExtensionOptions {
  collapseByDefault?: boolean;
}

export function useExtension() {
  const [dcExtensionsSdk, setDcExtensionsSdk] =
    useState<ContentFieldExtension | null>(null);
  const [contentHubService, setContentHubService] =
    useState<ContentHubService>();
  const [schema, setSchema] = useState<Record<string, unknown>>({});
  const [ready, setReady] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [locales, setLocales] = useState(DEFAULT_LOCALES);
  const [options, setOptions] = useState({} as ExtensionOptions);
  const [initialValue, setInitialValue] = useState<string>();
  const [imagePointer, setImagePointer] = useState("");
  const [formValue, setFormValue] = useState({});
  const [fieldPath, setFieldPath] = useState("");

  useFrameAutoResizer(dcExtensionsSdk);

  useEffect(() => {
    init<ContentFieldExtension<string>>()
      .then(async (sdk) => {
        setDcExtensionsSdk(sdk);
        setContentHubService(new ContentHubService(sdk, sdk.hub.id));

        const params: { image: string } = {
          ...sdk.params.instance,
          ...sdk.params.installation,
        } as { image: string };
        const fieldValue = await sdk.field.getValue();
        setInitialValue(fieldValue);
        setSchema(sdk.field.schema);
        setOptions({ collapseByDefault: sdk.collapseByDefault });
        setLocales(sdk.locales.available);
        setImagePointer(params.image);
        setFormValue(await sdk.form.getValue());
        setFieldPath(await sdk.field.getPath());

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

  return {
    readOnly,
    ready,
    schema,
    locales,
    options,
    initialValue,
    imagePointer,
    formValue,
    fieldPath,
    dcExtensionsSdk,
    contentHubService,
  };
}
