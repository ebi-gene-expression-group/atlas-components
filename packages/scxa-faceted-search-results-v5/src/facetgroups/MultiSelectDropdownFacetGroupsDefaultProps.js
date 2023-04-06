const MultiSelectDropdownFacetGroupsDefaultProps = [
  {
    name: `Inferred cell type - ontology labels`,
    description: `Submitter-defined cell identity for a cell based on post-sequencing expression profile`,
    endpoint: `json/gene-search/cell-types`,
    payloadConversion: (payload) => {
      let facets = []
      payload.forEach((dropdownValue) => {
        facets.push(
          {
            value: `cellTypes`,
            label: dropdownValue,
            disabled: false
          }
        )
      })

      return { facets: facets }
    }
  },
  {
    name: `Organism part`,
    description: `The tissue from which the sample is originally derived, e.g. lung`,
    endpoint: `json/gene-search/organism-parts`,
    payloadConversion: (payload) => {
      let facets = []
      payload.forEach((dropdownValue) => {
        facets.push(
          {
            value: `organism-parts`,
            label: dropdownValue,
            disabled: false
          }
        )
      })

      return { facets: facets }
    }
  }
]

export default MultiSelectDropdownFacetGroupsDefaultProps
