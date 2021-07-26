import React from 'react'
import PropTypes from 'prop-types'

import URI from 'urijs'

import ClusterTSnePlot from './ClusterTSnePlot'
import GeneExpressionTSnePlot from './GeneExpressionTSnePlot'
import PlotSettingsDropdown from './PlotSettingsDropdown'
import { find as _find } from 'lodash'

class TSnePlotView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      geneExpressionData: {
        max: null,
        min: null,
        series: [],
        unit: ``
      },
      cellClustersData: {
        series: []
      },
      geneExpressionErrorMessage: null,
      cellClustersErrorMessage: null,
      loadingCellClusters: false,
      loadingGeneExpression: false
    }
  }

  async _fetchAndSetState(resource, baseUrl, dataField, errorMessageField, loadingField) {
    this.setState({
      [loadingField]: true
    })

    const url = URI(resource, baseUrl).toString()

    try {
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`${url} => ${response.status}`)
      }

      this.setState({
        [dataField]: await response.json(),
        [errorMessageField]: null,
        [loadingField]: false,
      })
    } catch (e) {
      this.setState({
        [errorMessageField]: `${e.name}: ${e.message}`,
        [loadingField]: false
      })
    }
  }

  _fetchAndSetStateCellClusters(
    {atlasUrl, experimentAccession, selectedColourBy, selectedColourByCategory, selectedPlotOption, selectedPlotType}) {
    const resource = `json/experiments/${experimentAccession}/tsneplot/${selectedPlotOption}/clusters/variable/${selectedColourBy}?method=${selectedPlotType}&variableType=${selectedColourByCategory}`

    this._fetchAndSetState(
      resource, atlasUrl, `cellClustersData`, `cellClustersErrorMessage`, `loadingCellClusters`)
  }

  _fetchAndSetStateGeneId({atlasUrl, experimentAccession, selectedPlotOption, geneId, selectedPlotType}) {
    const resource = `json/experiments/${experimentAccession}/tsneplot/${selectedPlotOption}/expression/${geneId}?method=${selectedPlotType}`

    this._fetchAndSetState(
      resource, atlasUrl, `geneExpressionData`, `geneExpressionErrorMessage`, `loadingGeneExpression`)
  }

  componentDidUpdate(previousProps) {
    if (previousProps.selectedPlotOption !== this.props.selectedPlotOption ||
        previousProps.experimentAccession !== this.props.experimentAccession ||
        previousProps.selectedPlotType !== this.props.selectedPlotType
    ) {
      this._fetchAndSetStateCellClusters(this.props)
      this._fetchAndSetStateGeneId(this.props)
    } else if (previousProps.selectedColourBy !== this.props.selectedColourBy) {
      this._fetchAndSetStateCellClusters(this.props)
    } else if (previousProps.geneId !== this.props.geneId) {
      this._fetchAndSetStateGeneId(this.props)
    }
  }

  componentDidMount() {
    this._fetchAndSetStateCellClusters(this.props)
    this._fetchAndSetStateGeneId(this.props)
  }

  render() {
    const {height, atlasUrl, resourcesUrl, suggesterEndpoint, showControls, selectedColourByCategory, initialCellTypeValues} = this.props
    const {wrapperClassName, clusterPlotClassName, expressionPlotClassName} = this.props
    const {geneId, speciesName, geneIds} = this.props
    const highlightClusters = []
    const {ks, selectedPlotOption, selectedPlotType, metadata, selectedColourBy, plotTypeDropdown, selectedPlotOptionLabel} = this.props
    const {onSelectGeneId, onChangeColourBy, onChangePlotOptions, onChangePlotTypes} = this.props
    const {loadingGeneExpression, geneExpressionData, geneExpressionErrorMessage} = this.state
    const {loadingCellClusters, cellClustersData, cellClustersErrorMessage} = this.state

    const plot = _find(plotTypeDropdown, (plot) => plot.plotType.toLowerCase() === selectedPlotType)

    const plotOptionsValues = plot.plotOptions.map((option) =>
      ({value: Object.values(option)[0], label: Object.keys(option)[0]+`: `+Object.values(option)[0]}))

    const plotTypesOptions = plotTypeDropdown.map((plot) => ({
      value: plot.plotType.toLowerCase(),
      label: plot.plotType
    }))

    const getTooltipContent = async (cellId) => {
      const url = URI(`json/experiment/${this.props.experimentAccession}/cell/${cellId}/metadata`, atlasUrl).toString()
      try {
        const response = await fetch(url)

        if (!response.ok) {
          throw new Error(`${url} => ${response.status}`)
        }

        return await response.json()
      } catch (e) {
        throw new Error(`${e.name}: ${e.message}`)
      }
    }

    return (
      <div className={wrapperClassName} >
        <div className={`row expanded`} style={{width: `50%`}}>
          <div className={`small-12 medium-6 columns`}>
            <PlotSettingsDropdown
              labelText={`Plot type:`}
              options={plotTypesOptions}
              defaultValue={{value: selectedPlotType, label: plot.plotType}}
              onSelect={(selectedPlotType) => {
                onChangePlotTypes(selectedPlotType.value)
              }}/>
          </div>
          <div className={`small-12 medium-6 columns`}>
            <PlotSettingsDropdown
              labelText={`Plot options:`}
              options={plotOptionsValues}
              defaultValue={{value: selectedPlotOption,
                label: selectedPlotOptionLabel}}
              onSelect={(selectedOption) => {
                onChangePlotOptions(selectedOption)
              }}/>
          </div>
        </div>

        <div className={clusterPlotClassName}>
          <ClusterTSnePlot
            height={height}
            plotData={cellClustersData}
            selectedPlotOption={selectedPlotOption}
            selectedPlotType={selectedPlotType}
            onChangePlotOptions={onChangePlotOptions}
            onChangePlotTypes={onChangePlotTypes}
            plotTypeDropdown={plotTypeDropdown}
            ks={ks}
            metadata={metadata}
            clusterType={selectedColourByCategory}
            onChangeColourBy={onChangeColourBy}
            selectedColourBy={selectedColourBy}
            highlightClusters={highlightClusters}
            loading={loadingCellClusters}
            resourcesUrl={resourcesUrl}
            errorMessage={cellClustersErrorMessage}
            tooltipContent={getTooltipContent}
            initialCellTypeValues={initialCellTypeValues}
            showControls={showControls}
          />
        </div>

        <div className={expressionPlotClassName}>
          <GeneExpressionTSnePlot
            height={height}
            plotData={geneExpressionData}
            atlasUrl={atlasUrl}
            suggesterEndpoint={suggesterEndpoint}
            onSelectGeneId={onSelectGeneId}
            geneId={geneId}
            geneIds={geneIds}
            speciesName={speciesName}
            highlightClusters={[]}
            loading={loadingGeneExpression}
            resourcesUrl={resourcesUrl}
            errorMessage={geneExpressionErrorMessage}
            showControls={showControls}
          />
        </div>
      </div>
    )
  }

  componentDidCatch(error) {
    this.setState({
      errorMessage: `${error}`
    })
  }
}

