import React from 'react'
import PropTypes from 'prop-types'
import URI from 'urijs'
import { BrowserRouter, Route, NavLink, Switch, Redirect, withRouter } from 'react-router-dom'

import AnatomogramCellTypeHeatmapView from './results/AnatomogramCellTypeHeatmapView'

import TSnePlotView from '@ebi-gene-expression-group/scxa-tsne-plot'
import { ClustersHeatmapView } from '@ebi-gene-expression-group/scxa-marker-gene-heatmap'

import BioentityInformation from '@ebi-gene-expression-group/atlas-bioentity-information'
import { withFetchLoader } from '@ebi-gene-expression-group/atlas-react-fetch-loader'

import { intersection as _intersection, first as _first, map as _map } from 'lodash'
import {
  plotTypeDropdown,
  updateUrlWithParams,
  getSelectedPlotOptionLabel,
  preferredK,
  organWithMostOntologies,
  formatMetadata,
  getHighlightClusters,
  getMarkerGenesResource,
  getSelectedColourBy,
  handleClusterSelection, handlePlotTypeChange, handlePlotOptionChange, handleColourByChange
} from './subTabRoutesHelper'

const BioentityInformationWithFetchLoader = withFetchLoader(BioentityInformation)

const RedirectWithSearchAndHash = (props) =>
  <Redirect to={{ pathname: props.pathname, search: props.location.search, hash: props.location.hash }} />

const RedirectWithLocation = withRouter(RedirectWithSearchAndHash)

const CLUSTERS_PLOT = `clusters`
const METADATA_PLOT = `metadata`
const CELL_TYPE_MARKER_GENE_HEATMAP = `celltypes`
const CLUSTER_MARKER_GENE_HEATMAP = `clusters`

class ExperimentPageSubTabRoute extends React.Component {
  constructor (props) {
    super(props)
    const getFirstExistingCellTypeValue = _first(_intersection(_map(this.props.metadata, `label`), this.props.initialCellTypeValues))
    const cellTypeValue = getFirstExistingCellTypeValue
    const defaultPlotType = Object.keys(this.props.defaultPlotMethodAndParameterisation)[0]
    const defaultPlotOption = Object.values(Object.values(this.props.defaultPlotMethodAndParameterisation)[0])[0]
    const defaultPlotOptionLabel = Object.keys(Object.values(this.props.defaultPlotMethodAndParameterisation)[0])[0]
    const defaultSelectedKOrCellType = cellTypeValue
      ? cellTypeValue.toLowerCase()
      : this.props.ks.length > 0 ? this.props.ks[Math.round((this.props.ks.length - 1) / 2)].toString() : ``

    this.state = {
      selectedPlotType: defaultPlotType,
      geneId: ``,
      selectedPlotOption: defaultPlotOption,
      selectedPlotOptionLabel: defaultPlotOptionLabel + `: ` + defaultPlotOption,
      selectedColourBy: defaultSelectedKOrCellType,
      highlightClusters: [],
      experimentAccession: this.props.experimentAccession,
      selectedColourByCategory: isNaN(defaultSelectedKOrCellType) ? METADATA_PLOT : CLUSTERS_PLOT,
      selectedClusterId: defaultSelectedKOrCellType,
      selectedClusterIdOption: ``
    }
  }

