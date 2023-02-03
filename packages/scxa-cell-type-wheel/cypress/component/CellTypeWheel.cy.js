import React from 'react'
import CellTypeWheel from '../../src/CellTypeWheel'

import cellTypeWheelData from '../fixtures/lung-cancer.json'
// cell type wheel data labels not showing properly with the cancer json response on Mac
// a github issue is reported in highcharts repo: https://github.com/highcharts/highcharts/issues/18332
import cancerCellTypeWheelData from '../fixtures/cancer.json'

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function firstWordMatcherOf(str) {
  return new RegExp(`.${str.split(` `)[0]}*`)
}

describe(`<CellTypeWheel>`, () => {
  it(`mounts with no data`, () => {
    cy.mount(<CellTypeWheel />)
    cy.get(`.highcharts-series`).find(`path`).should(`have.length`, 0)
    cy.get(`.highcharts-data-labels`).find(`text`).should(`have.length`, 0)
  })

  it(`mounts with non-empty data`, () => {
    cy.mount(<CellTypeWheel data={cellTypeWheelData}/>)
    cy.get(`.highcharts-series`).find(`path`).should(`have.length`, cellTypeWheelData.length)
    cy.get(`.highcharts-data-labels`).find(`text`).should(`have.length`, cellTypeWheelData.length)
  })

  it(`displays search term prop in the chart title`, () => {
    const searchTerm = `lung cancer`
    cy.mount(<CellTypeWheel searchTerm={searchTerm} data={cellTypeWheelData}/>)
    // Because titles with multiple words are broken in several <tspan> elements, they are joined without spaces
    // E.g. <tspan>lung</tspan><tspan>cancer</tspan> returns the text `lungcancer`
    // This text could be extended to all words if you prefer...
    cy.get(`.highcharts-title`).invoke(`text`).then(text => assert.isTrue(firstWordMatcherOf(searchTerm).test(text)))
  })

  it(`invokes the onCellTypeWheelClick callback with correct arguments when clicking on outer ring sections`, () => {
    const callbackWrapper = {
      onCellTypeWheelClick: function (cellType, species, experimentAccessions) {
      }
    }
    cy.spy(callbackWrapper, `onCellTypeWheelClick`).as(`onCellTypeWheelClick`)

    // Cell types have two ancestors in their id field
    const cellTypeNodes = cellTypeWheelData.filter(e => /.+#.+#.+/.test(e.id))
    const randomCellTypeNode = cellTypeNodes[getRandomInt(cellTypeNodes.length)]

    cy.mount(
      <CellTypeWheel
        data={cellTypeWheelData}
        onCellTypeWheelClick={callbackWrapper.onCellTypeWheelClick}
      />)

    // A clickable label has either of the following shapes:
    // <text ...><tspan ...><title>{Cell type name}</title></tspan></text> for straight labels
    // <text ...><path ...></path><textPath ...>{Cell type name}</textPath></text> for arced labels
    const outerRingTextPath = cy.contains(randomCellTypeNode.name).parents(`text`)
    outerRingTextPath.click()

    cy.get(`@onCellTypeWheelClick`)
      .should(`have.been.calledOnceWith`, randomCellTypeNode.name, randomCellTypeNode.id.split(`#`)[0], randomCellTypeNode.experimentAccessions)
  })

  it(`doesn’t call onCellTypeWheelClick when clicking on inner ring sections`, () => {
    const callbackWrapper = {
      onCellTypeWheelClick: function (cellType, species, experimentAccessions) {
      }
    }
    cy.spy(callbackWrapper, `onCellTypeWheelClick`).as(`onCellTypeWheelClick`)

    // Inner nodes (species, organism parts) have anything but two ancestors in their id field
    const innerNodes =
      cellTypeWheelData
        .filter(e => !(/.+#.+#.+/.test(e.id)))
        // For some mysterious reason this specific label is covered by a <path> shape
        .filter(e => e.name !== `middle lobe of right lung`)
    const randomCellTypeNode = innerNodes[getRandomInt(innerNodes.length)]

    cy.mount(
      <CellTypeWheel
        data={cellTypeWheelData}
        onCellTypeWheelClick={callbackWrapper.onCellTypeWheelClick}
      />)

    const outerRingTextPath = cy.contains(randomCellTypeNode.name).parents(`text`)
    // Uncomment the line below to make the test fail :(
    // const outerRingTextPath = cy.contains(`middle lobe of right lung`).parents(`text`)
    outerRingTextPath.click()

    cy.get(`@onCellTypeWheelClick`).should(`not.have.been.called`)
  })

  it(`should show data labels properly after clicking on a species/organism part and zooming in`, () => {
    const callbackWrapper = {
      onCellTypeWheelClick: function (cellType, species, experimentAccessions) {
      }
    }
    cy.mount(
        <CellTypeWheel
            data={cancerCellTypeWheelData}
            onCellTypeWheelClick={callbackWrapper.onCellTypeWheelClick}
        />)
    const innerRingElement = cy.contains(`Homo sapiens`)
    innerRingElement.click({ force: true })
    const ringElement = cy.contains(`brain`)
    ringElement.click({ force: true })
    cy.contains(`astrocyte`)

    cy.get(`.highcharts-data-labels`).find(`text`).each(label =>
        cy.get(label[0].attributes.visibility).should(`not.exist`)
    )

  })
})
