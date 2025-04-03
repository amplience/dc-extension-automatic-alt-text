import { TextInput } from "@amplience/ui-core";
import { Flex, Loader, Group, Button } from "@mantine/core";
import { Button as AmplienceButton } from "@amplience/ui-core";
import { IconAlt } from "@tabler/icons-react";
import { useAltText } from "../hooks/useAltText";
import { useEffect, useRef, useState } from "react";
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
  const [canExpand, setCanExpand] = useState(false);

  const contentRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const checkOverflow = () => {
      if (contentRef.current) {
        setCanExpand(
          contentRef.current.scrollHeight > contentRef.current.clientHeight,
        );
      }
    };

    checkOverflow();

    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, []);

  const localeButton = (locale: string) => {
    return (
      <Button
        variant="default"
        size="xs"
        radius="lg"
        miw="80px"
        key={locale}
        onClick={() => handleClick(locale)}
      >
        {locale}
      </Button>
    );
  };

  const availableLocales = Object.keys(altText?.locales || {});

  return (
    <>
      {Boolean(availableLocales.length) && (
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

      {Boolean(availableLocales.length) && (
        <Flex
          direction="row"
          justify="flex-start"
          gap="sm"
          mt="sm"
          mb="sm"
          wrap="wrap"
          style={{ overflow: "hidden", maxHeight: opened ? "unset" : "32px" }}
          ref={contentRef}
        >
          {availableLocales.map(localeButton)}
        </Flex>
      )}

      {(canExpand || opened) && (
        <Group justify="right" mt="sm" mb="sm">
          <AmplienceButton variant="ghost" onClick={toggle}>
            Show {opened ? "less" : "more"}
          </AmplienceButton>
        </Group>
      )}
    </>
  );
}
