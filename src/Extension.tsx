import { Box, Flex } from "@mantine/core";
import { ExtensionsProvider } from "./hooks/providers/ExtensionProvider";
import { useExtension } from "./hooks/useExtension";
import { Button, Skeleton, TextInput } from "@amplience/ui-core";
import { useEffect, useState } from "react";

export interface AltText {
  locales: Record<string, string>;
}

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

  const handleInputChange = (value: string) => {
    dcExtensionsSdk?.field.setValue(value).catch(() => {});
    setInputValue(value);
  };

  const handleClick = (locale: string) => {
    const selectedAltText = imageAltText?.locales[locale];
    dcExtensionsSdk?.field.setValue(selectedAltText || "").catch(() => {});
    setInputValue(selectedAltText || "");
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
            <TextInput
              label={schema.title}
              fieldSchema={schema}
              value={String(inputValue)}
              onChange={handleInputChange}
              readOnly={readOnly}
            />
            <Flex justify="flex-end" gap="sm" mt="sm" mb="sm" wrap="wrap">
              {imageAltText?.locales &&
                Object.keys(imageAltText.locales).map((locale) => (
                  <Button
                    variant="outline"
                    p="s"
                    m="s"
                    key={locale}
                    onClick={() => handleClick(locale)}
                  >
                    {locale}
                  </Button>
                ))}
            </Flex>
          </Skeleton>
        </Box>
      </ExtensionsProvider>
    </>
  );
}

export default Extension;
