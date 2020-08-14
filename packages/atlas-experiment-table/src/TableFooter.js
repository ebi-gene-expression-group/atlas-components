import React from 'react'
import PropTypes from 'prop-types'
import paginate from 'jw-paginate'

const TableFooter =
({
  dataRowsLength,
  filteredDataRowsLength,
  rowsPerPage,
  currentPage,
  onChange,
  className
}) => {
  // Poor man’s error boundary
  if (filteredDataRowsLength > dataRowsLength ) {
    return (null)
  }

  const pagination = paginate(filteredDataRowsLength, currentPage, rowsPerPage, 7)

  let restyledPages = pagination.pages

  // A couple of edge cases where jw-paginate gets all wonky
  if (filteredDataRowsLength === 0) {
    restyledPages = []
  } else if (rowsPerPage === 0) {
    restyledPages = [1]
    pagination.totalPages = 1
  }

  // Replace first and last pages with 1 and n if they’re not visible in the default 7 items
  if (restyledPages[0] > 1) {
    restyledPages[0] = 1
    restyledPages[1] = `…`
  }
  if (restyledPages[restyledPages.length - 1] < pagination.totalPages) {
    restyledPages[restyledPages.length - 1] = pagination.totalPages
    restyledPages[restyledPages.length - 2] = `…`
  }

  const currentPageDataRowsLength =
    (pagination.pageSize === 0 && pagination.totalPages === 1) ?
      `all` :
      pagination.endIndex - pagination.startIndex + 1

  return (
    <React.Fragment>
      <div className={className}>
        {
          dataRowsLength === 0 ?
            `Nothing to see here. Move along!` :
            filteredDataRowsLength === 0 ?
              `Your query didn’t match any experiments.` :
              `Showing ${currentPageDataRowsLength} result${currentPageDataRowsLength === `all` || currentPageDataRowsLength > 1 ? `s`: ``} ` +
              `${filteredDataRowsLength < dataRowsLength ? ` out of ${filteredDataRowsLength} ` : ``}` +
              `from a total of ${dataRowsLength} experiments` +
              `${pagination.totalPages > 1 ? ` (page ${currentPage} of ${pagination.totalPages})` : ``}.`
        }
      </div>

      <div className={className}>
        <ul className={`pagination`} style={{ textAlign: `right`}}>
          <li>
            {
              filteredDataRowsLength === 0 || currentPage === 1 ?
                <span className={`disabled`}>Previous</span> :
                <a onClick={() => onChange(currentPage - 1)}>Previous</a>
            }
          </li>
          {
            restyledPages.map((pageIndicator, i) =>
              pageIndicator === `…` ?
                <li
                  key={i}
                  className={`disabled`}>
                  {pageIndicator}
                </li> :
                pageIndicator === currentPage ?
                  <li
                    key={i}
                    className={`current`}>
                    {currentPage}
                  </li> :
                  <li key={i}>
                    <a onClick={() => onChange(pageIndicator)}>{pageIndicator}</a>
                  </li>
            )
          }
          <li>
            {
              filteredDataRowsLength === 0 || currentPage === pagination.totalPages ?
                <span className={`disabled`}>Next</span> :
                <a onClick={() => onChange(currentPage + 1)}>Next</a>
            }
          </li>
        </ul>
      </div>
    </React.Fragment>
  )
}

TableFooter.propTypes = {
  dataRowsLength: PropTypes.number.isRequired,
  filteredDataRowsLength: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string
}

TableFooter.defaultProps = {
  className: `small-6 columns padding-top-medium`
}

export default TableFooter
