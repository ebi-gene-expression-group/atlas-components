import '@babel/polyfill'
import fetchMock from 'fetch-mock'

import { validateAndDownloadExperimentFiles } from '../../src/head/downloadHelper'

describe(`downloadHelper`, () => {
  const host=`http://boo`
  const checkFileEndpoint = `json/experiments/download/zip/check`
  const experimentAccessions=[`E-EHCA-2`, `E-EHCA-1`]

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
      `${host}/${checkFileEndpoint}?accession=${experimentAccessions[0]}&accession=${experimentAccessions[1]}`,
      JSON.stringify(
        {
          invalidFiles: {
            [experimentAccessions[0]]: [],
            [experimentAccessions[1]]: []
          }
        }
      )
    )

    await validateAndDownloadExperimentFiles(host, experimentAccessions)
    expect(window.location.replace).toBeCalledWith(`http://boo/experiments/download/zip?accession=E-EHCA-2&accession=E-EHCA-1`)
  })

  test(`should display a confirmation dialogue window if any download files are invalid`, async () => {
    fetchMock.get(
      `${host}/${checkFileEndpoint}?accession=${experimentAccessions[0]}&accession=${experimentAccessions[1]}`,
      JSON.stringify(
        {
          invalidFiles: {
            [experimentAccessions[0]]: [`file1`, `file2`],
            [experimentAccessions[1]]: []
          }
        }
      )
    )

    await validateAndDownloadExperimentFiles(host, experimentAccessions)
    expect(window.confirm).toHaveBeenCalled()
  })
})
