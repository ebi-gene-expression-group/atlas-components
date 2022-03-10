import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'

const motd =
`
**Help us improve Single Cell Expression Atlas**

We are continuously developing the resource to deliver the best possible service for the community;
Please take two minutes to fill out our user survey and help us make Expression Atlas even better.

<a target={_blank} href="https://www.surveymonkey.co.uk/r/SCEAsurvey22" class="button">Take survey</a>
`

// We’re leveraging EBI Visual Framework (i.e. Foundation) to make the component functional. See this package’s
// html/index.html for a working example with all the necessary boilerplate.
// For vanilla HTML see version 1 of this component.
const AtlasInformationBanner = () => {
  return (
    <div className={`callout`} data-closable={``}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{motd}</ReactMarkdown>
      <button className={`close-button`} aria-label={`Dismiss information banner`} type={`button`} data-close={``}>
        <span aria-hidden={true}>&times;</span>
      </button>
    </div>
  )
}

export default AtlasInformationBanner
