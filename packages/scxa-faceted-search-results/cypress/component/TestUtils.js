import episodes from '../fixtures/episodes.json'

const facets = () => {
  return episodes.reduce((acc, episode) => acc.concat(episode.facets), [])
}

const uniqueFacets = () => {
  const allFacets = facets()
  return allFacets
    .filter((facet, index) => allFacets.findIndex((thatFacet) => facet.value === thatFacet.value) === index)
    .map((facet) => ({
      ...facet,
      disabled: false
    }))
}

const getFacetTooltip = () => {
  return Cypress._.shuffle(uniqueFacets()).find(facet => facet.description)
}

const getFacetWithoutTooltip = () => {
  return Cypress._.shuffle(uniqueFacets()).find(facet => !facet.description)
}

const getPropsWithTooltip = (facetTooltip) => {
  return {
    facetGroupName: facetTooltip.group,
      facetGroupNameDescription: facetTooltip.description,
    facets: uniqueFacets().filter(facet => facet.group === facetTooltip.group),
    onChange: () => {}
  }
}

const getPropsWithoutTooltip = () => {
  const facetWithoutTooltip = getFacetWithoutTooltip()
  return {
    facetGroupName: facetWithoutTooltip.group,
      facets: uniqueFacets().filter(facet => facet.group === facetWithoutTooltip.group),
    onChange: () => {}
  }
}

export { getFacetTooltip, getPropsWithTooltip, getPropsWithoutTooltip }
