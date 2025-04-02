import { TextInput } from "@amplience/ui-core";
import { Flex, Loader, Collapse, Group, Button } from "@mantine/core";
import { IconAlt } from "@tabler/icons-react";
import { useAltText } from "../hooks/useAltText";
import { useEffect, useState } from "react";
import { useAutoCaption } from "../hooks/useAutoCaption";
import { useDisclosure } from "@mantine/hooks";

import testData from "../components/TEMP.json";

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

  const buttonRows = () => {
    const firstRow: React.ReactNode[] = [];
    const otherRows: React.ReactNode[] = [];

    if (altText?.locales) {
      Object.keys(altText.locales).forEach((locale, i) => {
        const btn = (
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

        if (i >= 10) {
          otherRows.push(btn);
        } else {
          firstRow.push(btn);
        }
      });
    }
    return {
      firstRow,
      otherRows,
    };
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

      <Flex
        direction="row"
        justify="space-between"
        gap="sm"
        mt="sm"
        mb="sm"
        wrap="wrap"
      >
        {buttonRows().firstRow}
      </Flex>

      {buttonRows().otherRows.length >= 1 && (
        <>
          <Collapse in={opened}>
            <Flex
              direction="row"
              justify="space-between"
              gap="sm"
              mt="sm"
              mb="sm"
              wrap="wrap"
            >
              {buttonRows().otherRows}
            </Flex>
          </Collapse>

          <Group justify="right" mt="sm" mb="sm">
            <Button onClick={toggle}>Show more</Button>
          </Group>
        </>
      )}
    </>
  );
}
