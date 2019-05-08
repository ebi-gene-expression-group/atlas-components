import React from 'react'
import PropTypes from 'prop-types'

const TableSearchHeader = ({kingdomOptions, entriesPerPageOptions, totalNumberOfRows, searchAllOnChange, numberOfEntriesPerPageOnChange, kingdomOnChange}) =>
  <div className={`row expanded`}>
    <div className={`small-12 medium-4 large-2 columns`}>
      <label> Kingdom:
        <select defaultValue={``} onChange={e => kingdomOnChange(e)}>
          <option value={``} >All</option>
          {
            kingdomOptions.map(kingdom =>
              <option key={kingdom} value={kingdom}>
                {kingdom.charAt(0).toUpperCase() + kingdom.slice(1)}
              </option>) 
          }
        </select>
      </label>
    </div>

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
  kingdomOptions: PropTypes.arrayOf(PropTypes.string).isRequired,
  entriesPerPageOptions: PropTypes.array.isRequired,
  totalNumberOfRows: PropTypes.number.isRequired,
  searchAllOnChange: PropTypes.func.isRequired,
  numberOfEntriesPerPageOnChange: PropTypes.func.isRequired,
  kingdomOnChange: PropTypes.func.isRequired
}

export default TableSearchHeader