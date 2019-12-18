# Expression Atlas homepage cards

[![Build Status](https://travis-ci.org/ebi-gene-expression-group/atlas-homepage-cards.svg?branch=master)](https://travis-ci.org/ebi-gene-expression-group/atlas-homepage-cards)
[![Coverage Status](https://coveralls.io/repos/github/ebi-gene-expression-group/atlas-homepage-cards/badge.svg?branch=master)](https://coveralls.io/github/ebi-gene-expression-group/atlas-homepage-cards?branch=master)

## About the component
This repository contains a generic React component that renders grids of cards which adhere to the following JSON
schema (defined using [JSONSchema draft-07](http://json-schema.org/specification.html)):

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

## Types of cards
The package export two different card components. A card component should be able to render both types of cards
`species` and `image`. The generic `Card`, used by default in `ResponsiveCardsRow`, is laid out with the icon on top,
the tile below and the list of items at the bottom. `ExtendableCard`, instead shows the title on top, followed by the
card’s icon and a foldable list of items: five are shown plus a toggle button that expands the list and folds it.

## Getting started
Install dependencies
```
npm install
```

Use [webpack-dev-server](https://github.com/webpack/webpack-dev-server) to see the demo page:
```
npx webpack-dev-server -d
```
