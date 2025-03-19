import {isEqual,negate} from 'lodash'

import {compose, withPropsOnChange, defaultProps, mapProps, onlyUpdateForPropTypes, setPropTypes} from 'recompose'

import Anatomogram from './Anatomogram'
import PropTypes from 'prop-types'


const arrayDifference = (arr1, arr2) =>
  Array.isArray(arr1) && Array.isArray(arr2) ? arr1.filter((e) => !arr2.includes(e)) : arr1

const elementMarkup = (colour, opacity) => ({fill: colour, opacity: opacity})

const paintInitialSvgElement = (id, svgMetadata) => {
  const colour =  svgMetadata.colours ?
    svgMetadata.colours[svgMetadata.ids.findIndex(elementid => elementid === id)] :
    `grey`
  return ({fill: colour, opacity: 1.0})
}

const idsWithMarkupAccordingToCurrentColoringScheme = ({
  showIds,
  linkColour,
  showColour,
  showOpacity,
  highlightIds,
  highlightColour,
  highlightOpacity,
  selectIds,
  selectAllIds,
  selectColour,
  selectOpacity}) => {
  const uniqueShowIds = arrayDifference(showIds, [...highlightIds, ...selectIds, ...selectAllIds])
  const uniqueHighlightIds = arrayDifference(highlightIds, [...selectIds, ...selectAllIds])
  //Given an element and its ids, we take the first element of this array having one of the ids
  return [].concat(
    selectIds.length !== 0 ?
      selectIds.map(id => ({
        id,
        markupNormal: () => elementMarkup(selectColour, selectOpacity),
        markupUnderFocus: elementMarkup(selectColour, selectOpacity+0.2),
        onClick: showIds=[]
      })) :
      selectAllIds.map(id => ({
        id,
        markupNormal: () => elementMarkup(selectColour, selectOpacity),
        markupUnderFocus: elementMarkup(selectColour, selectOpacity+0.2),
        onClick: showIds=[]
      })),
    uniqueHighlightIds.map(id => ({
      id,
      markupNormal: () => elementMarkup(highlightColour, highlightOpacity),
      markupUnderFocus: elementMarkup(highlightColour, highlightOpacity+0.2),
    })),
    uniqueShowIds.map(id => ({
      id,
      markupNormal: (svgMetadata, overlapId) => overlapId ?
        paintInitialSvgElement(overlapId, svgMetadata) :
        paintInitialSvgElement(id, svgMetadata),
      markupUnderFocus: elementMarkup(highlightColour, highlightOpacity+0.2),
      markupLink: elementMarkup(linkColour, showOpacity)
    })),
  )
}

const addColoringScheme  = compose(
  defaultProps({
    showIds: [],
    highlightIds: [],
    selectIds: [],
    showColour: `grey`,
    linkColour: `blue`,
    highlightColour: `red`,
    selectColour: `purple`,
    showOpacity: 0.4,
    highlightOpacity: 1.0,
    selectOpacity: 1.0
  }),
  withPropsOnChange(negate(isEqual),
    props => ({idsWithMarkup: idsWithMarkupAccordingToCurrentColoringScheme(props)})
  )
)

const normaliseSpecies = mapProps(
  props => Object.assign({}, props, {species: props.species.toLowerCase().replace(/ +/, `_`)})
)

const addDefaultCallbacks = defaultProps({
  onMouseOver: () => {},
  onMouseOut: () => {},
  onClick: () => {},
  afterSwitchView: () => {}
})

const definePropTypes = setPropTypes({
  species: PropTypes.string.isRequired,
  idsWithMarkup: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    markupNormal: PropTypes.object.isRequired,
    markupUnderFocus: PropTypes.object.isRequired
  })).isRequired,
  onMouseOver: PropTypes.func.isRequired,
  onMouseOut: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired
})

export default compose(addColoringScheme, onlyUpdateForPropTypes, definePropTypes, addDefaultCallbacks, normaliseSpecies)(Anatomogram)
