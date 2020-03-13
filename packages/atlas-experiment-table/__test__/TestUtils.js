import randomString from 'random-string'

// Stolen from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
const getRandomInt = (min, max) => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min)) + min //The maximum is exclusive and the minimum is inclusive
}

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

const randomSubstring = (str, minLength = 1) => {
  if (str.length <= minLength) {
    return str
  }

  const substringLength = getRandomInt(minLength, str.length + 1)
  const startIndex = getRandomInt(0, str.length - substringLength + 1)
  return str.substring(startIndex, startIndex + substringLength).trim()
}

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

const bulkDropdownFilters = [
  {
    label: `Kingdom`,
    dataKey: `kingdom`
  },
  {
    label: `Experiment Type`,
    dataKey: `experimentType`
  }
]

const bulkRowSelectionColumn = {
  label: `Download`,
  dataKey: `experimentAccession`,
  tooltipContent:
    `<ul>` +
      `<li>Expression matrices in TPMs or log<sub>2</sub>fold-change</li>` +
      `<li>Experiment design file with experimental metadata</li>` +
    `</ul>`,
  width: 0.75
}

const singleCellTableHeaders = [
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
    linkTo: function(dataRow) { return `experiments/` + dataRow.experimentAccession + `/results` },
    width: 2
  },
  {
    label: `Experimental factors`,
    dataKey: `experimentalFactors`,
    searchable: true
  },
  {
    label: `Number of cells`,
    dataKey: `numberOfAssays`,
    sortable: true,
    linkTo: function(dataRow) { return `experiments/` + dataRow.experimentAccession + `/experiment-design` },
    width: 0.5
  }
]

const singleCellDropdownFilters = [
  {
    label: `Kingdom`,
    dataKey: `kingdom`
  },
  {
    label: `Experiment Project`,
    dataKey: `experimentProjects`
  },
  {
    label: `Technology Type`,
    dataKey: `technologyType`
  }
]

const singleCellRowSelectionColumn = {
  label: `Download`,
  dataKey: `experimentAccession`,
  tooltipContent:
    `<ul>` +
      `<li>Raw filtered count matrix after quantification</li>` +
      `<li>Normalised filtered count matrix after quantification</li>` +
      `<li>Experiment design file with experimental metadata</li>` +
    `</ul>`,
  width: 0.5
}

const downloadFileTypes = [
  {
    description: `File type 1`,
    id: `file1`
  },
  {
    description: `File type 2`,
    id: `file-2`
  },
  {
    description: `File type 3`,
    id: `file-type3`
  }
]

export {
  getRandomInt, generateRandomHost, generateRandomExperimentAccession, randomSubstring,
  getSingleCellExperimentFiles, downloadFileTypes,
  bulkTableHeaders, bulkDropdownFilters, bulkRowSelectionColumn,
  singleCellTableHeaders, singleCellDropdownFilters, singleCellRowSelectionColumn
}
