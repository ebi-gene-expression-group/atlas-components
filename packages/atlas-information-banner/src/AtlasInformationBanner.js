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
            <b>We need your help!</b>
          </p>
          <p>
            If you’ve ever found our data helpful, please take our impact survey (15 min). Your replies will
            help keep the data flowing to the scientific community.
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
