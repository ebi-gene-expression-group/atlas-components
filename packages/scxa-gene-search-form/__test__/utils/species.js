const getRandomInt = (max) => Math.floor(Math.random() * Math.floor(max))

const species = [
  `Meeseek`,
  `Gromflomite`,
  `Cromulon`,
  `Zigerion`,
  `Moopian`,
  `Bliznarvian`,
  `Greebybobe`
]

const getAll = () => species
const getRandom = () => species[getRandomInt(species.length)]
const getRandomSet = () => species.filter(() => Math.random() > 0.5)

export { getAll, getRandom, getRandomSet }
