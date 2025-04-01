import { Button, TextInput } from "@amplience/ui-core";
import { Flex, Loader } from "@mantine/core";
import { useAltText } from "../hooks/useAltText";
import { useState } from "react";

interface AltTextInputProps {
  value: string;
  schema: Record<string, unknown>;
  readOnly: boolean;
  onChange: (value: string) => void;
}

export function AltTextInput({
  value,
  schema,
  readOnly,
  onChange,
}: AltTextInputProps) {
  const { altText, fetchAltText } = useAltText();

  const [loading, setLoading] = useState(false);

  const handleClick = (locale: string) => {
    const localisedAltText = altText?.locales[locale];

    if (localisedAltText) {
      onChange(localisedAltText);
    }
  };

  const handleRefetch = async () => {
    setLoading(true);
    await fetchAltText();
    setLoading(false);
  };

  return (
    <>
      <Flex justify="flex-end" gap="sm" mt="sm" mb="sm" wrap="wrap">
        {loading && <Loader color="blue" />}
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
