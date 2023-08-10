const MultiSelectDropdownFacetGroupsDefaultProps = [
  {
    name: `Inferred cell type - ontology labels`,
    description: `Submitter-defined cell identity for a cell based on post-sequencing expression profile`,
    endpoint: `json/gene-search/cell-types`,
    queryParamName: `cellTypes`,
    payloadConversion: (payload) => {
      return {
        facets: payload.map(dropdownValue => (
          {
            group: `cellTypes`,
            value: dropdownValue,
            label: dropdownValue,
            disabled: false
          }
        ))
      }
    }
  },
  {
    name: `Organism part`,
    description: `The tissue from which the sample is originally derived, e.g. lung`,
    endpoint: `json/gene-search/organism-parts`,
    queryParamName: `organism-parts`,
    payloadConversion: (payload) => {
      return {
        facets: payload.map(dropdownValue => (
          {
            group: `organism-parts`,
            value: dropdownValue,
            label: dropdownValue,
            disabled: false
          }
        ))
      }
    }
  }
]

export default MultiSelectDropdownFacetGroupsDefaultProps
