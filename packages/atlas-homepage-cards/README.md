# Expression Atlas homepage cards

[![Build Status](https://travis-ci.org/ebi-gene-expression-group/atlas-homepage-cards.svg?branch=master)](https://travis-ci.org/ebi-gene-expression-group/atlas-homepage-cards)
[![Coverage Status](https://coveralls.io/repos/github/ebi-gene-expression-group/atlas-homepage-cards/badge.svg?branch=master)](https://coveralls.io/github/ebi-gene-expression-group/atlas-homepage-cards?branch=master)

## About the component
This repository contains a generic React component that renders grids of cards which adhere to the following JSON schema (defined using [JSONSchema draft-07](http://json-schema.org/specification.html)):

```
{
    "$schema": "http://json-schema.org/draft-07/schema#",
    "type": "object",
    "title": "Card",
    "required": [
        "iconSrc",
        "iconType"
    ],
    "properties": {
        "iconType": {
            "type": "string",
            "description": "Can have the value 'species' (for react-ebi-species icons) or 'image' (for logos)."
        },
        "iconSrc": {
            "type": "string",
            "description": "For species icons, it should have the name of the species. For images, it should be a URL."
        },
        "description": {
            "$ref": "#/definitions/Content"
        },
        "content": {
            "type": "array",
            "items": {
                "$ref": "#/definitions/Content"
            }
        }
    },
    "definitions": {
        "Content": {
            "type": "object",
            "title": "Content",
            "properties": {
                "text": {
                    "type": "string"
                },
                "url": {
                    "type": "string"
                }
            },
            "required": [
                "text"
            ]
        }
    }
}
```

### React EBI species
One of the supported card types is the `SpeciesCard`, which displays species icons using the [`react-ebi-species`](https://github.com/ebi-gene-expression-group/react-ebi-species) React component.

## Getting started
### Installing dependencies
In order to run the application, you must first install the dependencies using `npm`:
```
npm install
```

### Try it out 
Use [webpack-dev-server](https://github.com/webpack/webpack-dev-server) to run the application in your browser:
```
npx webpack-dev-server -d
```
