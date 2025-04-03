import { TextInput } from "@amplience/ui-core";
import { Flex, Loader, Collapse, Group, Button } from "@mantine/core";
import { Button as AmplienceButton } from "@amplience/ui-core";
import { IconAlt } from "@tabler/icons-react";
import { useAltText } from "../hooks/useAltText";
import { useEffect, useState } from "react";
import { useAutoCaption } from "../hooks/useAutoCaption";
import { useDisclosure } from "@mantine/hooks";

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
  const { autoCaptionEnabled } = useAutoCaption();

  const [loading, setLoading] = useState(false);
  const [preventAutoCaption, setPreventAutoCaption] = useState(false);
  const [opened, { toggle }] = useDisclosure(false);

  const VISIBLE_LOCALES = 10;

  const handleClick = (locale: string) => {
    const localisedAltText = altText?.locales[locale];

    if (localisedAltText) {
      onChange(localisedAltText);
    }
  };

  const handleRefetch = async () => {
    setLoading(true);
    setPreventAutoCaption(true);
    await fetchAltText();
    setLoading(false);
    setPreventAutoCaption(false);
  };

  useEffect(() => {
    if (preventAutoCaption) {
      return;
    }
    const defaultAltText = altText?.locales.default;
    if (autoCaptionEnabled && defaultAltText) {
      onChange(defaultAltText);
    }
  }, [altText, autoCaptionEnabled, onChange, preventAutoCaption]);

  const visibleLocales =
    Object.keys(altText?.locales || {}).splice(0, VISIBLE_LOCALES) || [];
  const overflowLocales =
    Object.keys(altText?.locales || {}).splice(VISIBLE_LOCALES) || [];

  const localeButton = (locale: string) => {
    return (
      <Button
        variant="default"
        size="xs"
        radius="lg"
        key={locale}
        onClick={() => handleClick(locale)}
      >
        {locale}
      </Button>
    );
  };

  return (
    <>
      {altText?.locales && Object.values(altText?.locales).length >= 1 && (
        <Flex justify="flex-end" gap="sm" mt="sm" mb="sm" wrap="wrap">
          {loading && <Loader color="blue" />}
          <Button
            variant="secondary"
            p="s"
            m="s"
            rightSection={<IconAlt size={24} />}
            onClick={handleRefetch}
          >
            Refresh
          </Button>
        </Flex>
      )}

      <TextInput
        label={schema.title}
        fieldSchema={schema}
        value={String(value || "")}
        onChange={onChange}
        readOnly={readOnly}
      />

      {Boolean(visibleLocales.length) && (
        <Flex
          direction="row"
          justify="flex-start"
          gap="sm"
          mt="sm"
          mb="sm"
          wrap="wrap"
        >
          {visibleLocales.map(localeButton)}
        </Flex>
      )}

      {Boolean(overflowLocales.length) && (
        <>
          <Collapse in={opened}>
            <Flex
              direction="row"
              justify="flex-start"
              gap="sm"
              mt="sm"
              mb="sm"
              wrap="wrap"
            >
              {overflowLocales.map(localeButton)}
            </Flex>
          </Collapse>

          <Group justify="right" mt="sm" mb="sm">
            <AmplienceButton variant="ghost" onClick={toggle}>
              Show {opened ? "less" : "more"}
            </AmplienceButton>
          </Group>
        </>
      )}
    </>
  );
}
