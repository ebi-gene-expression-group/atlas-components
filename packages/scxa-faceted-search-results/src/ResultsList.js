import React from 'react'
import PropTypes from 'prop-types'

class ResultsList extends React.Component {
  constructor(props) {
    super(props)

    this.state = {

    }
  }

  render() {

  }
}

ResultsList.propTypes = {
  facetGroups: PropTypes.arrayOf(PropTypes.shape({
    facetName: PropTypes.string.isRequired,
    facetItem: PropTypes.arrayOf(PropTypes.string).isRequired
  })).isRequired
}

export default ResultsList
