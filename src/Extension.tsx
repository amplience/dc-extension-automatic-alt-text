import { Box } from "@mantine/core";

import {
  ExtensionParms,
  FIELD_TYPE,
  LocalizedString,
} from "./hooks/useExtension";
import { Skeleton } from "@amplience/ui-core";
import { AltTextInput } from "./components/AltTextInput";
import { LocalizedAltTextInput } from "./components/LocalizedAltTextInput";
import { useExtensionSdk } from "./hooks/providers/ExtensionContext";
import { FieldSchema } from "dc-extensions-sdk/dist/types/lib/components/Field";

function Extension() {
  const { ready, schema, readOnly, value, fieldType, locales, setFieldValue } =
    useExtensionSdk();

  return (
    <>
      <Box w="100%" m="0 auto">
        <Skeleton visible={!ready}>
          {ready && fieldType === FIELD_TYPE.STRING && (
            <AltTextInput
              value={value as string}
              schema={schema as FieldSchema<ExtensionParms>}
              readOnly={readOnly}
              onChange={setFieldValue}
            />
          )}
          {ready && fieldType === FIELD_TYPE.LOCALIZED_VALUE && (
            <LocalizedAltTextInput
              value={value as LocalizedString}
              locales={locales}
              schema={schema as FieldSchema<ExtensionParms>}
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
