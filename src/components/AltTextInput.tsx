import { IconButton, TextInput, Tooltip } from "@amplience/ui-core";
import { Flex, Loader, Group, Button } from "@mantine/core";
import { Button as AmplienceButton } from "@amplience/ui-core";
import { IconAlt, IconWorldShare } from "@tabler/icons-react";
import { useAltText } from "../hooks/useAltText";
import { useEffect, useRef, useState } from "react";
import { useAutoCaption } from "../hooks/useAutoCaption";
import { useDisclosure } from "@mantine/hooks";
import { theme } from "@amplience/ui-styles";
import { FieldSchema } from "dc-extensions-sdk/dist/types/lib/components/Field";
import { ExtensionParms } from "../hooks/useExtension";

interface AltTextInputProps {
  value: string;
  schema: FieldSchema<ExtensionParms>;
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
        </Flex>
      )}

      <TextInput
        label={schema.title}
        description={schema.description}
        fieldSchema={schema}
        value={String(value || "")}
        onChange={onChange}
        readOnly={readOnly}
        classNames={{
          input: "alt-text-input-class",
        }}
        leftSectionPointerEvents="none"
        leftSection={
          <IconAlt
            size={20}
            stroke={1.5}
            color={theme.other?.colors?.amp_ocean.amp_ocean_30}
          />
        }
        rightSection={
          <>
            {altText?.locales && (
              <Tooltip
                label="Refresh with the latest ALT text for this locale"
                position="top"
                offset={5}
              >
                <IconButton variant="subtle" onClick={() => handleRefetch()}>
                  <IconWorldShare size={20} stroke={2} />
                </IconButton>
              </Tooltip>
            )}
          </>
        }
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
