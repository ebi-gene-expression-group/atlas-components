const _ = require('lodash')

const normalise = str => str.toLowerCase().replace(/-/g, `_`).replace(/ /g, `_`)

const processSolrResponseToCellTypeWheel = fileName => {
  const response = require(fileName)

  const triplets = _.chain(response[`result-set`].docs)
    .uniqWith(_.isEqual)
    .reject({EOF: true})
    .map(triplet => _.mapValues(triplet, e => e[0])) // unpacks the array value
    .value()

  const hierarchy = _.chain(triplets)
    .groupBy('organism_value')
    .mapValues(
      organismTriplets =>

        _.chain(organismTriplets)
          .groupBy('organism_part_value')
          .mapValues(
            organismPartTriplets =>

              _.chain(organismPartTriplets)
                .groupBy('cell_type_value')
                .keys()   // We strip the triplets at this point, leaving only the cell type values
                .value()

          )
          .value())

    .value()


  const organismRing = Object.keys(hierarchy)
    .map(organismValue => ({
      name: organismValue,
      id: normalise(organismValue),
      parent: `root`}))

  const organismPartRing = Object.keys(hierarchy)
    .flatMap(organismValue =>
      Object.keys(hierarchy[organismValue])
        .map(organismPartValue => ({
          name: organismPartValue,
          id: normalise(organismValue) + `.` + normalise(organismPartValue),
          parent: normalise(organismValue)
        }))
    )

  const cellTypeRing = Object.keys(hierarchy)
    .flatMap(organismValue =>
      Object.keys(hierarchy[organismValue])
        .flatMap(organismPartValue =>
          hierarchy[organismValue][organismPartValue].map(cellTypeValue => ({
            name: cellTypeValue,
            id: normalise(organismValue) + `.` + normalise(organismPartValue) + `.` + normalise(cellTypeValue),
            parent: normalise(organismValue) + `.` + normalise(organismPartValue),
            value: 1
          }))
        )
    )

  return [
    {
      name: fileName,
      id: `root`,
      parent: ``
    },
    ...organismRing,
    ...organismPartRing,
    ...cellTypeRing]
}

module.exports.foo = processSolrResponseToCellTypeWheel
