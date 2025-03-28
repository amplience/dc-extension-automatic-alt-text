import { Box } from "@mantine/core";
import { ExtensionsProvider } from "./hooks/providers/ExtensionProvider";
import { useExtension } from "./hooks/useExtension";
import { Skeleton } from "@amplience/ui-core";
import { useEffect, useState } from "react";
import { AltTextInput } from "./components/AltTextInput";

function Extension() {
  const {
    ready,
    dcExtensionsSdk,
    schema,
    readOnly,
    initialValue,
    imageAltText,
    imageRefId,
  } = useExtension();
  const [inputValue, setInputValue] = useState("");

  const handleChange = (value: string) => {
    dcExtensionsSdk?.field.setValue(value).catch(() => {});
    setInputValue(value);
  };

  useEffect(() => setInputValue(initialValue || ""), [initialValue]);

  useEffect(() => {
    const checkForClearedField = async () => {
      const value = await dcExtensionsSdk?.field.getValue();

      if (!value && inputValue) {
        setInputValue("");
      }
    };

    checkForClearedField();

    return () => {};
  }, [dcExtensionsSdk?.field, imageRefId, inputValue]);

  return (
    <>
      <ExtensionsProvider dcExtensionsSdk={dcExtensionsSdk}>
        <Box w="100%" m="0 auto">
          <Skeleton visible={!ready}>
            <AltTextInput
              value={inputValue}
              altText={imageAltText}
              schema={schema}
              readOnly={readOnly}
              onChange={handleChange}
            />
          </Skeleton>
        </Box>
      </ExtensionsProvider>
    </>
  );
}

export default Extension;
