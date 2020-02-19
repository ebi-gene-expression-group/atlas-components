import URI from 'urijs'
import _ from 'lodash'

const fetchJson = async (host, queryParams) => {
  const url = URI(`json/experiments/download/zip/check`, host).search(queryParams).toString()
  const response = await fetch(url)
  return await response.json()
}

const validateAndDownloadExperimentFiles = async (host, experimentAccessions) => {
  try {
    const response = await fetchJson(host, { accession: experimentAccessions })
    const invalidFiles = _.chain(response.invalidFiles).values().flattenDeep().value()

    if (invalidFiles.length === 0 ||
        window.confirm(
          `The following files are not available.\n${invalidFiles.join(`\n`)}\nWould you like to continue?`)) {
      window.location.replace(
        URI(`experiments/download/zip`, host).search({ accession: experimentAccessions }).toString())
    }
  } catch (e) {
    console.error(`error`, e)
  }
}

export { validateAndDownloadExperimentFiles }
