# Faceted Search Results for Single Cell Expression Atlas

[![Build Status](https://travis-ci.org/ebi-gene-expression-group/scxa-faceted-search-results.svg?branch=master)](https://travis-ci.org/ebi-gene-expression-group/scxa-faceted-search-results) [![Coverage Status](https://coveralls.io/repos/github/ebi-gene-expression-group/scxa-faceted-search-results/badge.svg?branch=master)](https://coveralls.io/github/ebi-gene-expression-group/scxa-faceted-search-results?branch=master)

A lightweight and extensible component to list and filter lists of search results. It receives a URL (as a combination
of `host` and `resource`) to async-fetch the results, and a React component class to visualise each element (e.g. a
card).

The only imposed contract is that the JSON payload contains a `results` array where each element is an object
containing, in turn, a mandatory `element` object of arbitrary shape (the result itself) with an optional array of
`facets` (objects with the fields `group`, `value` and `label`). The facets are used to render a sidebar on the left as
a set of filtering controls. Filter groups can be displayed either as searchable, multiselect dropdown lists
(the default), or as checkboxes.

The prop `ResultElementClass` must be coupled to the shape of your `element` objects to be shown correctly.

Two more optional props, namely `noResultsMessageFormatter` and `resultsMessageFormatter`, return a string which is
displayed when there are no results, and as a header on top of the search results, respectively. In many occasions it
is useful to display such messages using information returned by the server; that’s the reason why both functions take
the JSON payload as an argument, allowing for some customisation in that regard. For example, if in the case of no
results the server returns a field `reason` you could have something like this:
```
<ReactFacetedSearch
  ...
  noResultsMessageFormatter={(data) => `Your search yielded no results: ${data.reason}`}
```

The sidebar disables/hides options in order to avoid combinations that would produce empty results. However it is not
100% foolproof since you can arrive at a no results state by unchecking options, but disabling an already chosen
facet can potentially lock the user without no apparent reason, resulting in bad UX.

# Try it out
Just run [webpack-dev-server](https://github.com/webpack/webpack-dev-server):
```
npx webpack-dev-server -d
```

# Combining with the EBI Visual Framework
React-Select allows you to style the `div` that encloses the `input` element, but not the `input` element itself.
Therefore it’s convenient to add the snippet below to override the styling set by the
[EBI Visual Framework](https://github.com/ebiwd/EBI-Framework) for `input` elements.
```
.input-clear input, .input-clear input:focus {
  height: unset;
  box-shadow: none;
  margin: 0;
}
```
At the time of writing this applies to the most recent version (v1.3). Wrapping these styles within the appropriate
`div` selector is sufficient. See
https://github.com/ebi-gene-expression-group/scxa-faceted-search-results/blob/master/html/filter-list.html for a
working example.

# A note about building with Webpack
The component uses `async`/`await` to fetch the JSON payload from the server. This requires to prefix the entry with
`@babel/polyfill`. If you are already using an equivalent polyfill or
[Runtime transform](http://babeljs.io/docs/plugins/transform-runtime/) you may skip this.

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
