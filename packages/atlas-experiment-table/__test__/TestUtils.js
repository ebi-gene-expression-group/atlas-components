import React from 'react'
import styled from 'styled-components'

// Stolen from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
const getRandomInt = (min, max) => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min)) + min //The maximum is exclusive and the minimum is inclusive
}

const TableCellDiv = styled.div`
  font-size: 13px;
  font-family: Helvetica, Arial, FreeSans, "Liberation Sans", sans-serif;
`

const tableHeader = [
  { type: `sort`, title: `Loaded date`, width: 140, dataParam: `lastUpdate` },
  { type: `search`, title: `species`, width: 200, dataParam: `species` },
  { type: ``, title: `experiment description`, width: 360, dataParam: `experimentDescription`, link: `experimentAccession`, resource: `experiments`, endpoint: `Results` },
  { type: `plain`, title: `experiment factors`, width: 260, dataParam: `experimentalFactors` },
  { type: `sort`, title: `Number of assays`, width: 160, dataParam: `numberOfAssays`, link: `experimentAccession`, resource: `experiments`, endpoint: `Experiment Design` },
]

const data = [
  {
    experimentType: `SINGLE`,
    experimentAccession: `E-EHCA-2`,
    experimentDescription: `Melanoma infiltration`,
    lastUpdate: `16-11-2018`,
    numberOfAssays: 6638,
    numberOfContrasts: 0,
    species: `Mus musculus`,
    kingdom: `animals`,
    experimentalFactors: [`single cell identifier`, `sampling site`,`time`],
  },
  {
    experimentType: `SINGLE`,
    experimentAccession: `E-GEOD-99058`,
    experimentDescription: `Single cell`,
    lastUpdate: `11-10-2018`,
    numberOfAssays: 250,
    numberOfContrasts: 0,
    species: `Mus musculus`,
    kingdom: `animals`,
    experimentalFactors: [`single cell identifier`]
  },
  {
    experimentType: `SINGLE`,
    experimentAccession: `E-MTAB-5061`,
    experimentDescription: `healthy individuals and type 2 diabetes patients`,
    lastUpdate: `11-10-2018`,
    numberOfAssays: 3514,
    numberOfContrasts: 0,
    species: `Homo sapiens`,
    kingdom: `plants`,
    experimentalFactors: [`single cell identifier`, `disease`],
  }
]

export {getRandomInt, TableCellDiv, tableHeader, data}
