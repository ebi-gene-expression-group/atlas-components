import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'evergreen-ui'
import URI from 'urijs'
import ReactTooltip from 'react-tooltip'

import tableHeaderCells from './tableHeaderCells'
import TooltipIcon from './TooltipIcon'

const TableContent = ({tableHeader, searchedColumnIndex, searchQuery, orderedColumnIndex,
  ascendingOrder, enableDownload, checkedRows, currentPageData, host,
  tableHeaderOnClick, tableHeaderOnChange, downloadOnChange, downloadTooltip}) =>
  <div className={`row expanded`}>
    <div className={`small-12 columns`} >
      <Table border>
        <Table.Head>

          {
            tableHeaderCells(tableHeader, searchedColumnIndex, searchQuery, orderedColumnIndex, ascendingOrder,
              columnNumber => tableHeaderOnClick(columnNumber),
              (value, columnNumber) => tableHeaderOnChange(value, columnNumber)
            )
          }

          {
            enableDownload && <Table.TextHeaderCell className={`downloadHeader`} flexBasis={100} flexShrink={100} flexGrow={100}>
              {
                <div>
                  {
                    checkedRows.length > 0 ?
                      <a href={URI(`experiments/download/zip`, host).search({accession: checkedRows}).toString()}>
                      Download {checkedRows.length} {checkedRows.length === 1 ? `entry` : `entries`}
                      </a> :
                      `Download`
                  }
                  <TooltipIcon tooltipText={downloadTooltip}/>
                </div>
              }
            </Table.TextHeaderCell>
          }
        </Table.Head>
        <ReactTooltip effect={`solid`}/>
        <Table.Body style={{"overflowY":`hidden`}}>
          {currentPageData.map((data, index) => {
            return (
              <Table.Row height={`auto`} backgroundColor={index % 2 === 0 ? `white`:`#F1F1F1`} paddingY={14} key={`row${index}`}>

                {[
                  tableHeader.map((header, index) => {
                    const cellItem = header.image ?
                      <img src={header.image[data[header.dataParam]].src} alt={header.image[data[header.dataParam]].alt}/> :
                      Array.isArray(data[header.dataParam]) ?
                        <ul key={`cell${index}`}>{data[header.dataParam].map(element => <li key={`${element}`}>{element}</li>)}</ul> :
                        data[header.dataParam]

                    return <Table.Cell key={`${cellItem}${index}`} flexBasis={header.width} flexShrink={100} flexGrow={100}>
                      {
                        header.link ?
                          <div><a href={URI(`${header.resource}/${data[header.link]}/${header.endpoint}`, host)}>{cellItem}</a></div>:
                          cellItem
                      }
                    </Table.Cell>
                  }),

                  enableDownload && <Table.Cell key={`checkbox`} flexBasis={100} flexShrink={100} flexGrow={100}>
                    <input type={`checkbox`} className={`checkbox`} checked={checkedRows.includes(data.experimentAccession)}
                      onChange={() => downloadOnChange(data.experimentAccession)} />
                  </Table.Cell>
                ]}

              </Table.Row>)
          })
          }
        </Table.Body>
      </Table>
    </div>
  </div>

TableContent.propTypes = {
  tableHeader: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.oneOf([`sort`, `search`, ``]).isRequired,
      title: PropTypes.string.isRequired,
      width: PropTypes.number.isRequired,
      dataParam: PropTypes.string.isRequired,
      image: PropTypes.objectOf(
        PropTypes.shape({
          src: PropTypes.string,
          alt: PropTypes.string
        })
      )
    })
  ),
  searchedColumnIndex: PropTypes.number.isRequired,
  searchQuery: PropTypes.string.isRequired,
  orderedColumnIndex: PropTypes.number.isRequired,
  ascendingOrder: PropTypes.bool.isRequired,
  enableDownload: PropTypes.bool.isRequired,
  checkedRows: PropTypes.arrayOf(PropTypes.string).isRequired,
  currentPageData: PropTypes.arrayOf(PropTypes.object).isRequired,
  host: PropTypes.string.isRequired,
  entriesPerPage: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  currentPage: PropTypes.number.isRequired,
  tableHeaderOnClick: PropTypes.func.isRequired,
  tableHeaderOnChange: PropTypes.func.isRequired,
  downloadOnChange: PropTypes.func.isRequired,
  downloadTooltip: PropTypes.string
}

export default TableContent