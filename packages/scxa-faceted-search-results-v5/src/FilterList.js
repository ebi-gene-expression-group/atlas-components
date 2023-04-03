import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
class FilterList extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      ascending: false,
      sortTitle: props.sortTitle
    }

    this.sortEntries = this.sortEntries.bind(this)
  }
  sortEntries(attribute){
    this.setState({
      sortTitle: attribute,
      ascending: !this.state.ascending
    })
  }

  render() {
    const {filteredResults, resultsMessage, ResultsHeaderClass, ResultElementClass} = this.props

    const filteredElements = _.sortBy(filteredResults, this.state.sortTitle)
    const sortedElements = this.state.ascending ? filteredElements :  filteredElements.reverse()

    return (
      <div id={`filterList`}>
        <h4>{resultsMessage}</h4>
        { sortedElements.length && <ResultsHeaderClass onClick={this.sortEntries}/> }
        { sortedElements.map((element, index) => <div key={index}><ResultElementClass {...element}/></div>) }
      </div>
    )
  }
}

FilterList.propTypes = {
  filteredResults: PropTypes.arrayOf(PropTypes.object).isRequired,
  resultsMessage: PropTypes.string,
  ResultsHeaderClass: PropTypes.func,
  ResultElementClass: PropTypes.func.isRequired,
  sortTitle: PropTypes.string
}

FilterList.defaultProps = {
  resultsMessage: ``
}

export default FilterList
