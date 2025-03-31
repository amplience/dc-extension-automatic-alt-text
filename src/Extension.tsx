import { Box } from "@mantine/core";
import { ExtensionsProvider } from "./hooks/providers/ExtensionProvider";
import { FIELD_TYPE, FieldValue, useExtension } from "./hooks/useExtension";
import { Skeleton } from "@amplience/ui-core";
import { useEffect } from "react";
import { AltTextInput } from "./components/AltTextInput";
import { LocalizedAltTextInput } from "./components/LocalizedAltTextInput";

function Extension() {
  const {
    ready,
    dcExtensionsSdk,
    schema,
    readOnly,
    imageAltText,
    imageRefId,
    value,
    fieldType,
    locales,
    isLoading,
    setFieldValue,
    clearFieldValue,
    refetchAltText,
  } = useExtension();

  const handleChange = (value: FieldValue) => {
    setFieldValue(value);
  };

  useEffect(() => {
    const checkForClearedField = async () => {
      const value = await dcExtensionsSdk?.field.getValue();

      if (!value) {
        clearFieldValue();
      }
    };

    checkForClearedField();

    return () => {};
  }, [
    clearFieldValue,
    dcExtensionsSdk?.field,
    fieldType,
    imageRefId,
    setFieldValue,
    value,
  ]);

  return (
    <>
      <ExtensionsProvider dcExtensionsSdk={dcExtensionsSdk}>
        <Box w="100%" m="0 auto">
          <Skeleton visible={!ready}>
            {fieldType === FIELD_TYPE.STRING && (
              <AltTextInput
                value={value}
                altText={imageAltText}
                schema={schema}
                readOnly={readOnly}
                onChange={handleChange}
                refetch={refetchAltText}
                isLoading={isLoading}
              />
            )}
            {fieldType === FIELD_TYPE.LOCALIZED_VALUE && (
              <LocalizedAltTextInput
                value={value}
                altText={imageAltText}
                locales={locales}
                schema={schema}
                readOnly={readOnly}
                onChange={handleChange}
                refetch={refetchAltText}
                isLoading={isLoading}
              />
            )}
          </Skeleton>
        </Box>
      </ExtensionsProvider>
    </>
  );
}

export default Extension;
