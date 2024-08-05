import React from 'react'
import PropTypes from 'prop-types'
import URI from 'urijs'

import Autocomplete from './Autocomplete'
import LabelledSelect from './LabelledSelect'
import SearchExamples from './SearchExamples'

class GeneSearchForm extends React.Component {
  constructor (props) {
    super(props)

    const defaultValue = props.defaultValue.term && props.defaultValue.term.trim() ?
      {
        term: props.defaultValue.term.trim(),
        category: props.defaultValue.category && props.defaultValue.category.trim() ?
          props.defaultValue.category :
          `q`
      } :
      {}

    this.state = {
      // A JSON-formatted query object with two fields, term and category
      query: defaultValue,
      selectedSpecies: props.defaultSpecies
    }

    this.speciesSelectOnChange = this._speciesSelectOnChange.bind(this)
    this.autocompleteOnChange = this._autocompleteOnChange.bind(this)
  }

  _autocompleteOnChange (selectedItem) {
    this.setState({
      query: selectedItem ?
        JSON.parse(selectedItem.value) :
        {}
    })
  }

  _speciesSelectOnChange (selectedItem) {
    this.setState({ selectedSpecies: selectedItem.value })
  }

  render () {
    const { wrapperClassName, actionEndpoint, onSubmit, searchExamples } = this.props

    const { autocompleteClassName, host, suggesterEndpoint, defaultValue, autocompleteLabel } = this.props

    const { enableSpeciesSelect, speciesSelectClassName, speciesSelectStatusMessage } = this.props
    const { allSpecies, topSpecies } = this.props

    return (
      <form action={URI(actionEndpoint, host).toString()} method={`post`}>
        <div className={wrapperClassName}>
          <div className={autocompleteClassName} data-cy={`searchTerm`}>
            <Autocomplete
              host={host}
              suggesterEndpoint={suggesterEndpoint}
              onChange={this.autocompleteOnChange}
              selectedSpecies={this.state.selectedSpecies}
              allSpecies={allSpecies}
              defaultValue={defaultValue}
              labelText={autocompleteLabel}/>
          </div>
          { enableSpeciesSelect &&
            <div className={speciesSelectClassName} data-cy={`speciesDropDown`}>
              <LabelledSelect
                name={`speciesDropDown`}
                topGroup={topSpecies}
                bottomGroup={allSpecies}
                bottomGroupLabel={`All species`}
                statusMessage={speciesSelectStatusMessage}
                value={this.state.selectedSpecies}
                onChange={this.speciesSelectOnChange}/>
            </div>
          }
          {
            searchExamples &&
              <div className={`small-12 columns`}>
                <SearchExamples links={searchExamples}/>
              </div>
          }
        </div>
        <div className={wrapperClassName}>
          <div className={`small-12 columns`}>
            <button
              type={`Submit`}
              className={`button`}
              disabled={!this.state.query.term || this.state.query.term.trim() === ``}
              onClick={onSubmit ?
                (event) => {
                  onSubmit(event, this.state.query, this.state.selectedSpecies)
                } :
                null}>
                Search
            </button>
          </div>
        </div>
      </form>
    )
  }
}

GeneSearchForm.propTypes = {
  host: PropTypes.string.isRequired,
  actionEndpoint: PropTypes.string.isRequired,
  onSubmit: PropTypes.func,
  wrapperClassName: PropTypes.string,

  autocompleteLabel: PropTypes.string,
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
  speciesSelectStatusMessage: PropTypes.string,

  searchExamples: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired
  }))
}

GeneSearchForm.defaultProps = {
  autocompleteLabel: `Gene ID or gene symbol`,
  wrapperClassName: ``,
  autocompleteClassName: ``,
  defaultValue: {},
  enableSpeciesSelect: false,
  speciesSelectClassName: ``,
  allSpecies: [],
  topSpecies: []
}

export default GeneSearchForm
