import React from 'react'
import PropTypes from 'prop-types'


const PropertyValue = ({hasUrl, isLast, text, url}) =>
  <span>
    {hasUrl ? (
        <a className={"bioEntityCardLink"} href={url} target="_blank">{text}</a>
      ) : (
        <span>{text}</span>
      )
    }

    {!isLast &&
      <span>, </span>
    }
    </span>

const TOP_RELEVANT_VALUES = 3

class BioentityProperty extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      showAll: false
    }

    this.handleShowMoreClick = this.handleClick.bind(this)
  }

  handleClick() {
    this.setState(previousState => ({
      showAll: !previousState.showAll
    }))
  }

  // Return three most relevant links
  _getMostRelevant(properties) {
    // The properties are sorted in descending order by relevance in the backend
    return properties.slice(0,TOP_RELEVANT_VALUES)
  }

  _renderPropertyValues(values) {
    return values.map((value, index) =>
      <PropertyValue key={value.text}
                     isLast={index >= values.length - 1}
                     hasUrl={!!value.url}
                     text={value.text} url={value.url}/>
    )
  }

  render() {
    const numberOfHiddenLinks = this.props.values.length - TOP_RELEVANT_VALUES
    const hasOptionalLinks = ["go","po"].indexOf(this.props.type) > -1 && numberOfHiddenLinks > 0
    const showMoreLessButton =
      <a key="showButton"
         role="button"
         style={{cursor:`pointer`}}
         onClick={this.handleShowMoreClick}>
          {this.state.showAll ? ` (show less)` : ` … and ${numberOfHiddenLinks} more`}
        </a>

    const allValuesWithOptionalLinks = this._renderPropertyValues(this.props.values)
    const topThreeValuesWithOptionalLinks = this._renderPropertyValues(this._getMostRelevant(this.props.values))

    return (
      <div>
        {!hasOptionalLinks && allValuesWithOptionalLinks}

        {(hasOptionalLinks && !this.state.showAll) &&
        [
          topThreeValuesWithOptionalLinks,
          showMoreLessButton
        ]}

        {(hasOptionalLinks && this.state.showAll) &&
        [
          allValuesWithOptionalLinks,
          showMoreLessButton
        ]}

      </div>
    )
  }
}

BioentityProperty.propTypes = {
  type: PropTypes.string.isRequired,
  values: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    relevance: PropTypes.number.isRequired
  }))
}

export default BioentityProperty