import React from 'react'
import PropTypes from 'prop-types'
import URI from 'urijs'

import { Table, Text } from 'evergreen-ui'

const ANNDATA_EXPERIMENT = `E-ANND`
const TableCell = ({ dataRow, dataKey, image, icon, linkTo, host, width }) => {
  let cellItem = null
  if (icon) {
      // If the column includes an icon in the cell for anndata experiment
      cellItem = dataRow[`experimentAccession`].startsWith(ANNDATA_EXPERIMENT) ?
          <div className={'icon'}>
              <img {...icon[ANNDATA_EXPERIMENT]}/>
              {dataRow[dataKey]}
          </div> :
          dataRow[dataKey]
  } else if (image) {
      // If the column is an image put the image in the cell (or an unknown icon if the type is undefined)
      cellItem = image[dataRow[dataKey]] ? <img {...image[dataRow[dataKey]]}/> : `❔`
  } else if (Array.isArray(dataRow[dataKey])) {
      // If the contents of the cell is an array expand it to a list
    cellItem =
        <ul>
          {dataRow[dataKey].map(
              (element, index) =>
                  <li key={`${index}`}>
                    {element}
                  </li>
          )}
        </ul>
  } else {
    // Any other type (i.e. string, number) put it as-is in the cell
    cellItem = dataRow[dataKey]
  }

  // Evergreen’s Table.TextCell ellipsifies content by default and we don’t want that
  return (
      <Table.Cell flexGrow={width}>
        <Text size={400}>
          {
            linkTo ?
                <a href={URI(linkTo(dataRow), host).toString()}>{cellItem}</a> :
                cellItem
          }
        </Text>
      </Table.Cell>
  )
}

TableCell.propTypes = {
  dataRow: PropTypes.object.isRequired,
  dataKey: PropTypes.string.isRequired,
  image: PropTypes.objectOf(
      PropTypes.shape({
        src: PropTypes.string,
        alt: PropTypes.string,
        title: PropTypes.string
      })
  ),
  host: PropTypes.string,
  linkTo: PropTypes.func,
  width: PropTypes.number,
}

TableCell.defaultProps = {
  image: null,
  linkTo: null,
  host: ``,
  width: 1,
}

export default TableCell
