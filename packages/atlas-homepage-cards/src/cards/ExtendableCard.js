import React from 'react'
import PropTypes from 'prop-types'

import EbiSpeciesIcon from 'react-ebi-species'

import renderContentListItems from './renderContentListItems'
import cardPropTypes from './cardPropTypes'
import styled from 'styled-components'

const MAX = 5

const CardContentList = styled.ul`
  list-style: none;
  width: 80%;
  margin-left: auto;
  margin-right: auto;
`

class ExtendableSpeciesCard extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isHidden: this.props.content && this.props.content.length >= MAX
    }
    this.onClick = this.onClick.bind(this)
  }

  onClick() {
    this.setState({
      isHidden: !this.state.isHidden
    })
  }

  render() {
    const { iconType, iconSrc, description, content } = this.props
    const visibleContent = Array.isArray(content) && renderContentListItems(content)

    const cardHero =
      iconType === `species` ?
        <span style={{fontSize: `8rem`}}><EbiSpeciesIcon species={iconSrc} /></span> :
      // iconType === `image` ?  // Margin picked by trial and error to match EbiSpeciesIcon of size 8rem
        <img src={iconSrc} style={{height: `8rem`, marginBottom: `2.35rem`, marginTop: `2.50rem`}}/>

    return (
      <div style={{marginBottom:0, paddingBottom: `2rem`, textAlign: `center`}}>
        {
          description && (
            description.url ?
              <h4><a href={description.url}>{description.text}</a></h4> :
              <h4>{description.text}</h4>
            )
        }

        {
          description && (
            description.url ?
              <a href={description.url} style={{borderBottom: 0}}>{cardHero}</a> :
              cardHero
            )
        }

        <CardContentList className={`content`}>
        {
          this.state.isHidden ?
            visibleContent.slice(0, MAX) :
            visibleContent
        }
        </CardContentList>
        {
          Array.isArray(content) && content.length > MAX &&
          <button className={`button`} onClick={this.onClick}>{this.state.isHidden ? `Show all` : `Show fewer`}</button>
        }
      </div>
    )
  }
}

ExtendableSpeciesCard.propTypes = cardPropTypes

export default ExtendableSpeciesCard
