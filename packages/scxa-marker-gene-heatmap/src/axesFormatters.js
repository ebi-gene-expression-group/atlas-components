import React from 'react'
import PropTypes from 'prop-types'
import ReactDOMServer from 'react-dom/server'

import escapedHtmlDecoder from 'he'

const reactToHtml = component => escapedHtmlDecoder.decode(ReactDOMServer.renderToStaticMarkup(component))

const YAxisLabel = ({species, geneSymbol}) => {
  const geneSearchResultUrl = `https://www.ebi.ac.uk/gxa/sc/search?q=${geneSymbol}&species=${species}`
  return <a href={geneSearchResultUrl} style={{border: `none`, color: `#148ff3`}}>
    {geneSymbol}
  </a>
}

YAxisLabel.propTypes = {
  species: PropTypes.string.isRequired,
  geneSymbol: PropTypes.string.isRequired
}

const YAxisFormatter = (species, geneSymbol) => {
  return reactToHtml(
    <YAxisLabel
      species={species}
      geneSymbol={geneSymbol}
    />
  )
}

export default YAxisFormatter