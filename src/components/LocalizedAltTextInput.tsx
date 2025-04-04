import {
  Button,
  CollapsibleContainer,
  IconButton,
  LocaleBadge,
  TextInput,
  Tooltip,
} from "@amplience/ui-core";
import { ExtensionParms, LocalizedString } from "../hooks/useExtension";
import { IconAlt, IconRefresh, IconWorldShare } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { LocalModel } from "dc-extensions-sdk";
import { Flex, Loader } from "@mantine/core";

import { AltText, useAltText } from "../hooks/useAltText";
import { useAutoCaption } from "../hooks/useAutoCaption";
import { theme } from "@amplience/ui-styles";
import { useUiParams } from "../hooks/useUiParams";
import { FieldSchema } from "dc-extensions-sdk/dist/types/lib/components/Field";

type LocalizedValue = Record<string, string>;

interface LocalizedAltTextInputProps {
  value: LocalizedString;
  schema: FieldSchema<ExtensionParms>;
  readOnly: boolean;
  locales: LocalModel[];
  onChange: (value: LocalizedString) => void;
}

function initialValues(
  locales: LocalModel[],
  initalValue: LocalizedString,
): LocalizedValue {
  const values = locales.reduce((acc, value) => {
    const localisedValue =
      initalValue?.values?.find(({ locale }) => value.locale === locale) || "";
    if (localisedValue) {
      return Object.assign(acc, { [value.locale]: localisedValue.value });
    }

    return Object.assign(acc, { [value.locale]: "" });
  }, {});

  return values;
}

function autoCaptionValues(locales: LocalModel[], altText: AltText) {
  const values = locales.reduce((acc, value) => {
    if (altText?.locales[value.locale]) {
      return Object.assign(acc, {
        [value.locale]: altText?.locales[value.locale],
      });
    }

    return Object.assign(acc, { [value.locale]: "" });
  }, {});

  return values;
}

function transformToLocalizedString(
  localizedValue: LocalizedValue,
): LocalizedString {
  return {
    values: Object.entries(localizedValue || {})
      .filter(([, value]) => value)
      .map(([locale, value]) => ({
        locale,
        value,
      })),
    _meta: {
      schema:
        "http://bigcontent.io/cms/schema/v1/core#/definitions/localized-value",
    },
  };
}

export function LocalizedAltTextInput({
  value,
  schema,
  readOnly,
  locales,
  onChange,
}: LocalizedAltTextInputProps) {
  const { withHeader, collapsed } = useUiParams();
  const { altText, fetchAltText } = useAltText();
  const { autoCaptionEnabled } = useAutoCaption();

  const [loading, setLoading] = useState(false);
  const [localizedValue, setLocalizedValue] = useState<LocalizedValue>(
    initialValues(locales, value),
  );
  const [open, setOpen] = useState<boolean>(!collapsed);

  const [preventAutoCaption, setPreventAutoCaption] = useState(false);

  const handleClick = (locale: string) => {
    const updated = Object.assign({}, localizedValue, {
      [locale]: altText?.locales[locale],
    });

    setLocalizedValue(updated);
    onChange(transformToLocalizedString(updated));
  };

  const handleChange = (locale: string, value: string) => {
    const updated = Object.assign({}, localizedValue, {
      [locale]: value,
    });

    setLocalizedValue(updated);
    onChange(transformToLocalizedString(updated));
  };

  const handleRefetch = async () => {
    setLoading(true);
    setPreventAutoCaption(true);

    await fetchAltText();

    if (altText) {
      const captionedValues = autoCaptionValues(locales, altText);
      setLocalizedValue(captionedValues);
      onChange(transformToLocalizedString(captionedValues));
    }
    setLoading(false);
    setPreventAutoCaption(false);
  };

  useEffect(() => {
    if (preventAutoCaption) {
      return;
    }

    if (autoCaptionEnabled && altText) {
      const captionedValues = autoCaptionValues(locales, altText);
      setLocalizedValue(captionedValues);
      onChange(transformToLocalizedString(captionedValues));
    }
  }, [altText, autoCaptionEnabled, locales, onChange, preventAutoCaption]);

  useEffect(() => {
    setOpen(!collapsed);
  }, [collapsed]);

  return (
    <>
      <CollapsibleContainer
        open={open}
        title={withHeader && schema.title}
        description={withHeader && schema.description}
        setOpen={setOpen}
      >
        <Flex
          justify="flex-end"
          gap="sm"
          mt="sm"
          mb="sm"
          wrap="wrap"
          align="center"
        >
          {loading && (
            <Loader
              size="xs"
              color={theme.other?.colors?.amp_ocean.amp_ocean_30}
            />
          )}
          <Tooltip
            label="Fetch ALT Text from Content Hub for all available locales"
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
              disabled={loading}
            >
              Refresh
            </Button>
          </Tooltip>
        </Flex>

        {Object.entries(localizedValue || {}).map(([locale, localeValue]) => (
          <TextInput
            key={locale}
            title={schema.title}
            fieldSchema={schema}
            value={localeValue}
            onChange={(value: string) => handleChange(locale, value)}
            readOnly={readOnly}
            titleRightSection={<LocaleBadge locale={locale} />}
            mt="sm"
            mb="sm"
            ml="0"
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
                {altText?.locales[locale] && (
                  <Tooltip
                    label="Refresh with the latest ALT text for this locale"
                    position="top"
                    offset={5}
                  >
                    <IconButton
                      variant="subtle"
                      onClick={() => handleClick(locale)}
                      disabled={loading}
                    >
                      <IconWorldShare size={20} stroke={2} />
                    </IconButton>
                  </Tooltip>
                )}
              </>
            }
          />
        ))}
      </CollapsibleContainer>
    </>
  );
}
