const CheckboxFacetGroupsDefaultProps = [
  {
    name: `Marker genes`,
    description: `A gene that comprises part of the specific expression profile for that cluster`,
    endpoint: `json/gene-search/marker-genes`,
    queryParamName: `isMarkerGenes`,
    payloadConversion: (data) => {
      return data === true ?
        {
          facets: [
            {
              group: `isMarkerGenes`,
              value: `Experiments with marker genes`,
              label: `Experiments with marker genes`,
              disabled: false
            }
          ]
        } :
        { facets: [] }
    }
  },
  {
    name: `Species`,
    description: `Species from which the sample is originally derived`,
    endpoint: `json/gene-search/species`,
    queryParamName: `species`,
    payloadConversion: (data) => {
      const facets = []
      data.map(checkboxValue => facets.push(
        {
          group: `species`,
          value: checkboxValue,
          label: checkboxValue,
          disabled: false
        }
      ))

      return { facets }
    }
  }
]

export default CheckboxFacetGroupsDefaultProps
