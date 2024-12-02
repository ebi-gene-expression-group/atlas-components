import URI from "urijs"

const METADATA_PLOT = `metadata`
const CLUSTERS_PLOT = `clusters`

const updateUrl = (query, history) => {
  history.push({ ...history.location, search: query.toString() })
}

const resetHighlightClusters = (query) => {
  if (query.has(`clusterId`)) {
    query.delete(`clusterId`)
  }
}

export const updateUrlWithParams = (params, history) => {
  const query = new URLSearchParams(history.location.search)
  params.forEach(param => query.set(Object.keys(param)[0], Object.values(param)[0]))
  resetHighlightClusters(query)
  updateUrl(query, history)
}
export const plotTypeDropdown = (defaultPlotMethodAndParameterisation, plotTypesAndOptions) => {
  return Object.keys(defaultPlotMethodAndParameterisation)
    .map(plot => ({
      plotType: plot,
      plotOptions: plotTypesAndOptions[plot]
    }))
}

const getPlotOption = (plotTypeDropdown, selectedPlotType, searchPlotOption) => {
  return Object.keys(plotTypeDropdown[plotTypeDropdown.findIndex(
    (plot) => plot.plotType.toLowerCase() === selectedPlotType)].plotOptions[0])[0] + `: ` + searchPlotOption
}

export const getSelectedPlotOptionLabel = (search, state, plotTypeDropdown) => {
  return search.plotOption
    ? search.plotType
      ? getPlotOption(plotTypeDropdown, search.plotType.toLowerCase(), search.plotOption)
      : getPlotOption(plotTypeDropdown, state.selectedPlotType.toLowerCase(), search.plotOption)
    : state.selectedPlotOptionLabel
}

export const preferredK = (props) => props.selectedK
  ? props.selectedK.toString()
  : props.ks.length > 0
    ? props.ks[0].toString()
    : ``

// some experiments may have more than one organ anatomogram views, so far we decided to show the one which has the
// most available ontologies view
export const organWithMostOntologies = (anatomogram) => {
  let organAnatomograms = Object.keys(anatomogram)[0]
  for (const availableOrgan in anatomogram) {
    organAnatomograms = anatomogram[availableOrgan].length > anatomogram[organAnatomograms].length
      ? availableOrgan
      : organAnatomograms
  }
  return organAnatomograms
}

export const formatMetadata = metadata =>
  metadata.map(data => ({
    value: data.value.replaceAll(`_`, ` `),
    label: data.label
  }))

export const getHighlightClusters = search =>
  search.clusterId ? JSON.parse(search.clusterId) : []

export const getMarkerGenesResource = (state, experimentAccession) =>
  state.selectedColourByCategory === METADATA_PLOT
    ? URI(`json/experiments/${experimentAccession}/marker-genes-heatmap/cell-types`)
      .search({ cellGroupType: state.selectedColourBy })
      .toString()
    : URI(`json/experiments/${experimentAccession}/marker-genes/clusters`)
      .search({ k: state.selectedClusterId })
      .toString()

export const getSelectedColourBy = (search, state) =>
  state.selectedColourByCategory === METADATA_PLOT
    ? search.colourBy || state.selectedColourBy
    : search.k || state.selectedClusterId

// Event handlers
export const handleClusterSelection = (value, component, history) => {
  const isMetadataCluster = !parseInt(value)
  component.setState({
    selectedColourBy: isMetadataCluster ? value : null,
    selectedColourByCategory: isMetadataCluster ? METADATA_PLOT : CLUSTERS_PLOT,
    selectedClusterId: !isMetadataCluster ? value : null
  })
  updateUrlWithParams([{ [isMetadataCluster ? `colourBy` : `k`]: value }], history)
}

export const handlePlotTypeChange = (defaultPlotMethodAndParameterisation, plotOption, component, history) => {
  const defaultPlotType = defaultPlotMethodAndParameterisation[plotOption.value]
  component.setState({
    selectedPlotType: plotOption.value,
    selectedPlotOption: Object.values(defaultPlotType)[0],
    selectedPlotOptionLabel: `${Object.keys(defaultPlotType)[0]}: ${Object.values(defaultPlotType)[0]}`
  })
  updateUrlWithParams([
    { plotType: plotOption.value },
    { plotOption: Object.values(defaultPlotType)[0] }
  ], history)
}

export const handlePlotOptionChange = (plotOption, component, history) => {
  component.setState({
    selectedPlotOption: plotOption.value,
    selectedPlotOptionLabel: plotOption.label
  })
  updateUrlWithParams([{ plotOption: plotOption.value }], history)
}

export const handleColourByChange = (colourByCategory, colourByValue, component, history) => {
  const queryParams = []

  component.setState({
    selectedColourByCategory: colourByCategory
  })

  if (colourByCategory === CLUSTERS_PLOT) {
    component.setState({ selectedClusterId: colourByValue })
    queryParams.push({ k: colourByValue })
  } else {
    component.setState({ selectedColourBy: colourByValue })
    queryParams.push({ colourBy: colourByValue })
  }

  updateUrlWithParams(queryParams, history)
}
