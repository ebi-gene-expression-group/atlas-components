import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import smileyData from './smileyData'
import SmileyDiv from './SmileyDiv'

const SmileyContainer = styled.div`
  display: flex;
  justify-content: space-evenly;
`

class Prompt extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedSmileyScore: 0
    }

    this.onClick = this.onClick.bind(this)
  }

  onClick(selectedSmileyScore) {
    this.setState({
      selectedSmileyScore: selectedSmileyScore
    })
    this.props.onSelect(selectedSmileyScore)
  }

  render() {
    return(
      <div>
        <p style={{paddingBottom: `1rem`}}>How satisfied are you?</p>
        <SmileyContainer>
          {
            smileyData.map((smiley, idx) =>
              <SmileyDiv key={idx} onClick={() => this.onClick(smiley.score)}
                emoji={smiley.emoji}
                label={smiley.label}
                selected={smiley.score === this.state.selectedSmileyScore}/>
            )
          }
        </SmileyContainer>
        <p style={{paddingTop: `1rem`}}>
          <a href={this.props.feedbackFormLink} target={`_blank`}>Click here if you need support.</a>
        </p>
      </div>
    )
  }
}

Prompt.propTypes = {
  onSelect: PropTypes.func.isRequired,
  feedbackFormLink: PropTypes.string.isRequired
}

export default Prompt
