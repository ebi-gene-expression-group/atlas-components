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

const bulkTableHeaders = [
  {
    label: `Type`,
    dataKey: `experimentType`,
    sortable: true,
    width: 0.5,
    image: {
      Differential: {
        src: `https://www.ebi.ac.uk/gxa/resources/images/experiments-table/differential.png`,
        alt: `Differential experiment`,
        title: `Differential experiment`
      },
      Baseline: {
        src: `https://www.ebi.ac.uk/gxa/resources/images/experiments-table/baseline.png`,
        alt: `Baseline experiment`,
        title: `Baseline experiment`
      }
    },
    linkTo: dataRow => `https://www.ebi.ac.uk/gxa/experiments?experimentType=${dataRow.experimentType.toLowerCase()}`
  },
  {
    label: `Load date`,
    dataKey: `loadDate`,
    sortable: true,
    width: 0.5
  },
  {
    label: `Species`,
    dataKey: `species`,
    searchable: true,
    sortable: true
  },
  {
    label: `Title`,
    dataKey: `experimentDescription`,
    searchable: true,
    sortable: true,
    linkTo: dataRow => `experiments/${dataRow.experimentAccession}/Results`,
    width: 2
  },
  {
    label: `Assays`,
    dataKey: `numberOfAssays`,
    sortable: true,
    linkTo: dataRow => `experiments/${dataRow.experimentAccession}/Experiment%20Design`,
    width: 0.5
  },
  {
    label: `Experimental factors`,
    dataKey: `experimentalFactors`,
    searchable: true,
    linkTo: dataRow => `experiments/${dataRow.experimentAccession}/Experiment%20Design`
  },
  {
    label: `Technology`,
    dataKey: `technologyType`,
    sortable: false
  }
]


const tableHeader = [
  {
    type: `sort`,
    title: `Technology type`,
    width: 1.5,
    dataParam: `technologyType`
  },
  {
    type: `sort`,
    title: `Loaded date`,
    width: 1.25,
    dataParam: `lastUpdate`
  },
  {
    type: `search`,
    title: `species`,
    width: 1.5,
    dataParam: `species`
  },
  {
    type: ``,
    title: `experiment description`,
    width: 6,
    dataParam: `experimentDescription`,
    link: `experimentAccession`,
    resource: `experiments`,
    endpoint: `Results`
  },
  {
    type: ``,
    title: `experiment factors`,
    width: 2,
    dataParam: `experimentalFactors`
  },
  {
    type: `sort`,
    title: `Number of assays`,
    width: 1.25,
    dataParam: `numberOfAssays`,
    link: `experimentAccession`,
    resource: `experiments`,
    endpoint: `Experiment Design`
  },
]

const dropdownFilters = [
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

export { getRandomInt, generateRandomHost, generateRandomExperimentAccession, getSingleCellExperimentFiles, bulkTableHeaders, tableHeader, data, dropdownFilters }
