import React from 'react'
import PropTypes from 'prop-types'
import URI from 'urijs'

import AsyncCreatableSelect from 'react-select/async-creatable'
import ebiVfReactSelectReplacements from './ebiVfReactSelectReplacements'

const _asyncFetchOptions = (atlasUrl, suggesterEndpoint, selectedSpecies, allSpecies) =>
  async (inputValue) => {
    const suggesterUrl = URI(suggesterEndpoint, atlasUrl).search({
      query: inputValue,
      species: selectedSpecies || allSpecies.join(`,`)
    }).toString()

    const response = await fetch(suggesterUrl)
    if (response.ok) {
      return await response.json()
    }
    throw new Error(`${suggesterUrl} => ${response.status}`)
  }

const Autocomplete = ({atlasUrl, suggesterEndpoint, selectedSpecies, allSpecies, onChange, defaultValue}) => {
  const _defaultValue = defaultValue.term && defaultValue.term.trim() ?
    {
      label: defaultValue.term.trim(),
      value: defaultValue.category && defaultValue.category.trim() ?
        JSON.stringify(defaultValue) :
        JSON.stringify({term: defaultValue.term.trim(), category: `q`})
    } :
    null

  return (
    <div>
      <label htmlFor={`geneQuery`}>Gene ID or gene symbol</label>
      <AsyncCreatableSelect
        name={`geneQuery`}
        components={{ DropdownIndicator: null, IndicatorSeparator: null }}
        styles={ebiVfReactSelectReplacements.styles}
        inputId={`gene-input`}
        onChange={onChange}
        loadOptions={_asyncFetchOptions(atlasUrl, suggesterEndpoint, selectedSpecies, allSpecies)}
        noOptionsMessage={() => null}
        allowCreateWhileLoading={true}
        isClearable={true}
        createOptionPosition={`first`}
        formatCreateLabel={(inputValue) => inputValue}
        isValidNewOption={(inputValue) => inputValue.trim() !== ``}
        getNewOptionData={(inputValue) => ({
          label: inputValue,
          value: JSON.stringify({term: inputValue, category: `q`})
        })}
        placeholder={``}
        defaultValue={_defaultValue}/>
    </div>
  )
}

Autocomplete.propTypes = {
  atlasUrl: PropTypes.string.isRequired,
  suggesterEndpoint: PropTypes.string.isRequired,
  selectedSpecies: PropTypes.string,
  allSpecies: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func.isRequired,
  defaultValue: PropTypes.shape({
    term: PropTypes.string,
    category: PropTypes.string
  })
}

Autocomplete.defaultProps = {
  allSpecies: [],
  defaultValue: {}
}

export default Autocomplete
