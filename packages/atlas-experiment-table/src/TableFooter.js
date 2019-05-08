import React from 'react'
import PropTypes from 'prop-types'

const TableFooter = ({dataArrayLength, currentPageDataLength, currentPage, entriesPerPage, onChange, dataLength}) => {
  const pageNumbers = []
  for (let i = 1; i <= Math.ceil(dataArrayLength / entriesPerPage); i++) {
    pageNumbers.push( i === currentPage ? <li className={`current`} key={`bottom${i}`}>{currentPage}</li> :
      <li key={`bottom${i}`}><a onClick={() => onChange(i)}>{i}</a></li>)
  }

  const pageInfo = pageNumbers.length === 1 ? `` : ` (Page ${currentPage} of ${pageNumbers.length})`

  return (
    <div className="row expanded padding-top-medium">
      <div className={`small-6 columns`}>
        {
          dataLength === 0 ?
            `Nothing to see here. Move along!` :
            dataArrayLength === 0 ?
              ` No experiments are shown because a query doesn’t match.` :
              `Showing ${currentPageDataLength} result${currentPageDataLength ===1 ? ``: `s`}
              ${dataArrayLength < dataLength ? ` out of ${dataArrayLength}` : ``} from a total of ${dataLength} experiments${pageInfo}.`
        }
      </div>

      <div className={`small-6 columns`}>
        <ul className={`pagination`} style={{textAlign: `right`}}>
          {[
            currentPage > 1 ?
              <li key={`previous`}>
                <a onClick={() => {currentPage > 1 && onChange(currentPage - 1)}}>
                  Previous
                </a>
              </li> :
              <li key={`previous`} className={`disabled`}>Previous</li>,
            pageNumbers,
            dataArrayLength > currentPage * entriesPerPage ?
              <li key={`next`}>
                <a onClick={() => {dataArrayLength >= currentPage * entriesPerPage && onChange(currentPage + 1)}}>
                  Next
                </a>
              </li> :
              <li key={`next`} className={`disabled`}>Next</li>
          ]}
        </ul>
      </div>
    </div>
  )
}

TableFooter.propTypes = {
  dataArrayLength: PropTypes.number.isRequired,
  currentPageDataLength: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  entriesPerPage: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  dataLength: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired
}

export default TableFooter