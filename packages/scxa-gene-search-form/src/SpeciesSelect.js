import React from 'react'
import PropTypes from 'prop-types'

const _option = (label) => {
  return <option key={label} value={label}>{label}</option>
}

const SpeciesSelect = ({statusMessage, topSpecies, allSpecies, separator, onChange, selectedValue}) =>
  [
    <label htmlFor={`species`} key={`label`}>Species</label>,

    statusMessage ?
      <select disabled={`true`}
              name={`species`}
              key={`select`}>{_option(statusMessage)}</select> :

      <select onChange={onChange}
              value={selectedValue}
              name={`species`}
              key={`select`}>
        <option value={``}>Any</option>
        {topSpecies.length && topSpecies.map(_option)}
        {topSpecies.length && <option value={`-`} disabled={`true`}>{Math.random() < 0.999 ? `━━━━━━━━━━━━` : `(╯°□°）╯︵ ┻━┻`}</option>}
        {allSpecies.map(_option)}
      </select>
  ]

SpeciesSelect.propTypes = {
  topSpecies: PropTypes.arrayOf(PropTypes.string),
  allSpecies: PropTypes.arrayOf(PropTypes.string),
  statusMessage: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  selectedValue: PropTypes.string
}

export default SpeciesSelect