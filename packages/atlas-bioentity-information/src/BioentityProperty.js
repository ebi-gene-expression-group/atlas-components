import React from 'react'
import PropTypes from 'prop-types'


const PropertyValue = ({ isLast, text, url }) =>
  url ?
    <span>
      <a
        href={url}
        target={`_blank`}>
        {text}
      </a>{!isLast ? `, ` : ``}
    </span> :
    <span>
      {text + (!isLast ? `, ` : ``)}
    </span>

PropertyValue.propTypes = {
  isLast: PropTypes.bool.isRequired,
  text: PropTypes.string.isRequired,
  url: PropTypes.string
}

const TOP_RELEVANT_VALUES = 3

class BioentityProperty extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showAll: false
    }
  }

  _renderPropertyValues(values) {
    return values.map((value, index) =>
      <PropertyValue
        key={value.text}
        isLast={index >= values.length - 1}
        text={value.text}
        url={value.url}/>
    )
  }

  render() {
    const numberOfHiddenLinks = this.props.values.length - TOP_RELEVANT_VALUES
    const hasOptionalLinks = [ `go`, `po` ].includes(this.props.type) && numberOfHiddenLinks > 0

    const showMoreLessButton =
      <a
        key={`showButton`}
        role={`button`}
        style={{ cursor: `pointer` }}
        onClick={() => this.setState(previousState => ({ showAll: !previousState.showAll }) )}>
        {this.state.showAll ? ` (show fewer)` : ` … and ${numberOfHiddenLinks} more`}
      </a>

    const allValuesWithOptionalLinks = this._renderPropertyValues(this.props.values)
    // Three most relevant links: the properties are sorted in descending order by relevance in the backend
    const topThreeValuesWithOptionalLinks = this._renderPropertyValues(this.props.values.slice(0, TOP_RELEVANT_VALUES))

    return (
      <div>
        {
          !hasOptionalLinks &&
          allValuesWithOptionalLinks
        }

        {
          (hasOptionalLinks && !this.state.showAll) &&
          [
            topThreeValuesWithOptionalLinks,
            showMoreLessButton
          ]
        }

        {
          (hasOptionalLinks && this.state.showAll) &&
          [
            allValuesWithOptionalLinks,
            showMoreLessButton
          ]
        }
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

export { BioentityProperty as default, PropertyValue }
