import React from 'react'
import PropTypes from 'prop-types'
import URI from 'urijs'

import Autocomplete from './Autocomplete'
import SpeciesSelect from './SpeciesSelect'

class GeneSearchForm extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      // A JSON-formatted query object with two fields, term and category
      query: {},
      selectedSpecies: props.defaultSpecies
    }

    this.speciesSelectOnChange = this._speciesSelectOnChange.bind(this)
    this.autocompleteOnChange = this._autocompleteOnChange.bind(this)
  }

  _autocompleteOnChange(selectedItem) {
    this.setState({
      query: selectedItem ?
        JSON.parse(selectedItem.value) :
        {}
    })
  }

  _speciesSelectOnChange(event) {
    this.setState({ selectedSpecies: event.target.value })
  }

  render() {
    const {wrapperClassName, actionEndpoint} = this.props

    const {autocompleteClassName, atlasUrl, suggesterEndpoint, defaultValue} = this.props

    const {enableSpeciesSelect, speciesSelectClassName, speciesSelectStatusMessage} = this.props
    const {allSpecies, topSpecies} = this.props

    return (
      <form action={URI(actionEndpoint, atlasUrl).toString()} method={`post`}>
        <div className={wrapperClassName}>
          <div className={autocompleteClassName}>
            <Autocomplete atlasUrl={atlasUrl}
                          suggesterEndpoint={suggesterEndpoint}
                          onChange={this.autocompleteOnChange}
                          selectedSpecies={this.state.selectedSpecies}
                          allSpecies={allSpecies}
                          defaultValue={defaultValue}/>
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
        <div className={wrapperClassName}>
          <div className={`small-12 columns`}>
            <button type={`Submit`}
                    className={`button`}
                    disabled={!this.state.query.term || this.state.query.term.trim() === ``}>
                    Search
            </button>
          </div>
        </div>
      </form>
    )
  }
}

GeneSearchForm.propTypes = {
  atlasUrl: PropTypes.string.isRequired,
  actionEndpoint: PropTypes.string.isRequired,
  wrapperClassName: PropTypes.string,

  autocompleteClassName: PropTypes.string,
  suggesterEndpoint: PropTypes.string.isRequired,
  defaultValue: PropTypes.shape({
    term: PropTypes.string,
    category: PropTypes.string
  }),

  enableSpeciesSelect: PropTypes.bool,
  speciesSelectClassName: PropTypes.string,
  allSpecies: PropTypes.arrayOf(PropTypes.string),
  topSpecies: PropTypes.arrayOf(PropTypes.string),
  defaultSpecies: PropTypes.string,

  speciesSelectStatusMessage: PropTypes.string
}

GeneSearchForm.defaultProps = {
  wrapperClassName: ``,
  autocompleteClassName: ``,
  defaultValue: {},
  enableSpeciesSelect: false,
  speciesSelectClassName: ``,
  allSpecies: [],
  topSpecies: [],
  defaultSpecies: ``,
  speciesSelectStatusMessage: ``
}

export default GeneSearchForm
