import React from 'react'
import PropTypes from 'prop-types'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'

// We’re leveraging EBI Visual Framework (i.e. Foundation) to make the component functional. See this package’s
// html/index.html for a working example with all the necessary boilerplate.
// For vanilla HTML see version 1 of this component.
const AtlasInformationBanner = ({motd}) => {
  return (typeof motd === `string` && motd.trim().length > 0) ?
    (
      <div className={`callout`} data-closable={``}>
        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{motd}</ReactMarkdown>
        <button className={`close-button`} aria-label={`Dismiss information banner`} type={`button`} data-close={``}>
          <span aria-hidden={true}>&times;</span>
        </button>
      </div>
    ) :
    null
}

AtlasInformationBanner.propTypes = {
  motd: PropTypes.string.isRequired
}

export default AtlasInformationBanner
