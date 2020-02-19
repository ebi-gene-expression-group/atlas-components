import '@babel/polyfill'
import fetchMock from 'fetch-mock'

import { _validateAndDownloadExperimentFiles } from '../../src/head/downloadHelper'

import { getRandomInt, generateRandomExperimentAccession, getSingleCellExperimentFiles, generateRandomHost } from '../TestUtils'

describe(`downloadHelper`, () => {
  const MAX_EXPERIMENT_COUNT = 10

  const host = generateRandomHost()
  const experimentAccessions =
    // https://stackoverflow.com/questions/3751520/how-to-generate-sequence-of-numbers-chars-in-javascript
    Array.apply(0, Array(getRandomInt(1, MAX_EXPERIMENT_COUNT)))
      .map(() => generateRandomExperimentAccession())

  beforeAll(() => {
    delete window.location
    window.location = { replace: jest.fn() }

    window.confirm = jest.fn()
  })

  beforeEach(() => {
    fetchMock.restore()
  })

  test(`should go to download link if experiments have no missing files`, async () => {
    fetchMock.get(
      `${host}/json/experiments/download/zip/check?accession=${experimentAccessions.join(`&accession=`)}`,
      JSON.stringify(
        {
          invalidFiles:
            experimentAccessions.reduce((acc, element) => {
              acc[element] = []
              return acc
            }, {})
        }
      )
    )

    await _validateAndDownloadExperimentFiles(host)(experimentAccessions)
    expect(window.location.replace)
      .toBeCalledWith(`${host}/experiments/download/zip?accession=${experimentAccessions.join(`&accession=`)}`)
  })

  test(`should display a confirmation dialogue window if any download files are invalid`, async () => {
    fetchMock.get(
      `${host}/json/experiments/download/zip/check?accession=${experimentAccessions.join(`&accession=`)}`,
      JSON.stringify(
        {
          invalidFiles:
            experimentAccessions.reduce((acc, element) => {
              // Roll the dice! Probability of returning empty array for a single experiment: (1 - 0.5)^7 = 0.0078
              acc[element] = getSingleCellExperimentFiles(element).filter(() => Math.random() < 0.5)
              return acc
            }, {})
        }
      )
    )

    await _validateAndDownloadExperimentFiles(host)(experimentAccessions)
    expect(window.confirm).toHaveBeenCalled()
  })
})
