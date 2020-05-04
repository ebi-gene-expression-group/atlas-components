import _ from 'lodash'

// Don’t search for queries that are shorter than this
const TOKEN_MIN_LENGTH = 3

const fuzzyDeepContainsCaseInsensitive = (object, keys, value) => {
  const words =
    _.chain(object)
      .pick(keys)
      .values()
      .flatten()
      .map(_.toString)
      .map(_.toLower)
      .map(phrase => _.split(phrase, /\s+/))
      .flatten()
      .value()

  const searchTokens =
    _.chain(value)
      .toLower()
      .split(/\s+/)
      .reject(_.isEmpty)
      .filter(searchToken => searchToken.length >= TOKEN_MIN_LENGTH)
      .value()

  return (
    searchTokens.length === 0 ||
    searchTokens.some(searchToken => words.some(word => word.includes(searchToken)))
  )
}

const exactDeepContainsCaseInsensitive = (object, keys, value) =>
  _.chain(object)
    .pick(keys)
    .values()
    .flatten()
    .map(_.toString)
    .map(_.toLower)
    .some(valueToLower => valueToLower.includes(_.toString(value).toLowerCase()))
    .value()

export default (object, keys, value) => {
  const trimmedValue = value.trim()

  if (trimmedValue.charAt(0) === `"` && trimmedValue.charAt(trimmedValue.length - 1) === `"`) {
    return exactDeepContainsCaseInsensitive(object, keys, trimmedValue.substring(1, trimmedValue.length - 1))
  } else {
    return fuzzyDeepContainsCaseInsensitive(object, keys, trimmedValue)
  }
}

export { TOKEN_MIN_LENGTH }
