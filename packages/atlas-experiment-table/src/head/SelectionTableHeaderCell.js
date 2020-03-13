import React from 'react'
import PropTypes from 'prop-types'

import Popup from 'react-popup'
import Prompt from './Prompt'

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

class SelectionTableHeaderCell extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      fileTypes: props.downloadFileTypes.map(fileType => fileType.id)
    }

    this.onClick = this.onClick.bind(this)
    this.onChange = this.onChange.bind(this)

    Popup.registerPlugin(
      `prompt`,
      (downloadFileTypes, onChange, callback) => {
        Popup.create({
          title: `Download`,
          content: <Prompt downloadFileTypes={downloadFileTypes} onSelect={(v) => onChange(v)}/>,
          buttons: {
            left: [`cancel`],
            right:
              [{
                text: `Download`,
                className: `success`,
                action: () => {
                  callback()
                  Popup.close()
                }
              }]
          }
        })
      }
    )
  }

  onClick(checkedRows) {
    Popup.plugins().prompt(
      this.props.downloadFileTypes,
      this.onChange,
      () => { this.props.onClick(checkedRows, this.state.fileTypes) }
    )
  }

  onChange(fileTypes) {
    this.setState(
      { fileTypes: fileTypes },
      () => {
        Popup.close()
        this.onClick(this.props.selectedRowIds)
      })
  }

  render(){
    const { label, selectedRowIds, tooltipContent, width } = this.props

    return <Table.HeaderCell
      flexGrow={width}
      justifyContent={`center`}>
      <Popup />

      <Heading size={500}>
        {
          selectedRowIds.length > 0 ?
            <a onClick={() => this.onClick(selectedRowIds)}>
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
  }
}

SelectionTableHeaderCell.propTypes = {
  label: PropTypes.string.isRequired,
  selectedRowIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  onClick: PropTypes.func.isRequired,
  tooltipContent: PropTypes.string,
  width: PropTypes.number.isRequired,
  downloadFileTypes: PropTypes.arrayOf(
    PropTypes.shape({
      description: PropTypes.string,
      id: PropTypes.string
    })
  ).isRequired,
}

SelectionTableHeaderCell.defaultProps = {
  tooltipContent: ``,
  width: 1
}

export default SelectionTableHeaderCell