TSnePlotView.propTypes = {
  atlasUrl: PropTypes.string.isRequired,
  wrapperClassName: PropTypes.string,
  clusterPlotClassName: PropTypes.string,
  expressionPlotClassName: PropTypes.string,
  selectedPlotOption: PropTypes.number.isRequired,
  suggesterEndpoint: PropTypes.string.isRequired,
  experimentAccession: PropTypes.string.isRequired,
  ks: PropTypes.arrayOf(PropTypes.number).isRequired,
  showControls: PropTypes.bool,

  metadata: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string,
    label: PropTypes.string
  })),
  selectedColourBy: PropTypes.string,
  onChangeColourBy: PropTypes.func,

  highlightClusters: PropTypes.arrayOf(PropTypes.number),
  geneId: PropTypes.string.isRequired,
  geneIds: PropTypes.arrayOf(PropTypes.string),
  speciesName: PropTypes.string.isRequired,
  height: PropTypes.number,
  resourcesUrl: PropTypes.string,
  initialCellTypeValues: PropTypes.array,
  onSelectGeneId: PropTypes.func,
  onChangePlotOptions: PropTypes.func,
  onChangePlotTypes: PropTypes.func,
  selectedPlotType: PropTypes.string.isRequired,
  selectedColourByCategory: PropTypes.string,
  selectedPlotOptionLabel: PropTypes.string,
  plotTypeDropdown: PropTypes.arrayOf(
    PropTypes.shape({
      plotType: PropTypes.string,
      plotOptions: PropTypes.arrayOf(PropTypes.number)
    })
  )
}

TSnePlotView.defaultProps = {
  showControls: true,
  highlightClusters: [],
  wrapperClassName: `row`,
  clusterPlotClassName: `small-12 medium-6 columns`,
  expressionPlotClassName: `small-12 medium-6 columns`,
  geneId: ``,
  speciesName: ``,
  height: 800,
  initialCellTypeValues: [`inferred_cell_type_-_authors_labels`, `inferred_cell_type_-_ontology_labels`],
  onSelectGeneId: () => {},
  onChangeColourBy: () => {},
  onPerplexityChange: () => {}
}

export default TSnePlotView
