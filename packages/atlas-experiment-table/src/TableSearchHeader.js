import React from 'react'
import PropTypes from 'prop-types'

const TableSearchHeader = ({dropdownFilters, entriesPerPageOptions, totalNumberOfRows, searchAllOnChange, numberOfEntriesPerPageOnChange, dropdownFiltersOnChange}) =>
  <div className={`row expanded`}>
    {
      dropdownFilters.map(dropdownFilter =>
        <div key={dropdownFilter.label} className={`small-12 medium-4 large-2 columns`}>
          <label> {dropdownFilter.label}:
            <select defaultValue={``} onChange={e => dropdownFiltersOnChange(e, dropdownFilter.dataParam, dropdownFilter.label)}>
              <option value={``}>All</option>
              {
                dropdownFilter.options.map(option =>
                  <option key={option} value={option}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </option>)
              }
            </select>
          </label>
        </div>)
    }
    <div className={`small-12 medium-4 large-2 columns`}>
      <label>Entries per page:
        <select defaultValue={entriesPerPageOptions[0]} onChange={e => numberOfEntriesPerPageOnChange(e)}>
          {
            entriesPerPageOptions.map(entries => totalNumberOfRows >= entries ?
              <option key={entries} value={entries}>{entries}</option> :
              [])
          }
          <option value={totalNumberOfRows}>All</option>
        </select>
      </label>
    </div>

    <div className={`small-12 medium-4 large-2 columns`}>
      <label>Search all columns:
        <input type={`search`}
          onChange={e => searchAllOnChange(e)}/></label>
    </div>
  </div>

TableSearchHeader.propTypes = {
  entriesPerPageOptions: PropTypes.array.isRequired,
  totalNumberOfRows: PropTypes.number.isRequired,
  searchAllOnChange: PropTypes.func.isRequired,
  numberOfEntriesPerPageOnChange: PropTypes.func.isRequired,
  dropdownFilters: PropTypes.arrayOf(
    PropTypes.shape({
      dataParam: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      options: PropTypes.arrayOf(PropTypes.string).isRequired,
    })
  ).isRequired,
  dropdownFiltersOnChange: PropTypes.func.isRequired
}

export default TableSearchHeader
