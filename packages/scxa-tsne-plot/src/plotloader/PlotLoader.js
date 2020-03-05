import React from 'react'
import PropTypes from 'prop-types'

import LoadingOverlay from './LoadingOverlay'
import ScatterPlot from './ScatterPlot'

import SeriesPropTypes from './SeriesPropTypes'

const PlotLoader = ({loading, series, errorMessage, highchartsConfig, resourcesUrl, wrapperClassName, chartClassName, afterRender}) =>
  errorMessage ?
    <div className={`${wrapperClassName} text-center scxa-error`}>
      <p>{errorMessage}</p>
    </div> :

    <div style={{position: `relative`}} className={wrapperClassName}>
      <ScatterPlot
        chartClassName={chartClassName}
        series={series}
        highchartsConfig={highchartsConfig}
        afterRender={afterRender}
      />
      <LoadingOverlay
        show={loading}
        resourcesUrl={resourcesUrl}
      />
    </div>

PlotLoader.propTypes = {
  loading: PropTypes.bool.isRequired,
  series: SeriesPropTypes,
  errorMessage: PropTypes.string,
  highchartsConfig: PropTypes.object,
  chartClassName: PropTypes.string,
  resourcesUrl: PropTypes.string,
  wrapperClassName: PropTypes.string,
  afterRender: PropTypes.func
}

PlotLoader.defaultProps = {
  wrapperClassName: ``,
  chartClassName: ``,
  highchartsConfig: {},
  resourcesUrl: ``,
  afterRender: () => {}
}

export default PlotLoader
