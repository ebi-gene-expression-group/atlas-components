import React from 'react'
import PropTypes from 'prop-types'

const TablePreamble =
({
  dropdowns,
  dropdownOnChange,
  rowsCount,
  rowsPerPageOptions,
  rowsPerPage,
  rowsPerPageOnChange,
  searchAll,
  searchAllOnChange,
  className
}) =>
  <React.Fragment>
    {
      dropdowns.map((dropdown, index) =>
        <div
          key={index}
          className={className}>
          <label>{dropdown.label}:
            <select
              defaultValue={dropdown.value || ``}
              onChange={e => dropdownOnChange(dropdown.dataKey, e.target.value)}>
              <option value={``}>All</option>
              {
                dropdown.options
                  .concat(dropdown.value && !dropdown.options.includes(dropdown.value) ? dropdown.value : [])
                  .map((option, index) => <option key={index} value={option}>{option}</option>)
              }
            </select>
          </label>
        </div>)
    }

    <div className={className}>
      <label>Entries per page:
        <select
          defaultValue={rowsPerPage}
          onChange={e => rowsPerPageOnChange(Number.parseInt(e.target.value))}>
          {
            rowsPerPageOptions
              .filter(rowsPerPageOption => rowsCount >= rowsPerPageOption)
              .map((rowsPerPageOption, index) =>
                <option key={index} value={rowsPerPageOption}>{rowsPerPageOption}</option>)
          }
          <option value={0}>All</option>
        </select>
      </label>
    </div>

    <div className={className}>
      <label>Search all columns:
        <input
          type={`search`}
          value={searchAll}
          onChange={e => searchAllOnChange(e.target.value)}/>
      </label>
    </div>
  </React.Fragment>

TablePreamble.propTypes = {
  dropdowns: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    dataKey: PropTypes.string.isRequired,
    value: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.string).isRequired
  })).isRequired,
  dropdownOnChange: PropTypes.func.isRequired,
  rowsCount: PropTypes.number.isRequired,
  rowsPerPageOptions: PropTypes.arrayOf(PropTypes.number).isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  rowsPerPageOnChange: PropTypes.func.isRequired,
  searchAll: PropTypes.string.isRequired,
  searchAllOnChange: PropTypes.func.isRequired,
  className: PropTypes.string
}

TablePreamble.defaultProps = {
  className: `small-12 medium-4 large-2 columns`
}

export default TablePreamble
