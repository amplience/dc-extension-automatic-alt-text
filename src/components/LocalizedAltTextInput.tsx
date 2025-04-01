import { Button, IconButton, LocaleBadge, TextInput } from "@amplience/ui-core";
import { LocalizedString } from "../hooks/useExtension";
import { IconArrowRight } from "@tabler/icons-react";
import { useState } from "react";
import { LocalModel } from "dc-extensions-sdk";
import { Flex, Loader } from "@mantine/core";

import { useAltText } from "../hooks/useAltText";

type LocalizedValue = Record<string, string>;

interface LocalizedAltTextInputProps {
  value: LocalizedString;
  schema: Record<string, unknown>;
  readOnly: boolean;
  locales: LocalModel[];
  onChange: (value: LocalizedString) => void;
}

function defaultValues(
  locales: LocalModel[],
  initalValue: LocalizedString
): LocalizedValue {
  const values = locales.reduce((acc, value) => {
    if (initalValue && initalValue.values && initalValue.values.length) {
      const text =
        initalValue.values.find(({ locale }) => value.locale === locale) || "";

      return Object.assign(acc, { [value.locale]: text.value });
    }

    return Object.assign(acc, { [value.locale]: "" });
  }, {});

  return values;
}

function transformToLocalizedString(localizedValue: LocalizedValue) {
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

  const [loading, setLoading] = useState(false);
  const [localizedValue, setLocalizedValue] = useState<LocalizedValue>(
    defaultValues(locales, value)
  );

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
    await fetchAltText();

    const updatedObject = Object.entries(localizedValue).reduce(
      (acc, [key]) => {
        acc[key] = altText?.locales[key] || "";
        return acc;
      },
      {} as Record<string, string>
    );

    setLocalizedValue(updatedObject);
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
                  <IconArrowRight size={18} stroke={1.5} />
                </IconButton>
              )}
            </>
          }
        />
      ))}
    </>
  );
}
