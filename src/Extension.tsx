import { Box } from "@mantine/core";

import { FIELD_TYPE, LocalizedString } from "./hooks/useExtension";
import { Skeleton } from "@amplience/ui-core";
import { AltTextInput } from "./components/AltTextInput";
import { LocalizedAltTextInput } from "./components/LocalizedAltTextInput";
import { useExtensionSdk } from "./hooks/providers/ExtensionContext";

function Extension() {
  const { ready, schema, readOnly, value, fieldType, locales, setFieldValue } =
    useExtensionSdk();

  return (
    <>
      <Box w="100%" m="0 auto">
        <Skeleton visible={!ready}>
          {fieldType === FIELD_TYPE.STRING && (
            <AltTextInput
              value={value as string}
              schema={schema}
              readOnly={readOnly}
              onChange={setFieldValue}
            />
          )}
          {fieldType === FIELD_TYPE.LOCALIZED_VALUE && (
            <LocalizedAltTextInput
              value={value as LocalizedString}
              locales={locales}
              schema={schema}
              readOnly={readOnly}
              onChange={setFieldValue}
            />
          )}
        </Skeleton>
      </Box>
    </>
  );
}

export default Extension;
