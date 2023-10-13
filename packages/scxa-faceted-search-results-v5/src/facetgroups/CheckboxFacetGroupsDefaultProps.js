const CheckboxFacetGroupsDefaultProps = [
  {
    name: `Marker genes`,
    description: `A gene that comprises part of the specific expression profile for that cluster`,
    endpoint: `json/gene-search/marker-genes`,
    queryParamName: `isMarkerGenes`,
    payloadConversion: (data) => ({
      facets: data ?
        [
          {
            group: `isMarkerGenes`,
            value: `Experiments with marker genes`,
            label: `Experiments with marker genes`,
            disabled: false
          }
        ] :
        []
    })
  },
  {
    name: `Species`,
    description: `Species from which the sample is originally derived`,
    endpoint: `json/gene-search/species`,
    queryParamName: `species`,
    payloadConversion: (data) => ({
      facets: data.map(checkboxValue =>
        ({
          group: `species`,
          value: checkboxValue,
          label: checkboxValue,
          disabled: false
        })
      )
    })
  }
]

export default CheckboxFacetGroupsDefaultProps
