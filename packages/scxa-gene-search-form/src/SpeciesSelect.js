import React from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'

import ebiVfReactSelectReplacements from './ebiVfReactSelectReplacements'

const _makeOption = (str) => {
  if (str === ``) {
    return {
      value: ``,
      label: `Any`
    }
  }

  return {
    value: str.trim(),
    label: str.trim()
  }
}

const _onlyUnique = (value, index, self) => self.indexOf(value) === index

const SpeciesSelect = ({topSpecies, allSpecies, statusMessage, onChange, selectedSpecies}) => {
  const topOptions = topSpecies.map(_makeOption)

  const allOptions =
    allSpecies
      .concat(``)
      .map(str => str.trim())
      .filter(_onlyUnique)
      .sort()
      .map(_makeOption)

  const options =
    topOptions
      .concat([{
        label: Math.random() < 0.9999 ? `All species` : `(╯°□°）╯︵ ┻━┻`,
        options: allOptions
      }])

  const selectedValue =
    topOptions
      .concat(allOptions)
      .find(option => option.value === selectedSpecies.trim()) || allOptions[0]

  return (
    <div>
      <label  key={`label`} htmlFor={`species`}>Species</label>
      <Select
        key={`select`}
        name={`species`}
        components={{ IndicatorSeparator: null, DropdownIndicator: ebiVfReactSelectReplacements.DropdownIndicator }}
        styles={ebiVfReactSelectReplacements.styles}
        isSearchable={false}
        onChange={onChange}
        options={options}
        isDisabled={Boolean(statusMessage)}
        defaultValue={Boolean(statusMessage) ? null : selectedValue}
        placeholder={Boolean(statusMessage) ? statusMessage : null} />
    </div>
  )
}

SpeciesSelect.propTypes = {
  topSpecies: PropTypes.arrayOf(PropTypes.string),
  allSpecies: PropTypes.arrayOf(PropTypes.string),
  statusMessage: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  selectedSpecies: PropTypes.string
}

SpeciesSelect.defaultProps = {
  topSpecies: [],
  allSpecies: [],
  statusMessage: ``,
  selectedSpecies: ``
}

export default SpeciesSelect
