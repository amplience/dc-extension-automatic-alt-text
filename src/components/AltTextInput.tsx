import { Button, TextInput, Tooltip } from "@amplience/ui-core";
import { Flex, Loader } from "@mantine/core";
import { IconAlt, IconRefresh } from "@tabler/icons-react";
import { useAltText } from "../hooks/useAltText";
import { useEffect, useState } from "react";
import { useAutoCaption } from "../hooks/useAutoCaption";
import { theme } from "@amplience/ui-styles";

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

  return (
    <>
      {altText?.locales && Object.values(altText?.locales).length > 1 && (
        <Flex justify="flex-end" gap="sm" mt="sm" mb="sm" wrap="wrap">
          {loading && <Loader color="blue" />}
          <Tooltip
            label="Fetch ALT Text from Content Hub"
            position="top"
            offset={5}
          >
            <Button
              variant="ghost"
              p="s"
              m="s"
              leftSection={
                <IconAlt
                  size={24}
                  color={theme.other?.colors?.amp_ocean.amp_ocean_30}
                />
              }
              rightSection={
                <IconRefresh
                  size={24}
                  color={theme.other?.colors?.amp_ocean.amp_ocean_100}
                />
              }
              onClick={handleRefetch}
            >
              Refresh
            </Button>
          </Tooltip>
        </Flex>
      )}

      <TextInput
        label={schema.title}
        fieldSchema={schema}
        value={String(value || "")}
        onChange={onChange}
        readOnly={readOnly}
        pl="30px"
        pr="35px"
        leftSectionPointerEvents="none"
        leftSection={
          <IconAlt
            size={20}
            stroke={1.5}
            color={theme.other?.colors?.amp_ocean.amp_ocean_30}
          />
        }
      />
      <Flex justify="flex-start" gap="sm" mt="sm" mb="sm" wrap="wrap">
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
