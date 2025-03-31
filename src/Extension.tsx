import { Box } from "@mantine/core";
import { ExtensionsProvider } from "./hooks/providers/ExtensionProvider";
import {
  FIELD_TYPE,
  LocalizedString,
  useExtension,
} from "./hooks/useExtension";
import { Skeleton } from "@amplience/ui-core";
import { AltTextInput } from "./components/AltTextInput";
import { LocalizedAltTextInput } from "./components/LocalizedAltTextInput";

function Extension() {
  const {
    ready,
    dcExtensionsSdk,
    schema,
    readOnly,
    imageAltText,
    value,
    fieldType,
    locales,
    setFieldValue,
  } = useExtension();

  return (
    <>
      <ExtensionsProvider dcExtensionsSdk={dcExtensionsSdk}>
        <Box w="100%" m="0 auto">
          <Skeleton visible={!ready}>
            {fieldType === FIELD_TYPE.STRING && (
              <AltTextInput
                value={value as string}
                altText={imageAltText}
                schema={schema}
                readOnly={readOnly}
                onChange={setFieldValue}
              />
            )}
            {fieldType === FIELD_TYPE.LOCALIZED_VALUE && (
              <LocalizedAltTextInput
                value={value as LocalizedString}
                altText={imageAltText}
                locales={locales}
                schema={schema}
                readOnly={readOnly}
                onChange={setFieldValue}
              />
            )}
          </Skeleton>
        </Box>
      </ExtensionsProvider>
    </>
  );
}

export default Extension;
