import svgsMetadata from './json/svgsMetadata.json'

const unique = (element, index, array) => array.indexOf(element) === index
const isNotBlank = (str) => typeof str === `string` && str.trim() !== ``

const supportedSpecies =
  svgsMetadata
    .map((svgMetadata) => svgMetadata.species)
    .filter(unique)

const multipleViewsSpecies =
  svgsMetadata
    .filter((svgMetadata) => svgMetadata.view !== ``)
    .map((svgMetadata) => svgMetadata.species)
    .filter(unique)

const anatomogramViews =
  multipleViewsSpecies.reduce((acc, species) => {
    acc[species] =
      svgsMetadata.filter((svgMetadata) => svgMetadata.species === species)
        .map((svgMetadata) => svgMetadata.view)
        .filter(isNotBlank)
        .sort()
        .reverse()	// The order we want is `male`, `female`, `brain` and `whole_plant`, `flower_parts` :)
    return acc
  }, {})

const getAnatomogramViews = (species) => {
  if (supportedSpecies.includes(species)) {
    return anatomogramViews[species] || []
  }
}

const getDefaultView = (species) => {
  if (supportedSpecies.includes(species)) {
    return getAnatomogramViews(species).indexOf(species) >=0 ? species : getAnatomogramViews(species)[0] || null
  }
}

const getParentView = (species, view) => {
  if (supportedSpecies.includes(species)) {
    const parentPath = svgsMetadata.filter(svgMetadata => svgMetadata.view === view)[0]
    return parentPath ? parentPath.parent : null
  }
}

export {getAnatomogramViews, getDefaultView, unique, getParentView, supportedSpecies}
