import React from 'react'
import styled from 'styled-components'
import randomString from 'random-string'

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
const generateRandomExperimentAccession = () => {
  return `E-${randomString({length: 4, numeric: false}).toUpperCase()}-${getRandomInt(1, 9999)}`
}

const generateRandomHost = () =>
  `http${Math.random() < 0.5 ? `s` : ``}://` +
  `${Math.random() < 0.5 ? `www` : randomString({length: getRandomInt(2, 6)}).toLowerCase()}.` +
  `${randomString({length: getRandomInt(3, 15)}).toLowerCase()}.` +
   [`com`, `org`, `co.uk`, `ac.uk`, `net`, `es`][getRandomInt(0, 6)]

const getSingleCellExperimentFiles = (experimentAccession) =>
  [
    `${experimentAccession}.aggregated_filtered_counts.mtx`,
    `${experimentAccession}.aggregated_filtered_counts.mtx_cols`,
    `${experimentAccession}.aggregated_filtered_counts.mtx_rows`,
    `${experimentAccession}.aggregated_filtered_normalised_counts.mtx`,
    `${experimentAccession}.aggregated_filtered_normalised_counts.mtx_cols`,
    `${experimentAccession}.aggregated_filtered_normalised_counts.mtx_rows`,
    `ExpDesign-${experimentAccession}.tsv`
  ]

const tableHeader = [
  {type: `sort`, title: `Technology type`, width: 240, dataParam: `technologyType`},
  { type: `sort`, title: `Loaded date`, width: 140, dataParam: `lastUpdate` },
  { type: `search`, title: `species`, width: 200, dataParam: `species` },
  { type: ``, title: `experiment description`, width: 360, dataParam: `experimentDescription`, link: `experimentAccession`, resource: `experiments`, endpoint: `Results` },
  { type: ``, title: `experiment factors`, width: 260, dataParam: `experimentalFactors` },
  { type: `sort`, title: `Number of assays`, width: 160, dataParam: `numberOfAssays`, link: `experimentAccession`, resource: `experiments`, endpoint: `Experiment Design` },
]

const tableFilters = [
  {
    label: `Kingdom`,
    dataParam: `kingdom`
  },
  {
    label: `Experiment Project`,
    dataParam: `experimentProjects`
  },
  {
    label: `Technology Type`,
    dataParam: `technologyType`
  }
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
    experimentProjects: [`Human Cell Atlas`],
    technologyType: [`smart-seq2`]
  },
  {
    experimentType: `DOUBLE`,
    experimentAccession: `E-GEOD-99058`,
    experimentDescription: `Single cell`,
    lastUpdate: `11-10-2018`,
    numberOfAssays: 250,
    numberOfContrasts: 0,
    species: `Mus musculus`,
    kingdom: `animals`,
    experimentalFactors: [`single cell identifier`],
    experimentProjects:[],
    technologyType: [`smart-seq2`]
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
    experimentProjects: [`Human Cell Atlas`, `Chan-Zuckerberg Biohub`],
    technologyType: [`smart-seq2`, `10xV1`]
  },
  {
    experimentType: `UNKNOWN`,
    experimentAccession: `E-MTAB-5061`,
    experimentDescription: `healthy individuals and type 2 diabetes patients`,
    lastUpdate: `11-10-2018`,
    numberOfAssays: 3514,
    numberOfContrasts: 0,
    species: `Homo sapiens`,
    kingdom: `plants`,
    experimentalFactors: [`single cell identifier`, `disease`],
    experimentProjects: [`Human Cell Atlas`, `Chan-Zuckerberg Biohub`],
    technologyType: [`smart-seq2`, `10xV1`]
  }
]

export { getRandomInt, generateRandomExperimentAccession, generateRandomHost, getSingleCellExperimentFiles, TableCellDiv, tableHeader, data, tableFilters }
