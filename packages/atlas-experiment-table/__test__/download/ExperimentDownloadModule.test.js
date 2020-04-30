// Even if we pass a callback mock to loadExperimentDownloadModule, validateAndDownloadExperimentFiles is imported in
// the module itself, so we need Babel’s polyfill for fetch
import '@babel/polyfill'
import { act } from 'react-dom/test-utils'

import loadExperimentDownloadModule from '../../src/download/ExperimentDownloadModule'

import { downloadFileTypes, generateRandomExperimentAccession, generateRandomHost } from '../TestUtils'

describe(`ExperimentDownloadModule`, () => {
  const host = generateRandomHost()
  const popupPlaceholderId = `popup-placeholder`
  const callbackMock = jest.fn()
  let container, openDownloadPopup

  beforeAll(() => {
    container = document.createElement(`div`)
    container.setAttribute(`id`, popupPlaceholderId)
    document.body.appendChild(container)
    openDownloadPopup =
      loadExperimentDownloadModule(host, downloadFileTypes, popupPlaceholderId, callbackMock)
  })

  beforeEach(() => {
    // Close the pop-up if the test hasn’t done so
    if (container.querySelector(`.mm-popup--visible`) !== null) {
      container.querySelectorAll(`button`)[1].dispatchEvent(new MouseEvent(`click`, {bubbles: true}))
    }

    callbackMock.mockClear()
  })

  test(`exports a function that displays a pop-up when run`, () => {
    expect(container.querySelector(`.mm-popup`)).not.toBeNull()
    // The pop-up div isn’t visible yet
    expect(container.querySelector(`.mm-popup--visible`)).toBeNull()
    expect(container.querySelector(`button`)).toBeNull()

    act(() => {
      openDownloadPopup()
    })
    expect(container.querySelector(`.mm-popup`)).not.toBeNull()
    expect(container.querySelector(`.mm-popup--visible`)).not.toBeNull()
    // Close (not visible), cancel and success buttons;
    expect(container.querySelectorAll(`button`)).toHaveLength(3)
    expect(container.querySelectorAll(`button`)[1].textContent).toEqual(`Cancel`)
    expect(container.querySelectorAll(`button`)[2].textContent).toEqual(`Download`)
  })

  test(`displays a pop-up that can be dismissed with the second (i.e. Cancel) button`, () => {
    act(() => {
      openDownloadPopup()
    })
    expect(container.querySelector(`.mm-popup--visible`)).not.toBeNull()

    act(() => {
      container.querySelectorAll(`button`)[1].dispatchEvent(new MouseEvent(`click`, {bubbles: true}))
    })
    expect(container.querySelector(`.mm-popup--visible`)).toBeNull()
  })

  test(`runs the callback argument when the success (i.e. Download) button is clicked`, async () => {
    const experimentAccession = generateRandomExperimentAccession()
    act(() => {
      openDownloadPopup([experimentAccession])
    })
    expect(container.querySelector(`.mm-popup--visible`)).not.toBeNull()

    act(() => {
      container.querySelectorAll(`button`)[2].dispatchEvent(new MouseEvent(`click`, {bubbles: true}))
    })

    expect(callbackMock.mock.calls.length).toBe(1)
    expect(callbackMock.mock.calls[0][0]).toBe(host)
    expect(callbackMock.mock.calls[0][1]).toEqual([experimentAccession])
    expect(callbackMock.mock.calls[0][2]).toEqual(downloadFileTypes.map(fileType => fileType.id))
  })

  // Rather than messing with the DOM to click checkboxes (which is functionality from ExperimentFileTypeMultiChoice
  // anyway) or trying to modify selectedFileTypeIds (which I think can’t be done), we run the module function with an
  // empty array in the download filetypes argument. This is a situation that won’t happen if the module is used as
  // intended but it serves our test case.
  test(`does nothing if no filetypes are selected`, async () => {
    openDownloadPopup =
      loadExperimentDownloadModule(host, [], popupPlaceholderId, callbackMock)
    const experimentAccession = generateRandomExperimentAccession()
    act(() => {
      openDownloadPopup([experimentAccession])
    })
    expect(container.querySelector(`.mm-popup--visible`)).not.toBeNull()

    act(() => {
      container.querySelectorAll(`button`)[2].dispatchEvent(new MouseEvent(`click`, {bubbles: true}))
    })

    expect(callbackMock.mock.calls.length).toBe(0)
  })
})
