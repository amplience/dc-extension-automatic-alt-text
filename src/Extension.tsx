import { Box, Flex } from "@mantine/core";
import { ExtensionsProvider } from "./hooks/providers/ExtensionProvider";
import { useExtension } from "./hooks/useExtension";
import { IconButton, Skeleton, TextInput } from "@amplience/ui-core";
import { useEffect, useState } from "react";
import RelativeJSONPointer from "./utils/RelativeJSONPointer";
import { IconArrowRight } from "@tabler/icons-react";

const IMAGE_LINK =
  "http://bigcontent.io/cms/schema/v1/core#/definitions/image-link";

export interface AltText {
  defaultAltText: string;
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

  const handleActionClick = () => {
    dcExtensionsSdk?.field
      .setValue(altText?.defaultAltText || "")
      .catch(() => {});
    setInputValue(altText?.defaultAltText || "");
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

        if (isImage && imageChanged) {
          setImageId(referencedImage.id);
          const asset = await contentHubService?.getAssetById(
            referencedImage.id
          );
          const assetAltText =
            asset?.relationships?.hasAltText?.[0]?.variants?.[0].values;

          if (assetAltText) {
            setAltText({
              defaultAltText: assetAltText.defaultDescription,
              locales: assetAltText.descriptions,
            });
          }
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
            <Flex direction="row" align="flex-end" gap="md">
              <TextInput
                label={schema.title}
                fieldSchema={schema}
                value={String(inputValue)}
                onChange={handleInputChange}
                readOnly={readOnly}
                rightSection={
                  <IconButton onClick={handleActionClick}>
                    <IconArrowRight size={18} stroke={1.5} />
                  </IconButton>
                }
              />
            </Flex>
          </Skeleton>
        </Box>
      </ExtensionsProvider>
    </>
  );
}

export default Extension;
