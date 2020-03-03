import React from 'react'
import PropTypes from 'prop-types'

// We’re not using Link because Evergreen restyles the links and we want EBI VF for that
// We also don’t like Evergreen’s Tooltip because  it doesn’t render HTML :(
import { Table, Heading, Pane, majorScale } from 'evergreen-ui'
import ReactTooltip from 'react-tooltip'

const TooltipIcon = ({tooltipText}) =>
  <sup>
    <span
      data-tip={`${tooltipText}`}
      data-html={true}
      className={`icon icon-generic`} data-icon={`i`}
      style={{color: `lightgrey`, fontSize: `small`}}/>
  </sup>

TooltipIcon.propTypes = {
  tooltipText: PropTypes.string.isRequired
}

const SelectionTableHeaderCell = ({ label, selectedRowIds, onClick, tooltipContent, width }) =>
  <Table.HeaderCell
    flexGrow={width}
    justifyContent={`center`}>
    <Heading size={500}>
      {
        selectedRowIds.length > 0 ?
          <a onClick={() => onClick(selectedRowIds)}>
            {`${label} ${selectedRowIds.length} ${selectedRowIds.length === 1 ? `entry` : `entries`}`}
          </a> :
          label
      }
    </Heading>
    { tooltipContent &&
      <Pane paddingLeft={majorScale(1)}>
        <TooltipIcon tooltipText={tooltipContent}/>
        <ReactTooltip place={`left`}/>
      </Pane>
    }
  </Table.HeaderCell>

SelectionTableHeaderCell.propTypes = {
  label: PropTypes.string.isRequired,
  selectedRowIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  onClick: PropTypes.func.isRequired,
  tooltipContent: PropTypes.string,
  width: PropTypes.number.isRequired
}

SelectionTableHeaderCell.defaultProps = {
  tooltipContent: ``,
  width: 1
}

export default SelectionTableHeaderCell