  render () {
    const { location, match, history } = this.props
    const { atlasUrl, suggesterEndpoint, defaultPlotMethodAndParameterisation } = this.props
    const { species, experimentAccession, accessKey, ks, ksWithMarkerGenes, plotTypesAndOptions, metadata, anatomogram } = this.props
    const search = URI(location.search).search(true)

    const routes = [
      {
        path: `/cell-plots`,
        title: `Cell plots`,
        main: () => <TSnePlotView
          atlasUrl={atlasUrl}
          suggesterEndpoint={suggesterEndpoint}
          wrapperClassName={`row expanded`}
          clusterPlotClassName={`small-12 large-6 columns`}
          expressionPlotClassName={`small-12 large-6 columns`}
          speciesName={species}
          experimentAccession={experimentAccession}
          accessKey={accessKey}
          selectedPlotOption={search.plotOption || this.state.selectedPlotOption}
          selectedPlotType={search.plotType || this.state.selectedPlotType}
          ks={ks}
          metadata={formatMetadata(metadata)}
          selectedColourBy={getSelectedColourBy(search, this.state)}
          selectedColourByCategory={this.state.selectedColourByCategory} // Is the plot coloured by clusters or metadata
          highlightClusters={getHighlightClusters(search)}
          geneId={search.geneId || ``}
          height={800}
          onSelectGeneId={geneId => updateUrlWithParams([{ geneId }], history)}
          plotTypeDropdown={plotTypeDropdown(defaultPlotMethodAndParameterisation, plotTypesAndOptions)}
          selectedPlotOptionLabel={getSelectedPlotOptionLabel(search, this.state, plotTypeDropdown(defaultPlotMethodAndParameterisation, plotTypesAndOptions, history))}
          onChangePlotTypes={plotOption => handlePlotTypeChange(defaultPlotMethodAndParameterisation, plotOption, this, history)}
          onChangePlotOptions={plotOption => handlePlotOptionChange(plotOption, this, history)}
          onChangeColourBy={ (colourByCategory, colourByValue) => handleColourByChange(colourByCategory, colourByValue, this, history)}
        />
      },
      {
        path: `/marker-genes`,
        title: `Marker Genes`,
        main: () => <ClustersHeatmapView
          host={atlasUrl}
          resource={getMarkerGenesResource(this.state, experimentAccession)}
          wrapperClassName={`row expanded`}
          ks={ks}
          selectedClusterByCategory={search.cellGroupType || search.k || preferredK(this.props)}
          selectedK={this.state.selectedColourByCategory === METADATA_PLOT ? this.state.selectedColourBy : this.state.selectedClusterId}
          onSelectK={value => handleClusterSelection(value, this, history)}
          onChangeMarkerGeneFor={option => this.setState({ selectedClusterIdOption: option })}
          ksWithMarkers={ksWithMarkerGenes}
          metadata={formatMetadata(metadata)}
          species={species}
          heatmapType={this.state.selectedColourByCategory === METADATA_PLOT ? CELL_TYPE_MARKER_GENE_HEATMAP : CLUSTER_MARKER_GENE_HEATMAP}
        />
      },
      {
        path: `/anatomogram`,
        title: `Anatomogram`,
        main: () =>
          <AnatomogramCellTypeHeatmapView
            showIds={anatomogram[organWithMostOntologies(anatomogram)]}
            experimentAccession={experimentAccession}
            species={species}
            organ={organWithMostOntologies(anatomogram)}
            host={atlasUrl}
          />
      },
      {
        path: `/gene-info`,
        title: `Gene information`,
        main: () =>
          <BioentityInformationWithFetchLoader
            host={atlasUrl}
            resource={`json/bioentity-information/${search.geneId}`}/>
      }
    ]

    const basename = URI(`experiments/${experimentAccession}${match.path}`, URI(atlasUrl).path()).toString()
    const sideTabStyle = { overflow: `clip`, textOverflow: `ellipsis` }

    return (
      <BrowserRouter basename={basename}>
        <div className="row expanded">
          {/* Sidebar */}
          <div className="small-3 medium-2 large-1 columns" style={{ padding: 0, background: `#ffffff` }}>
            <ul className="side-tabs">
              {routes.map((route, index) => (
                (index < 2 || (species === `homo sapiens` && Object.keys(anatomogram).length > 0 && index === 2) ||
                        (search.geneId && index === 3)) && (
                  <li key={index} title={route.title} className="side-tabs-title">
                    <NavLink
                      to={{ pathname: route.path, search: location.search, hash: location.hash }}
                      activeClassName="active"
                      style={sideTabStyle}
                    >
                      {route.title}
                    </NavLink>
                  </li>
                )
              ))}
            </ul>
          </div>

          {/* Main Content */}
          <div className="small-9 medium-10 large-11 columns" style={{ padding: `10px` }}>
            <Switch>
              {routes.map((route, index) => (
                <Route key={index} path={route.path} component={route.main} />
              ))}
              <RedirectWithLocation pathname={routes[0].path} />
            </Switch>
          </div>
        </div>
      </BrowserRouter>
    )
  }
}

RedirectWithSearchAndHash.propTypes = {
  pathname: PropTypes.string.isRequired,
  location: PropTypes.shape({
    search: PropTypes.string.isRequired,
    hash: PropTypes.string.isRequired
  }).isRequired
}

ExperimentPageSubTabRoute.propTypes = {
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  atlasUrl: PropTypes.string.isRequired,
  resourcesUrl: PropTypes.string,
  experimentAccession: PropTypes.string.isRequired,
  accessKey: PropTypes.string,
  ks: PropTypes.arrayOf(PropTypes.number).isRequired,
  ksWithMarkerGenes: PropTypes.arrayOf(PropTypes.number).isRequired,
  suggesterEndpoint: PropTypes.string.isRequired,
  species: PropTypes.string.isRequired,
  metadata: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired
  }).isRequired).isRequired,
  selectedK: PropTypes.number,
  anatomogram: PropTypes.object.isRequired,
  initialCellTypeValues: PropTypes.arrayOf(PropTypes.string),
  defaultPlotMethodAndParameterisation: PropTypes.object.isRequired,
  plotTypesAndOptions: PropTypes.object.isRequired
}

ExperimentPageSubTabRoute.defaultProps = {
  initialCellTypeValues: [`Inferred cell type - ontology labels`, `Inferred cell type - authors labels`, `Cell type`, `Progenitor cell type`]
}

export default ExperimentPageSubTabRoute
