import { Box, Flex } from "@mantine/core";
import { ExtensionsProvider } from "./hooks/providers/ExtensionProvider";
import { useExtension } from "./hooks/useExtension";
import { Button, Skeleton, TextInput } from "@amplience/ui-core";
import { useEffect, useState } from "react";
import RelativeJSONPointer from "./utils/RelativeJSONPointer";

const IMAGE_LINK =
  "http://bigcontent.io/cms/schema/v1/core#/definitions/image-link";

export interface AltText {
  locales: Record<string, string>;
}

function Extension() {
  const {
    ready,
    dcExtensionsSdk,
    schema,
    imagePointer,
    formValue,
    fieldPath,
    contentHubService,
    readOnly,
    initialValue,
  } = useExtension();
  const [imageId, setImageId] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [altText, setAltText] = useState<AltText>();

  const handleInputChange = (value: string) => {
    dcExtensionsSdk?.field.setValue(value).catch(() => {});
    setInputValue(value);
  };

  const handleClick = (locale: string) => {
    const selectedAltText = altText?.locales[locale];
    dcExtensionsSdk?.field.setValue(selectedAltText || "").catch(() => {});
    setInputValue(selectedAltText || "");
  };

  useEffect(() => setInputValue(initialValue || ""), [initialValue]);

  useEffect(() => {
    const fetchImage = async () => {
      if (!dcExtensionsSdk || !contentHubService) {
        return;
      }
      try {
        const referencedImage = RelativeJSONPointer.evaluate(
          imagePointer,
          formValue,
          fieldPath
        );
        const isImage = referencedImage?._meta?.schema === IMAGE_LINK;
        const imageChanged = imageId !== referencedImage?.id;

        if (imageId && imageChanged) {
          dcExtensionsSdk?.field.setValue().catch(() => {});
          setInputValue("");
        }

        if (isImage && imageChanged) {
          setImageId(referencedImage.id);
          setAltText(
            await contentHubService.getAssetAltTextById(referencedImage?.id)
          );
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchImage();

    return () => {
      // Cleanup logic here
    };
  }, [
    dcExtensionsSdk,
    imagePointer,
    formValue,
    fieldPath,
    imageId,
    contentHubService,
  ]);

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
              {altText?.locales &&
                Object.keys(altText.locales).map((locale) => (
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
