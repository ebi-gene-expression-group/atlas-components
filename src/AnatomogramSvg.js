import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import ReactSVG from 'react-svg'

import {groupBy} from 'lodash'
import svgsMetadata from './json/svgsMetadata.json'

const groupIntoPairs = (arr, f) => Object.entries(groupBy(arr, f))
let efoLayerGroup
const getSvgElementById = (svgDomNode, showLinkBoxIds) => {
  const getEfoLayerGroup = (svgDomNode) => {
    const svgGroups = svgDomNode.getElementsByTagName(`g`)
    for (let i = 0 ; i < svgGroups.length ; i++) {
      if (svgGroups[i].id === `LAYER_EFO`) {
        return svgGroups[i]
      }
    }
  }

  efoLayerGroup = getEfoLayerGroup(svgDomNode)

  //Find link objects in svg used for transition and pass ids to showLinkBoxIds as props to show them as initialization
  Array.from(efoLayerGroup.children).filter(path =>
    path.attributes.hasOwnProperty(`link`))[0] &&
      showLinkBoxIds(Array.from(efoLayerGroup.children)
        .filter(path => path.attributes.hasOwnProperty(`link`))
        .map(link => link.id))

  return _getSvgElementById
}

const _getSvgElementById = id => {
  if (efoLayerGroup) {
    for (let i = 0 ; i < efoLayerGroup.children.length ; i++) {
      if (efoLayerGroup.children[i].id === id ) {
        if (efoLayerGroup.children[i].attributes[`xlink:href`]) {
          return _getSvgElementById(efoLayerGroup.children[i].attributes[`xlink:href`].value.substring(1))
        }
        else {
          return efoLayerGroup.children[i]
        }
      }
    }
  }
}

const paintSvgElement = (element, elementMarkup) => element && elementMarkup && Object.assign(element.style, elementMarkup)

const registerEvent = (element, eventType, elementMarkup, callback) => {
  element && element.addEventListener(eventType, () => {
    paintSvgElement(element, elementMarkup)
    callback()
  })
}


const initialiseSvgElements = (getSvgElementById, {idsWithMarkup, species, selectedView, onMouseOver, onMouseOut, onClick, onChangeView, selectIds}) => {
  //More than one id can correspond to an element - see the svg "use" elements
  groupIntoPairs(
    idsWithMarkup
      .map(e=>e.id)
      .filter((e,ix,self)=> self.indexOf(e) === ix)
      .map(id => [getSvgElementById(id),id]),
    `[0].id`
  )
    .forEach(a => {
      const element = a[1][0][0]
      const hasLink = element && element.attributes.hasOwnProperty(`link`)
      const hasOverlap = element && element.attributes.hasOwnProperty(`overlap`)
      const ids = a[1].map(t => t[1])
      //Given an element and its ids, we take the first element of the idsWithMarkup array that is one of the ids
      const markupNormalAndUnderFocus = idsWithMarkup.find(m => ids.includes(m.id))
      const svgMetadata = selectedView ?
        svgsMetadata.filter((svgMetadata) => svgMetadata.view === selectedView)[0] :
        svgsMetadata.filter((svgMetadata) => svgMetadata.species === species)[0]

      const registerEventWithOverlap = (element, eventType, elementMarkup, callback) => {
        const overlapIds = element.attributes[`overlap`].value.split(`,`)
        const overlapElements = overlapIds.map(overlapId => _getSvgElementById(overlapId))
        element && element.addEventListener(eventType, () => {
          if(!selectIds.includes(overlapIds)) {
            eventType === `mouseout` ?
              overlapElements.every((overlapElement, idx) =>
                paintSvgElement(overlapElement, markupNormalAndUnderFocus.markupNormal(svgMetadata, overlapIds[idx]))) :
              overlapElements.every(overlapElement => paintSvgElement(overlapElement, elementMarkup))
          }
          paintSvgElement(element, elementMarkup)

          callback()
        })
      }

      hasLink && markupNormalAndUnderFocus.markupLink ?
        paintSvgElement(element, markupNormalAndUnderFocus.markupLink) :
        paintSvgElement(element, markupNormalAndUnderFocus.markupNormal(svgMetadata))

      if (hasOverlap) {
        registerEventWithOverlap(element, `mouseout`, markupNormalAndUnderFocus.markupNormal(svgMetadata), onMouseOut.bind(this, ids))
        registerEventWithOverlap(element, `mouseover`, markupNormalAndUnderFocus.markupUnderFocus, onMouseOver.bind(this, ids))
        registerEventWithOverlap(element, `click`, markupNormalAndUnderFocus.onClick, onClick.bind(this, ids))

      } else {
        registerEvent(element, `mouseover`, markupNormalAndUnderFocus.markupUnderFocus, onMouseOver.bind(this, ids))

        hasLink && markupNormalAndUnderFocus.markupLink ?
          registerEvent(element, `mouseout`, markupNormalAndUnderFocus.markupLink, onMouseOut.bind(this, ids)) :
          registerEvent(element, `mouseout`, markupNormalAndUnderFocus.markupNormal(svgMetadata), onMouseOut.bind(this, ids))

        hasLink && markupNormalAndUnderFocus.onClick && selectIds.length !== 0 ?
          registerEvent(element, `click`, onChangeView(species, element.attributes.link.value), onClick.bind(this, ids)) :
          registerEvent(element, `click`, markupNormalAndUnderFocus.onClick, onClick.bind(this, ids))
      }
    })
}

const loadSvg =
  (species, selectedView) => require(`./svg/${species}${selectedView ? `.${selectedView}` : ``}.svg`).default

const AnatomogramSvgWrapperDiv = styled.div`
  display: inline-block;
  vertical-align: top;
  width: 90%;
`

// ReactSVG loads the SVG file asynchronously (hence the callback prop). We don’t use componentDidUpdate or
// componentDidMount because they can’t guarantee that the SVG is already loaded when they’re run.
const AnatomogramSvg = (props) => {
  return (
    <AnatomogramSvgWrapperDiv>
      <ReactSVG
        onInjected={(error, svgDomNode) => {
          if (error) {
            console.log(`ReactSVG Error: ${error}`)
          } else {
            initialiseSvgElements(getSvgElementById(svgDomNode, props.showLinkBoxIds), props)
          }
          props.onInjected(error, svgDomNode)
        }}
        src={loadSvg(props.species, props.selectedView)}
        svgStyle={{width: `100%`, height: `auto`, paddingLeft: props.selectedView ? `10px` : ``}} />
    </AnatomogramSvgWrapperDiv>
  )
}

AnatomogramSvg.propTypes = {
  species: PropTypes.string.isRequired,
  selectedView: PropTypes.string,
  idsWithMarkup: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    markupNormal: PropTypes.func.isRequired,
    markupUnderFocus: PropTypes.object.isRequired
  })).isRequired,
  onMouseOver: PropTypes.func.isRequired,
  onMouseOut: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  onInjected: PropTypes.func.isRequired,
  showLinkBoxIds: PropTypes.func.isRequired
}

AnatomogramSvg.defaultProps = {
  onInjected: (error, svgDomNode) => {},
}

export default AnatomogramSvg
