import { Button, TextInput } from "@amplience/ui-core";
import { Flex, Loader } from "@mantine/core";
import { AltText } from "../hooks/useExtension";

interface AltTextInputProps {
  value: string;
  altText?: AltText;
  schema: Record<string, unknown>;
  readOnly: boolean;
  isLoading: boolean;
  onChange: (value: string) => void;
  refetch: () => Promise<void>;
}

export function AltTextInput({
  value,
  altText,
  schema,
  readOnly,
  isLoading,
  onChange,
  refetch,
}: AltTextInputProps) {
  const handleClick = (locale: string) => {
    const localisedAltText = altText?.locales[locale];

    if (localisedAltText) {
      onChange(localisedAltText);
    }
  };

  const handleRefetch = async () => {
    await refetch();
  };

  return (
    <>
      <Flex justify="flex-end" gap="sm" mt="sm" mb="sm" wrap="wrap">
        {isLoading && <Loader color="blue" />}
        <Button variant="outline" p="s" m="s" onClick={handleRefetch}>
          Get Alt Text
        </Button>
      </Flex>
      <TextInput
        label={schema.title}
        fieldSchema={schema}
        value={String(value)}
        onChange={onChange}
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
    </>
  );
}
