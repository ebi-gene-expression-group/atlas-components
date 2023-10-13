import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import ReactTooltip from 'react-tooltip'

const splitText = str => {
  const maxLineLength = 40

  return str.split(` `).reduce(
    (acc, word) => {
      if (acc[acc.length - 1].length < maxLineLength) {
        acc[acc.length - 1] = `${acc[acc.length - 1]} ${word}`
      } else {
        acc.push(word)
      }
      return acc
    },
    [``]
  ).join(`<br>`).trim()
}

const TooltipIcon = ({ tooltipText }) =>
  <Fragment>
    <sup>
      <span
        data-tip={`<span>${splitText(tooltipText)}</span>`}
        data-html={true}
        className={`icon icon-generic`} data-icon={`i`}
        style={{ color: `lightgrey`, fontSize: `smaller` }}/>
    </sup>
    <ReactTooltip effect={`solid`}/>
  </Fragment>

TooltipIcon.propTypes = {
  tooltipText: PropTypes.string.isRequired
}

export default TooltipIcon
