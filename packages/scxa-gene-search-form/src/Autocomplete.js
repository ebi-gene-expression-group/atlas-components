import React from 'react'
import PropTypes from 'prop-types'
import URI from 'urijs'

import AsyncCreatableSelect from 'react-select/lib/AsyncCreatable'

// Stolen from https://ebi.emblstatic.net/web_guidelines/EBI-Framework/v1.3/css/ebi-global.css select
const ebiVfSelectStyles = {
  control: (styles, state) => ({
    minHeight: `2.4375rem`,
    margin: `0 0 1rem`,
    padding: `0`,
    appearance: `none`,
    border: state.isFocused ? `1px solid #8a8a8a` : `1px solid #777`,
    borderRadius: `0`,
    backgroundColor: state.isDisabled ? `#e6e6e6` : `#fefefe`,
    fontFamily: `inherit`,
    fontSize: `1rem`,
    fontWeight: `normal`,
    lineHeight: `1.5`,
    color: `#0a0a0a`,
    transition: `box-shadow 0.5s, border-color 0.25s ease-in-out`,
    outline: state.isFocused ? `none` : `inherit`,
    boxShadow: state.isFocused ? `0 0 5px #777` : `none`,
    cursor: state.isDisabled ? `not-allowed` : `default`,
    display: `flex`
  }),
  menu: (styles, state) => ({
    ...styles,
    borderRadius: `0`,
    padding: `0`
  })
}

const _asyncFetchOptions = (atlasUrl, suggesterEndpoint, selectedSpecies, allSpecies) =>
  async (inputValue) => {
    const suggesterUrl = URI(suggesterEndpoint, atlasUrl).search({
      query: inputValue,
      species: selectedSpecies || allSpecies.join(`,`)
    }).toString()

    const response = await fetch(suggesterUrl)
    if (response.ok) {
      const json = await response.json()
      return json
    }
    throw new Error(`${suggesterUrl} => ${response.status}`)
  }

const Autocomplete = ({atlasUrl, suggesterEndpoint, selectedSpecies, allSpecies, onChange}) =>
[
  <label key={`label`}>Gene ID or gene symbol</label>,
  <AsyncCreatableSelect components={{ DropdownIndicator: null, IndicatorSeparator: null }}
                        styles={ebiVfSelectStyles}
                        onChange={onChange}
                        loadOptions={_asyncFetchOptions(atlasUrl, suggesterEndpoint, selectedSpecies, allSpecies)}
                        noOptionsMessage={() => null}
                        defaultOptions
                        allowCreateWhileLoading={true}
                        isClearable={true}
                        createOptionPosition={`first`}
                        formatCreateLabel={(inputValue) => inputValue}
                        isValidNewOption={(inputValue, selectValue, selectOptions) => inputValue.trim() !== ``}
                        getNewOptionData={(inputValue, optionLabel) => ({label : inputValue, value: JSON.stringify({term: inputValue, category: `q`})}) }
                        placeholder={``}
                        // isMulti
                        name={`geneQuery`}
                        key={`autocomplete`}/>
]

Autocomplete.propTypes = {
  atlasUrl: PropTypes.string.isRequired,
  suggesterEndpoint: PropTypes.string.isRequired,
  selectedSpecies: PropTypes.string,
  allSpecies: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func.isRequired
}

Autocomplete.defaultProps = {
  selectedSpecies: ``,
  allSpecies: []
}

export default Autocomplete
