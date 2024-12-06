import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import URI from 'urijs'

import _ from 'lodash'

import { withFetchLoader } from '@ebi-gene-expression-group/atlas-react-fetch-loader'
import CellTypeWheel from '@ebi-gene-expression-group/scxa-cell-type-wheel'
import MarkerGeneHeatmap from '@ebi-gene-expression-group/scxa-marker-gene-heatmap/lib/MarkerGeneHeatmap'
import GeneSearchForm from '@ebi-gene-expression-group/scxa-gene-search-form'
import { encode as base64Encode } from 'base-64'

const CellTypeWheelFetchLoader = withFetchLoader(CellTypeWheel)
const MarkerGeneHeatmapFetchLoader = withFetchLoader(MarkerGeneHeatmap)
const GeneSearchFormFetchLoader = withFetchLoader(GeneSearchForm)

function CellTypeWheelExperimentHeatmap(props) {
  const [allSpecies, setAllSpecies] = useState(null) // State to hold the fetched data
  const [loading, setLoading] = useState(true) // State to handle loading status
  const [error, setError] = useState(null)

  useEffect(() => {
    // Define the async function inside useEffect
    const fetchData = async () => {
      const url = URI(props.searchFormResource, props.host).toString()
      try {
        const response = await fetch(url)
        if (!response.ok) {
          throw new Error(`Network response was not ok`)
        }
        const result = await response.json()
        setAllSpecies(result.allSpecies) // Update state with the fetched data
      } catch (err) {
        setError(err.message)
        setAllSpecies([])// Update state with the error message
      } finally {
        setLoading(false) // Set loading to false once the fetch is complete
      }
    }

    fetchData()
  }, [])

  const [heatmapSelection, setHeatmapSelection] = useState({
    cellType: ``,
    species: ``,
    experimentAccessions: []
  })

  const onCellTypeWheelClick = (cellType, species, experimentAccessions) => {
    return setHeatmapSelection({
      cellType,
      species,
      experimentAccessions
    })
  }
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
        defaultSpecies={props.species}
      />
      <div className={`row-expanded small-12 columns`}>
        <div className={`small-12 medium-6 columns`} aria-label={`Cell type wheel`}>
          {props.searchTerm.trim() ?
            <CellTypeWheelFetchLoader
              host={props.host}
              resource={URI(props.cellTypeWheelResource)
                .segment(props.searchTerm)
                .toString()}
              query={ props.species ? { species: props.species } : {} }
              fulfilledPayloadProvider={cellTypeWheelData => ({ data: cellTypeWheelData })}
              searchTerm={props.searchTerm}
              species={props.species ? props.species : `any species`}
              allSpecies={allSpecies}
              onCellTypeWheelClick={onCellTypeWheelClick}
            /> :
            <div className={`medium-text-center`} aria-label={`Empty search term`}>
              <h4>
                Please enter a search term to be able to see the distribution of cell types across species.
              </h4>
            </div>
          }
        </div>
        <div className={`small-12 medium-6 columns`} aria-label={`Heatmap of top-scoring genes`}>
          {heatmapSelection.cellType ?
            <MarkerGeneHeatmapFetchLoader
              host={props.host}
              resource={URI(props.heatmapResource)
                .segmentCoded(base64Encode(heatmapSelection.cellType)).toString()}
              fulfilledPayloadProvider={heatmapFulfilledPayloadProvider}
              query={{ [`experiment-accessions`]: heatmapSelection.experimentAccessions }}
              cellType={heatmapSelection.cellType}
              heatmapRowHeight={40}
              species={heatmapSelection.species}
              heatmapType={`multiexperimentcelltypes`}
            /> :
            props.searchTerm.trim() ?
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
  searchTerm: PropTypes.string.isRequired,
  species: PropTypes.string
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
