import React from 'react'
import PropTypes from 'prop-types'
import paginate from 'jw-paginate'

const TableFooter = ({dataArrayLength, currentPageDataLength, currentPage, entriesPerPage, onChange, dataLength}) => {

  const pageNumbersLength = Math.ceil(dataArrayLength / entriesPerPage)
  const paginationOutput = paginate(dataArrayLength, currentPage, entriesPerPage, 3).pages

  const restylePagination = (pages, totalPages) => {
    let restyledPages = [...pages]
    if (restyledPages[0] !== 1 && totalPages > 6) {
      restyledPages.unshift(1)
      restyledPages[1] !== 2 && restyledPages.splice(1, 0, `...`)
    }

    if (restyledPages[restyledPages.length - 1] !== totalPages && totalPages > 6)  {
      restyledPages.push(totalPages)
      restyledPages[restyledPages.length - 2] !== (totalPages - 1) && restyledPages.splice(restyledPages.length - 1 , 0 , `...`)
    }

    if (currentPage <= 4 && totalPages > 6){
      restyledPages = [1, 2, 3, 4, 5, `...`, totalPages]
    }

    if(currentPage >= (totalPages - 4) && totalPages > 6){
      restyledPages = [1, `...`, totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
    }

    if(totalPages === 6) {
      restyledPages = [1, 2, 3, 4, 5, 6]
    }

    return restyledPages
  }

  const pageNumbers = restylePagination(paginationOutput, pageNumbersLength).map((pageIndicator,i) => {
    return pageIndicator === `...` ?
      <li key={`bottom${i}`} className={`disabled`}>{pageIndicator}</li> :
      pageIndicator === currentPage ?
        <li className={`current`} key={`bottom${i}`}>{currentPage}</li> :
        <li key={`bottom${i}`}><a onClick={() => onChange(pageIndicator)}>{pageIndicator}</a></li>
  })

  const pageInfo = pageNumbers.length === 1 ? `` : ` (Page ${currentPage} of ${pageNumbersLength})`

  return (
    <div className={`row expanded padding-top-medium`}>
      <div className={`small-6 columns`}>
        {
          dataLength === 0 ?
            `Nothing to see here. Move along!` :
            dataArrayLength === 0 ?
              `Your query didn’t match any experiments.` :
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
