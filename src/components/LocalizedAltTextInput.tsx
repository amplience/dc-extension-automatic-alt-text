import { Button, IconButton, LocaleBadge, TextInput } from "@amplience/ui-core";
import { LocalizedString } from "../hooks/useExtension";
import { IconAlt } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { LocalModel } from "dc-extensions-sdk";
import { Flex, Loader } from "@mantine/core";

import { AltText, useAltText } from "../hooks/useAltText";
import { useAutoCaption } from "../hooks/useAutoCaption";

type LocalizedValue = Record<string, string>;

interface LocalizedAltTextInputProps {
  value: LocalizedString;
  schema: Record<string, unknown>;
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
  const { altText, fetchAltText } = useAltText();
  const { autoCaptionEnabled } = useAutoCaption();

  const [loading, setLoading] = useState(false);
  const [localizedValue, setLocalizedValue] = useState<LocalizedValue>(
    initialValues(locales, value),
  );

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

  return (
    <>
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
          rightSection={
            <>
              {altText?.locales[locale] && (
                <IconButton onClick={() => handleClick(locale)}>
                  <IconAlt size={18} stroke={1.5} />
                </IconButton>
              )}
            </>
          }
        />
      ))}
    </>
  );
}
