const facetsFromPayload = (payload) => {
  let facets = []
  debugger
  payload.forEach((dropdownValue) => {
    facets.push(
      {
        value: dropdownValue,
        disabled: false
      }
    )
  })

  return { facets: facets }
}

const MultiSelectDropdownFacetGroupsDefaultProps = [
  {
    name: `Inferred cell type - ontology labels`,
    description: `Submitter-defined cell identity for a cell based on post-sequencing expression profile`,
    endpoint: `json/gene-search/cell-types`,
    payloadConversion: {facetsFromPayload}
  },
  {
    name: `Organism part`,
    description: `The tissue from which the sample is originally derived, e.g. lung`,
    endpoint: `json/gene-search/organism-parts`,
    payloadConversion: {facetsFromPayload}
  }
]

export default MultiSelectDropdownFacetGroupsDefaultProps
