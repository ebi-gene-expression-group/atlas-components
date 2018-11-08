import React from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'

import ebiVfReactSelectReplacements from './ebiVfReactSelectReplacements'

const _onlyUnique = (value, index, self) => self.indexOf(value) === index

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

class LabelledSelect extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      value: props.value
    }

    this.onChange = this._onChange.bind(this)
  }

  _onChange(selectedOption) {
    this.setState({ value: selectedOption.value })
    this.props.onChange(selectedOption)
  }

  render() {
    const { name, topGroup, bottomGroup, bottomGroupLabel, onChange, statusMessage } = this.props

    const isDisabled = Boolean(statusMessage)

    const topOptions =
      topGroup
        .filter(_onlyUnique)
        .map(_makeOption)

    const bottomOptions = {
      label: bottomGroupLabel,
      options: [``].concat(bottomGroup)
        .filter(_onlyUnique)
        .sort()
        .map(_makeOption)
    }

    const selectedOption =
      topOptions.concat(bottomOptions.options).find(option => option.value === this.state.value) ||
      bottomOptions.options[0]

    const capitalisedName = name.charAt(0).toUpperCase() + name.slice(1)

    return (
      <div>
        <label htmlFor={name}>{capitalisedName}</label>
        <Select
          name={name}
          components={{ IndicatorSeparator: null, DropdownIndicator: ebiVfReactSelectReplacements.DropdownIndicator }}
          styles={ebiVfReactSelectReplacements.styles}
          inputId={`${name}-input`}
          isSearchable={false}
          onChange={this.onChange}
          options={topOptions.concat(bottomOptions)}
          isDisabled={isDisabled}
          placeholder={isDisabled ? statusMessage : null}
          value={isDisabled ? null : selectedOption} />
      </div>
    )
  }
}

LabelledSelect.propTypes = {
  name: PropTypes.string,
  topGroup: PropTypes.arrayOf(PropTypes.string),
  bottomGroup: PropTypes.arrayOf(PropTypes.string),
  bottomGroupLabel: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  statusMessage: PropTypes.string,
}

LabelledSelect.defaultProps = {
  name: `Select`,
  topGroup: [],
  bottomGroup: [],
  bottomGroupLabel: `All`,
  statusMessage: null
}

export default LabelledSelect
