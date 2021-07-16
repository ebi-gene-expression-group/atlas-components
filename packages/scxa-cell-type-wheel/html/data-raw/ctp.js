const _ = import('lodash')

const getTriplets = response => _.chain(response[`result-set`].docs).uniqWith(_.isEqual).reject({EOF: true}).map(triplet => _.mapValues(triplet, e => e[0])).value()

const getTriplets = response =>
  _.chain(response[`result-set`].docs)
    .uniqWith(_.isEqual)
    .reject({EOF: true})
    .map(triplet => _.mapValues(triplet, e => e[0])) // unpacks the array value
    .value()

const getOrganismRing = triplets =>
  _.chain(triplets)
    .flatMap(`organism_value`)
    .uniq()
    .map((element, index) => ({name: element, id: `1.${index}`}))
    .value()

const getOrganismPartRing = triplets =>
  _.chain(triplets)
    .flatMap(`organism_value`)
    .uniq()
    .map((element, index) => ({name: element, id: `1.${index}`}))
    .value()




const getRings = triplets =>
  _.chain(triplets)
    .groupBy('organism_value')
    .mapValues(
      organismTriplets =>

        _.chain(organismTriplets)
          .groupBy('organsim_part_value')
          .value())

    .value()


const getTriplets = response => _.chain(response[`result-set`].docs).uniqWith(_.isEqual).reject({EOF: true}).map(triplet => _.mapValues(triplet, e => e[0])).value()
const getRings = triplets => _.chain(triplets).groupBy('organism_value').mapValues(organismTriplets => _.groupBy(organismTriplets, 'organism_part_value')).value()




const getRings =
    triplets =>
      _.chain(triplets)
        .groupBy('organism_value')
        .mapValues(organismTriplets =>
          _.chain(organismTriplets)
            .groupBy('organism_part_value')
            .mapValues(organismPartTriplets =>
              _.chain(organismPartTriplets)
                .groupBy(organismPartTriplets, 'cell_type_value'))).value()



const getRings3 = triplets => _.chain(triplets).groupBy('organism_value').mapValues(organismTriplets => _.chain(organismTriplets).groupBy('organism_part_value').mapValues(organismPartTriplets => _.chain(organismPartTriplets).groupBy(organismPartTriplets, 'cell_type_value'))).value()







const getRingsBlah = triplets => _.chain(triplets).groupBy('organism_value').mapValues(organismTriplets => _.chain(organismTriplets).groupBy('organism_part_value').value()).value()




const getRings = triplets =>
  _.chain(triplets)
    .groupBy('organism_value')
    .mapValues(
      organismTriplets =>

        _.chain(organismTriplets)
          .groupBy('organism_part_value')
          .mapValues(
            organismPartTriplets =>

              _.chain(organismPartTriplets)
                .groupBy('cell_type_value')
                .value()

          )
          .value())

    .value()



const getRings = triplets =>
  _.chain(triplets)
    .groupBy('organism_value')
    .mapValues(
      organismTriplets =>

        _.chain(organismTriplets)
          .groupBy('organism_part_value')
          .mapValues(
            organismPartTriplets =>

              _.chain(organismPartTriplets)
                .groupBy('cell_type_value')
                .keys()
                .value()

          )
          .value())

    .value()


const getHierarchy = triplets =>
  _.chain(triplets)
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

const normalise = str => str.toLowerCase.replaceAll(`-`, `_`).replaceAll(` `, `_`)

const getOrganismRing = triplets =>
  Object.keys(getHierarchy(triplets))
    .map(organismValue => ({name: organismValue, id: normalise(organismValue), parent: "0.0"}))

const getOrganismPartRing = triplets =>
  Object.keys(getHierarchy(triplets))
    .forEach(organismValue =>
      Object.keys(triplets[organismValue])
        .map(organismPartValue => ({name: organismPartValue, id: normalise(organismPartValue), parent: normalise(organismValue)})))










const getHierarchy = triplets => _.chain(triplets).groupBy('organism_value').mapValues(organismTriplets => _.chain(organismTriplets).groupBy('organism_part_value').mapValues(organismPartTriplets => _.chain(organismPartTriplets).groupBy('cell_type_value').value()).value()).value()