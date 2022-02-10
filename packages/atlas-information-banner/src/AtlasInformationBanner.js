import React from 'react'

class AtlasInformationBanner extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      visibility: ``
    }
  }

  render() {
    return(
      <div className={`row`} style={{display: this.state.visibility}}>
        <div className={`columns small-11`}>
          <p>
            <b>Help us improve Expression Atlas!</b>
          </p>
          <p>
						We are continuously developing the resource to deliver the best possible service for the community.
						Please take two minutes to fill out our user survey and help us make Expression Atlas even better.
          </p>
          <a target={`_blank`} href={`https://www.surveymonkey.co.uk/r/EAsurvey22`} className={`button`}>Take survey</a>
        </div>
        <div className={`columns small-1`}>
          <a href={`#`} onClick={ () => this.setState({visibility: `none`}) } style={{fontSize:`xx-large`, border: `none`}}>&times;</a>
        </div>
      </div>
    )
  }
}

export default AtlasInformationBanner
