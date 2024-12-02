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

export const getPlotOption = (selectedPlotType) => {
  return Object.keys(plotTypeDropdown[plotTypeDropdown.findIndex(
    (plot) => plot.plotType.toLowerCase() === selectedPlotType)].plotOptions[0])[0] + `: ` + search.plotOption
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
