import { IconButton, LocaleBadge, TextInput } from "@amplience/ui-core";
import { AltText, LocalizedString } from "../hooks/useExtension";
import { IconArrowRight } from "@tabler/icons-react";
import { useState } from "react";
import { LocalModel } from "dc-extensions-sdk";

type LocalizedValue = Record<string, string>;

interface LocalizedAltTextInputProps {
  value: LocalizedString;
  altText?: AltText;
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
  altText,
  schema,
  readOnly,
  locales,
  onChange,
}: LocalizedAltTextInputProps) {
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

  return (
    <>
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
