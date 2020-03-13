import URI from 'urijs'
import _ from 'lodash'

const fetchJson = async (host, resource, queryParams) => {
  const url = URI(resource, host).search(queryParams).toString()
  const response = await fetch(url)
  return await response.json()
}

const _validateAndDownloadExperimentFiles = (host) => async (experimentAccessions, fileTypes) => {
  try {
    const response = await fetchJson(host, `json/experiments/download/zip/check`,
      { accession: experimentAccessions, fileType: fileTypes })
    const invalidFiles = _.chain(response.invalidFiles).values().flattenDeep().value()

    if (invalidFiles.length === 0 ||
        window.confirm(
          `The following files are not available:\n• ${invalidFiles.join(`\n• `)}\nWould you like to continue?`)) {
      window.location.replace(
        URI(`experiments/download/zip`, host).search({ accession: experimentAccessions, fileType: fileTypes }).toString())
    }
  } catch (e) {
    console.error(e)
  }
}

export { _validateAndDownloadExperimentFiles }
