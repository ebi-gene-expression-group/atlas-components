import React from 'react'

// We’re leveraging EBI Visual Framework (i.e. Foundation) to make the component functional. See this package’s
// html/index.html for a working example with all the necessary boilerplate.
// For vanilla HTML see version 1 of this component.
const AtlasInformationBanner = () => {
  return (
    <div className={`callout`} data-closable={``}>
      <b>Help us improve Single Cell Expression Atlas</b>
      <p>
        We are continuously developing the resource to deliver the best possible service for the community;
        Please take two minutes to fill out our user survey and help us make Expression Atlas even better.
      </p>
      <a target={`_blank`} href="https://www.surveymonkey.co.uk/r/SCEAsurvey22" className="button">Take survey</a>
      <button className={`close-button`} aria-label={`Dismiss information banner`} type={`button`} data-close={``}>
        <span aria-hidden={true}>&times;</span>
      </button>
    </div>
  )
}

export default AtlasInformationBanner
