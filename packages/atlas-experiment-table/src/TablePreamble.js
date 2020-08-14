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
            dropdowns.map((dropdown, index) =>  {
              let defaultValue = ``
              if (dropdown.value) {
                const valueIndex =
                    // Fuzzy-match the value in the select, in case an initial value in props was passed
                    dropdown.options.findIndex(
                      option => option.toLowerCase().match(dropdown.value.replace(/"/g, ``).replace(/\s+/g, ` `).trim().toLowerCase()))
                if (valueIndex >= 0) {
                  defaultValue = dropdown.options[valueIndex]
                }
              }

              return (
                  <div
                      key={index}
                      className={`small-12 medium-4 large-2 columns`}>
                    <label>{dropdown.label}:
                      <select
                          defaultValue={`"${defaultValue}"`}
                          onChange={e => dropdownOnChange(dropdown.dataKey, e.target.value, false)}>
                        <option value={``}>All</option>
                        {
                          dropdown.options.map((option, index) => <option key={index} value={`"${option}"`}>{option}</option>)
                        }
                      </select>
                    </label>
                  </div>
              )
            })
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
