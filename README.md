# dc-extension-automatic-alt-text

This extension allows customers to use and select Alt Text that has been automatically generated for images in the Amplience Content Hub using the [Automatic Alt Text](https://amplience.com/developers/docs/release-notes/2024/alt-text-generation/) solution which automatically assigns alt text to image assets.

Using this extension can help content creators by automating information required for accessibility and compliance.

For developers, it ensures that the alt text is available in the content form and supports localisation in our delivery api's to minimise requests needed on web applications. 

// TODO: Replace screenshot with finalised UX
![Automatic Alt Text Extension](media/hero-image.png)

## Key features

 - Works with both text and localised text fields
 - Ability to point to any native Amplience image
 - Setting to turn on / off automatic population of fields on image selection
 - Ability to choose locale for text fields
 - Ability to click to refresh all alt text
 - Ability to refresh alt text for individual localised fields
 - Ability to manually create alt text or edit in Dyanmic Content

## How to install

### Register the Extension

This extension must be [registered](https://amplience.com/docs/development/registeringextensions.html) against a hub with in the Dynamic Content application (Development -> Extensions).

![Setup](media/setup.png)

- Category: Content Field
- Label: automatic-alt-text
- Name: Automatic Alt Text _(needs to be unique with the hub)_
- URL: [https://automatic-alt-text.extensions.content.amplience.net](https://automatic-alt-text.extensions.content.amplience.net)
- Description: Extension to automatically pull in available Alt text for an image from the Amplience Content Hub for Compliance _(can be left blank, if you wish)_
- Initial height: 200

### Permissions

![Permissions](media/permissions.png)

API permissions:
- Read access

Sandbox permissions:
- Allow same origin


## Prerequisites

### Automatic Alt Text feature

This extension should be used in conjunction with [Automatic Alt Text](https://amplience.com/developers/docs/release-notes/2024/alt-text-generation/).

Whilst text can still inputted manually without this, if this feature is not enabled it is recommended to have your Alt Text as standard text / localised text fields.

### Dynamic Content Asset Tab

Your Dynamic Content Hub must have the [Asset Tab](https://automatic-alt-text.extensions.content.amplience.net) enabled. This is to ensure API access to get the Alt text meta data for the asset.

## Suggested implementation

When using this extension for alt text for an image, it is recommended that you disable the standard alt text behaviour for your image as to not confuse the content creators with multiple method of inputing alt text.

Image of what is recommended to be disabled:
![Native Media Card Alt Text](media/native-media-card-alt-text.png)

Example:

```json
"image": {
    "title": "Image",
    "allOf": [
        { "$ref": "http://bigcontent.io/cms/schema/v1/core#/definitions/image-link" }
    ],
    "ui:component": {
        "params": {
            "withAltText": false
        }
    }
}   
```

See [Turning off Alt Text for a Media Card](https://amplience.com/developers/docs/dev-tools/assets/image-alt-text/#turning-off-alt-text-on-the-media-card) documentation for more details.




### Assign the extension to schema

To use the alt text extension, simply associate it with an image field and a string field (that represents the caption) in your content type schema.

The string field should be configured to use the `ui:extension` keyword, and use the name that was used to register the extension. An image param must be included to inform the extension which image property it should be linked to.

The `image` param should be a valid [JSON pointer](https://datatracker.ietf.org/doc/html/rfc6901).

```json
{
  "image": {
    "title": "Hero Image",
    "allOf": [
      {
        "$ref": "http://bigcontent.io/cms/schema/v1/core#/definitions/image-link"
      }
    ]
  },
  "alt": {
    "title": "Alt Text",
    "type": "string",
    "minLength": 0,
    "maxLength": 200,
    "ui:extension": {
      "name": "automatic-alt-text",
      "params": {
        "image": "/image"
      }
    }
  }
}
```

## Configuration

You can customize the alt text generator by providing `"params"` in the installation parameters, or inside your content type schema by adding them to `"params"` object in your `"ui:extension"`.

### Image property

The extension must be linked to an image property using a [JSON pointer](https://datatracker.ietf.org/doc/html/rfc6901). When a caption is requested, the extension will use the image assigned to this property as the input.

```json
{
  "image": "/pointer/to/image"
}
```

If the extension is used inside a partial that is included in multiple content types, you can use a [relative JSON pointer](https://www.ietf.org/id/draft-hha-relative-json-pointer-00.html) to define the image field.

```json
{
  "image": {
    "allOf": [
      {
        "$ref": "http://bigcontent.io/cms/schema/v1/core#/definitions/image-link"
      }
    ]
  },
  "alt": {
    "title": "Alt Text",
    "type": "string",
    "minLength": 0,
    "maxLength": 200,
    "ui:extension": {
      "name": "automatic-alt-text",
      "params": {
        "image": "1/image"
      }
    }
  }
}
```

If the extension is used in an array field, the pointer of the image field must be relative to the caption field

```json
{
  "images": {
    "title": "Images with captions",
    "type": "array",
    "minItems": 0,
    "maxItems": 10,
    "items": {
      "type": "object",
      "properties": {
        "image": {
          "title": "Hero Image",
          "allOf": [
            {
              "$ref": "http://bigcontent.io/cms/schema/v1/core#/definitions/image-link"
            }
          ]
        },
        "alt": {
          "title": "Alt Text",
          "type": "string",
          "minLength": 0,
          "maxLength": 200,
          "ui:extension": {
            "name": "automatic-alt-text",
            "params": {
              "image": "/image"
            }
          }
        }
      },
      "propertyOrder": []
    }
  }
}
```

If the extension is used for a localised text field with field level localisation then an example is below:

```json
{
  "image": {
    "allOf": [
      {
        "$ref": "http://bigcontent.io/cms/schema/v1/core#/definitions/image-link"
      }
    ]
  },
  "alt": {
    "title": "Alt Text",
    "allOf": [
        { "$ref": "http://bigcontent.io/cms/schema/v1/localization#/definitions/localized-string" }
    ],
    "minLength": 0,
    "maxLength": 200,
    "ui:extension": {
      "name": "automatic-alt-text",
      "params": {
        "image": "1/image"
      }
    }
  }
}
```



### Auto caption

If enabled, the extension will automatically fetch generated alt text from the image asset when the image property is populated instead of requiring the user to manually press the generate button.

```json
{
  "autoCaption": true
}
```

## Limitations

- This extension is only compatible with hubs that are linked to an organization. Accounts that have not yet [migrated](https://amplience.com/developers/docs/knowledge-center/faqs/account/) from legacy permissions will not see the AI caption feature.
- When using a localised string for Alt text, filtering locales in the form will not filter the localised text fields displayed in the content form.
- When `autoCaption` is enabled, restoring the content item via the version history to a version that doesn't have alt text will send a graphql request that will populate the alt text field.
- Images must be hosted / served by Amplience.
- The Image object that you configure to point to MUST be a standard Amplience image object as per the [data type](https://amplience.com/developers/docs/schema-reference/data-types/#image) and associated image link.
- The extension pulls in alt text from the Amplience Content Hub to be used in Dynamic Content. Any edits / changes are in Dynamic Content only and not saved back to Content Hub.
- Locales in Dynamic Content must match the locales for [Automatic Alt Text](https://amplience.com/developers/docs/release-notes/2024/alt-text-generation/) in Content hub for population.



## Development

> [!IMPORTANT]  
> This extension is built using an unreleased Amplience component library package. Therefore, any local running of the code or customisation are currently for Amplience engineers only until the component library is publically released. This is repository is made public for awareness of how this functionality can be used. 

Run the following to run the extension locally:

```
nvm use
npm install
npm run dev
```

And to build:

```
npm run build
```
