import { init, ContentFieldExtension } from "dc-extensions-sdk";
import { useEffect, useState } from "react";
import { useFrameAutoResizer } from "./useFrameAutoResizer";

export const DEFAULT_LOCALES = [{ locale: "en-GB" }];

interface ExtensionOptions {
  collapseByDefault?: boolean;
}

export function useExtension() {
  const [dcExtensionsSdk, setDcExtensionsSdk] =
    useState<ContentFieldExtension | null>(null);
  const [schema, setSchema] = useState<Record<string, unknown>>({});
  const [ready, setReady] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [locales, setLocales] = useState(DEFAULT_LOCALES);
  const [options, setOptions] = useState({} as ExtensionOptions);
  const [initialModel, setInitialModel] = useState<Record<string, unknown>>({});

  useFrameAutoResizer(dcExtensionsSdk);

  useEffect(() => {
    init<ContentFieldExtension>()
      .then(async (sdk) => {
        setDcExtensionsSdk(sdk);

        const sdkModel = await sdk.field.getValue();

        setInitialModel(sdkModel);
        setSchema(sdk.field.schema);
        setOptions({ collapseByDefault: sdk.collapseByDefault });
        setLocales(sdk.locales.available);
        sdk?.form.onReadOnlyChange((isReadOnly) => {
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
    initialModel,
    dcExtensionsSdk,
  };
}
