# Bioentity Information Card for Expression Atlas

[![Build Status](https://travis-ci.org/ebi-gene-expression-group/atlas-bioentity-information.svg?branch=master)](https://travis-ci.org/ebi-gene-expression-group/atlas-bioentity-information) [![Coverage Status](https://coveralls.io/repos/github/ebi-gene-expression-group/atlas-bioentity-information/badge.svg?branch=master)](https://coveralls.io/github/ebi-gene-expression-group/atlas-bioentity-information?branch=master)

## React component
```javascript
import BioentityInformation from '@ebi-gene-expression-group/atlas-bioentity-information'

ReactDOM.render(
  <BioentityInformation
    className={`foobar`}
    bioentityProperties={
      {
        type: `expression_atlas`,
        name: `Expression Atlas`,
        values: [
          {
            text: `ENSG00000012048`,
            url: `https://www.ebi.ac.uk/gxa/genes/ENSG00000012048`,
            relevance: 0
          }
        ]
      }
    }/>,
  node)
```

** Deprecated legacy mode, will be removed in next major version **
## Render convenience method with [Atlas React Fetch Loader](https://github.com/ebi-gene-expression-group/atlas-components/tree/master/packages/atlas-react-fetch-loader)
```javascript
import { render } from '@ebi-gene-expression-group/atlas-bioentity-information'

render(
  {
    host: `https://www.ebi.ac.uk/gxa/sc`,
    geneId: `ENSG00000012048`
  },
  node)
)
```
