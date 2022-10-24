import React, { useState } from 'react'
import PropTypes from 'prop-types'
import URI from 'urijs'

import _ from 'lodash'

import { withFetchLoader } from '@ebi-gene-expression-group/atlas-react-fetch-loader'
import CellTypeWheel from '@ebi-gene-expression-group/scxa-cell-type-wheel'
import MarkerGeneHeatmap from '@ebi-gene-expression-group/scxa-marker-gene-heatmap/lib/MarkerGeneHeatmap'
import GeneSearchForm from '@ebi-gene-expression-group/scxa-gene-search-form'

const CellTypeWheelFetchLoader = withFetchLoader(CellTypeWheel)
const MarkerGeneHeatmapFetchLoader = withFetchLoader(MarkerGeneHeatmap)
const GeneSearchFormFetchLoader = withFetchLoader(GeneSearchForm)

function CellTypeWheelExperimentHeatmap (props) {
  const [heatmapSelection, setHeatmapSelection] = useState({
    cellType: ``,
    species: ``,
    experimentAccessions: []
  })

  const onCellTypeWheelClick = (cellType, species, experimentAccessions) => setHeatmapSelection({
    cellType,
    species,
    experimentAccessions
  })

  const heatmapFulfilledPayloadProvider = heatmapData => ({
    data: heatmapData,
    xAxisCategories: _.chain(heatmapData).uniqBy(`x`).sortBy(`x`).map(`cellGroupValue`).value(),
    yAxisCategories: _.chain(heatmapData).uniqBy(`y`).sortBy(`y`).map(`geneName`).value(),
    hasDynamicHeight: _.chain(heatmapData).map(`geneName`).uniq().value().length > 5
  })

  return (
    <div className={`row-expanded`} aria-label={`Cell type wheel and heatmap of top-scoring genes of cell types in ${props.searchTerm}`}>
      <GeneSearchFormFetchLoader
        host={props.host}
        resource={props.searchFormResource}
        loadingPayloadProvider={ () => ({ speciesSelectStatusMessage: `Fetching species…` }) }
        errorPayloadProvider={ () => ({ speciesSelectStatusMessage: `Failed fetching species` }) }
        wrapperClassName={`row-expanded small-12 columns`}
        autocompleteClassName={`small-8 columns`}
        actionEndpoint={props.actionEndpoint}
        suggesterEndpoint={props.suggesterEndpoint}
        autocompleteLabel={`Search term`}
        defaultValue={ { term: props.searchTerm, category: `metadata` } }
        enableSpeciesSelect={true}
        speciesSelectClassName={`small-4 columns`}
      />
      <div className={`row-expanded small-12 columns`}>
        <div className={`small-12 medium-6 columns`} aria-label={`Cell type wheel`}>
          {props.searchTerm.length > 0 ?
            <CellTypeWheelFetchLoader
              host={props.host}
              resource={URI(props.searchTerm, props.cellTypeWheelResource).toString()}
              fulfilledPayloadProvider={cellTypeWheelData => ({data: cellTypeWheelData})}
              searchTerm={props.searchTerm}
              onCellTypeWheelClick={onCellTypeWheelClick}
            /> :
            <div className={`medium-text-center`} aria-label={`Empty search term`}>
              <h4>
                Please enter a search term to be able to see the cell type wheel.
              </h4>
            </div>
          }
        </div>
        <div className={`small-12 medium-6 columns`} aria-label={`Heatmap of top-scoring genes`}>
          {heatmapSelection.cellType ?
            <MarkerGeneHeatmapFetchLoader
              host={props.host}
              resource={URI(heatmapSelection.cellType, props.heatmapResource).toString()}
              fulfilledPayloadProvider={heatmapFulfilledPayloadProvider}
              query={{ [`experiment-accessions`]: heatmapSelection.experimentAccessions }}
              cellType={heatmapSelection.cellType}
              heatmapRowHeight={40}
              species={heatmapSelection.species}
              heatmapType={`multiexperimentcelltypes`}
            /> : props.searchTerm.length > 0 ?
              <div className={`medium-text-center`} aria-label={`No cell type selected`}>
                <h4>
                  Please click on a cell type to see a detailed view of the expression profile of top-scoring genes across experiments.
                </h4>
              </div> :
              <div/>
          }
        </div>
      </div>
    </div>
  )
}

CellTypeWheelExperimentHeatmap.propTypes = {
  host: PropTypes.string,
  searchFormResource: PropTypes.string,
  actionEndpoint: PropTypes.string,
  suggesterEndpoint: PropTypes.string,
  cellTypeWheelResource: PropTypes.string,
  heatmapResource: PropTypes.string,
  searchTerm: PropTypes.string.isRequired
}

CellTypeWheelExperimentHeatmap.defaultProps = {
  host: `/gxa/sc/`,
  searchFormResource: `json/suggestions/species`,
  actionEndpoint: `search`,
  suggesterEndpoint: `json/suggestions/gene_ids`,
  cellTypeWheelResource: `json/cell-type-wheel/`,
  heatmapResource: `json/cell-type-marker-genes/`
}

export default CellTypeWheelExperimentHeatmap
