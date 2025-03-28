import { Button, TextInput } from "@amplience/ui-core";
import { Flex } from "@mantine/core";
import { AltText } from "../hooks/useExtension";

interface AltTextInputProps {
  value: string;
  altText?: AltText;
  schema: Record<string, unknown>;
  readOnly: boolean;
  onChange: (value: string) => void;
}

export function AltTextInput({
  value,
  altText,
  schema,
  readOnly,
  onChange,
}: AltTextInputProps) {
  const handleClick = (locale: string) => {
    const localisedAltText = altText?.locales[locale];

    if (localisedAltText) {
      onChange(localisedAltText);
    }
  };

  return (
    <>
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
