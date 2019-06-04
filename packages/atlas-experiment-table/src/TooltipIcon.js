import React from 'react'
import PropTypes from 'prop-types'

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

export default TooltipIcon
