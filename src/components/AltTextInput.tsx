import { IconButton, TextInput, Tooltip } from "@amplience/ui-core";
import { Flex, Loader, Group } from "@mantine/core";
import { Button } from "@amplience/ui-core";
import { IconAlt, IconWorldShare } from "@tabler/icons-react";
import { useAltText } from "../hooks/useAltText";
import { useEffect, useRef, useState } from "react";
import { useAutoCaption } from "../hooks/useAutoCaption";
import { useDisclosure } from "@mantine/hooks";
import { theme } from "@amplience/ui-styles";
import { FieldSchema } from "dc-extensions-sdk/dist/types/lib/components/Field";
import { ExtensionParms } from "../hooks/useExtension";
import { useOverflow } from "../hooks/useOverflow";
import { InfoPopover } from "./InfoPopover";

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
  const contentRef = useRef<HTMLDivElement>(null);

  const { isOverflowing } = useOverflow(contentRef);

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
    handleClick("default");
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

  const localeButton = (locale: string) => {
    return (
      <Button
        variant="tertiary"
        size="sm"
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
      <TextInput
        title={schema.title}
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
                label="Refresh with the latest Alt text for this locale"
                position="top"
                offset={5}
              >
                <IconButton
                  variant="subtle"
                  onClick={() => handleRefetch()}
                  disabled={loading}
                >
                  {loading ? (
                    <Loader
                      size="xs"
                      color={theme.other?.colors?.amp_ocean.amp_ocean_30}
                    />
                  ) : (
                    <IconWorldShare size={20} stroke={2} />
                  )}
                </IconButton>
              </Tooltip>
            )}
          </>
        }
        titleRightSection={
          <InfoPopover
            paragraphs={[
              "Pulls in Alt text from Content Hub for all locales",
              "Docs: https://github.com/amplience/dc-extension-automatic-alt-text",
            ]}
          />
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
          style={{
            overflow: "hidden",
            maxHeight: opened ? "unset" : "34px",
            minHeight: "34px",
          }}
          ref={contentRef}
        >
          {availableLocales.map(localeButton)}
        </Flex>
      )}

      {(isOverflowing || opened) && (
        <Group justify="right" mt="sm" mb="sm">
          <Button variant="ghost" size="xs" onClick={toggle}>
            Show {opened ? "less" : "more"}
          </Button>
        </Group>
      )}
    </>
  );
}
