# Faceted Search Results for Single Cell Expression Atlas

[![Build Status](https://travis-ci.org/ebi-gene-expression-group/scxa-faceted-search-results.svg?branch=master)](https://travis-ci.org/ebi-gene-expression-group/scxa-faceted-search-results) [![Coverage Status](https://coveralls.io/repos/github/ebi-gene-expression-group/scxa-faceted-search-results/badge.svg?branch=master)](https://coveralls.io/github/ebi-gene-expression-group/scxa-faceted-search-results?branch=master)

A lightweight and extensible component to list and filter lists of search results. It receives a URL (as a combination
of `host` and `resource`) to async-fetch the results, and a React component to visualise each element (e.g. a card).

The only imposed contract is that the JSON payload contains a `results` array where each element is an object
containing, in turn, a mandatory `element` object of arbitrary shape (the result itself) with an optional array of
`facets` (objects with the fields `group`, `value` and `label`). The facets are used to render a sidebar on the left as
a set of filtering controls. Filter groups can be displayed either as searchable, multiselect dropdown lists
(the default), or as checkboxes. You can optionally hide group titles.

The prop `ResultElementComponent` must be coupled to the shape of your `element` objects to be shown correctly.

Detailed information coming soon!

## Example
[Demo here](https://ebi-gene-expression-group.github.io/scxa-faceted-search-results/html/filter-list.html).

```
<div style={{border: `2px solid grey`, marginBottom: `0.5rem`, borderRadius: `4px`, padding: `0.25rem`}}>
  {title}
</div>
```

```
[
  {
    "element": {
      "title": "Raising Gazorpazorp"
    },
    "facets": [
      {
        "group": "Planet",
        "value": "gazorpazorp",
        "label": "Gazorpazorp"
      },
      {
        "group": "Guest character",
        "value": "gwendolyn",
        "label": "Gwendolyn"
      },
      {
        "group": "Guest character",
        "value": "ma-sha",
        "label": "Ma-Sha"
      },
      {
        "group": "Season",
        "value": "1",
        "label": "1"
      }
    ]
  },
  {
    "element": {
      "title": "The wedding squanchers"
    },
    "facets": [
      {
        "group": "Planet",
        "value": "squanch",
        "label": "Squanch"
      },
      {
        "group": "Guest character",
        "value": "birdperson",
        "label": "Birdperson"
      },
      {
        "group": "Guest character",
        "value": "squanchy",
        "label": "Squanchy"
      },
      {
        "group": "Season",
        "value": "2",
        "label": "2"
      }
    ]
  },
  {
    "element": {
      "title": "The Rickshank redemption"
    },
    "facets": [
      {
        "group": "Guest character",
        "value": "birdperson",
        "label": "Birdperson"
      },
      {
        "group": "Planet",
        "value": "buttworld",
        "label": "Buttworld"
      },
      {
        "group": "Season",
        "value": "3",
        "label": "3"
      }
    ]
  },
  {
    "element": {
      "title": "Ricksy business"
    },
    "facets": [
      {
        "group": "Guest character",
        "value": "squanchy",
        "label": "Squanchy"
      },
      {
        "group": "Guest character",
        "value": "abradolf_lincler",
        "label": "Abradolf Lincler"
      },
      {
        "group": "Planet",
        "value": "buttworld",
        "label": "Buttworld"
      },
      {
        "group": "Season",
        "value": "1",
        "label": "1"
      }
    ]
  },
  {
    "element": {
      "title": "Close Rick-counters of the Rick kind"
    },
    "facets": [
      {
        "group": "Guest character",
        "value": "ricktiminus_sancheziminius",
        "label": "Ricktiminus Sancheziminius"
      },
      {
        "group": "Guest character",
        "value": "abradolf_lincler",
        "label": "Abradolf Lincler"
      },
      {
        "group": "Planet",
        "value": "buttworld",
        "label": "Buttworld"
      },
      {
        "group": "Season",
        "value": "1",
        "label": "1"
      }
    ]
  }
]
```

# TODO
- Refactor `FetchLoader` as a HOC. This makes it highly reusable and will let clients of this component get the results
however they prefer.
