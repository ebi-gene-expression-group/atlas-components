import _ from 'lodash'
import search, { TOKEN_MIN_LENGTH } from '../src/search'

import bulkExperiments from './experiments-bulk.json'

import { randomSubstring } from './TestUtils'

const getRandomValueFromKeyedRows = (dataRows, dataKey) =>
  _.chain(dataRows)
    .map(dataRow => _.pick(dataRow, dataKey))
    .flatMapDeep(_.values)
    .sample()
    .value()

const getRandomTextFieldDataKey = dataRows =>
  _.chain(dataRows)
    .map(dataRow => _.pickBy(dataRow, _.isString))
    .flatMap(_.keys)
    .uniq()
    .sample()
    .value()

describe(`Search function`, () => {
  test(`can match long enough substrings`, () => {
    let dataKey
    let queryString = ``
    while (queryString.length < TOKEN_MIN_LENGTH) {
      dataKey = getRandomTextFieldDataKey(bulkExperiments)
      queryString = randomSubstring(getRandomValueFromKeyedRows(bulkExperiments, dataKey))
    }

    const searchResults = bulkExperiments.filter(bulkExperiment => search(bulkExperiment, dataKey, queryString))

    expect(searchResults.length).toBeGreaterThan(0)
    expect(searchResults.length).toBeLessThan(bulkExperiments.length)
  })

  test(`is case insensitive`, () => {
    const dataKey = getRandomTextFieldDataKey(bulkExperiments)
    const queryString = getRandomValueFromKeyedRows(bulkExperiments, dataKey)
    const searchResults = bulkExperiments.filter(bulkExperiment => search(bulkExperiment, dataKey, queryString))
    const searchResultsUpper =
      bulkExperiments.filter(bulkExperiment => search(bulkExperiment, dataKey, queryString.toUpperCase()))
    const searchResultsLower =
      bulkExperiments.filter(bulkExperiment => search(bulkExperiment, dataKey, queryString.toLowerCase()))

    expect(searchResults).toHaveLength(searchResultsUpper.length)
    expect(searchResults).toHaveLength(searchResultsLower.length)
    expect(searchResults.length).toBeGreaterThan(0)
  })

  test(`can search multiple results separating query terms with spaces`, () => {
    const dataKey = getRandomTextFieldDataKey(bulkExperiments)
    const queryString1 = getRandomValueFromKeyedRows(bulkExperiments, dataKey)
    const queryString2 = getRandomValueFromKeyedRows(bulkExperiments, dataKey)
    const searchResults1 = bulkExperiments.filter(bulkExperiment => search(bulkExperiment, dataKey, queryString1))
    const searchResults2 = bulkExperiments.filter(bulkExperiment => search(bulkExperiment, dataKey, queryString2))

    const searchResults12 =
      bulkExperiments.filter(bulkExperiment => search(bulkExperiment, dataKey, `${queryString1} ${queryString2}`))
    const searchResults21 =
      bulkExperiments.filter(bulkExperiment => search(bulkExperiment, dataKey, `${queryString2} ${queryString1}`))
    const searchResults21Foobar =
      bulkExperiments.filter(
        bulkExperiment => search(bulkExperiment, dataKey, `${queryString2} foobar ${queryString1}`))

    expect(searchResults1.length).toBeGreaterThan(0)
    expect(searchResults2.length).toBeGreaterThan(0)
    expect(searchResults12.length).toBeGreaterThan(searchResults1.length)
    expect(searchResults12.length).toBeGreaterThan(searchResults2.length)

    expect(searchResults12).toHaveLength(searchResults21.length)
    expect(searchResults12).toHaveLength(searchResults21Foobar.length)
  })


  test(`can search for exact phrases enclosing query in double quotes`, () => {
    const dataKey = getRandomTextFieldDataKey(bulkExperiments)
    const queryString1 = getRandomValueFromKeyedRows(bulkExperiments, dataKey)
    const queryString2 = getRandomValueFromKeyedRows(bulkExperiments, dataKey)
    const searchResults1 =
      bulkExperiments.filter(bulkExperiment => search(bulkExperiment, dataKey, `"${queryString1}"`))
    const searchResults2 =
      bulkExperiments.filter(bulkExperiment => search(bulkExperiment, dataKey, `"${queryString2}"`))

    const searchResults12 =
      bulkExperiments.filter(bulkExperiment => search(bulkExperiment, dataKey, `"${queryString1} ${queryString2}"`))

    expect(searchResults1.length).toBeGreaterThan(0)
    expect(searchResults2.length).toBeGreaterThan(0)
    expect(searchResults12).toHaveLength(0)
  })
})
