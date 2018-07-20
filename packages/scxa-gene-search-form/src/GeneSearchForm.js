import React from 'react'
import PropTypes from 'prop-types'

import SpeciesSelect from './SpeciesSelect'

class GeneSearchForm extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedSpecies: props.defaultSpecies
    }

    this.speciesSelectOnChange = this._speciesSelectOnChange.bind(this)
  }

  _speciesSelectOnChange(event) {
    this.setState({ selectedSpecies: event.target.value })
  }

  render() {
    const {wrapperClassName, actionEndpoint} = this.props

    const {autocompleteClassName} = this.props

    const {enableSpeciesSelect, speciesSelectClassName, speciesSelectStatusMessage} = this.props
    const {allSpecies, topSpecies} = this.props

    return (
      <div className={wrapperClassName}>
        <form action={actionEndpoint} method={`post`}>
          <div className={`row`}>
            <div className={autocompleteClassName}>
              React-Select goes here...
            </div>
            { enableSpeciesSelect &&
              <div className={speciesSelectClassName}>
                <SpeciesSelect allSpecies={allSpecies}
                               topSpecies={topSpecies}
                               statusMessage={speciesSelectStatusMessage}
                               selectedValue={this.state.selectedSpecies}
                               onChange={this.speciesSelectOnChange}/>
              </div>
            }
          </div>
          <div className={`row`}>
              <div className={`small-12 columns`}>
                  <button className={`button`} type={`submit`} value={`Search`}>Search</button>
              </div>
          </div>
        </form>
      </div>
    )
  }
}

GeneSearchForm.propTypes = {
  wrapperClassName: PropTypes.string,
  actionEndpoint: PropTypes.string.isRequired,

  autocompleteClassName: PropTypes.string,
  suggesterEndpoint: PropTypes.string.isRequired,
  defaultValue: PropTypes.shape({
    queryTerm: PropTypes.string.isRequired,
    category: PropTypes.string
  }),

  enableSpeciesSelect: PropTypes.bool,
  speciesSelectClassName: PropTypes.string,
  allSpecies: PropTypes.arrayOf(PropTypes.string),
  topSpecies: PropTypes.arrayOf(PropTypes.string),
  defaultSpecies: PropTypes.string,

  speciesSelectStatusMessage: PropTypes.string
}

export default GeneSearchForm
