import Color from 'color'
import colorize from '../src/colorize'

// The maximum is exclusive and the minimum is inclusive
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random#Getting_a_random_number_between_two_values
const generateRandomArbitrary = (min, max) => Math.random() * (max - min) + min
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random#Getting_a_random_integer_between_two_values
const generateRandomInt = (min, max) => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min)) + min
}

const stops = [
  // The last stop acts as a
  {
    cutoff: 0.1,
    color: `#e1e9f4`
  },
  {
    cutoff: 1,
    color: `#d4e4fb`
  },
  {
    cutoff: 10,
    color: `#95adde`
  },
  {
    cutoff: 100,
    color: `#6077bf`
  },
  {
    cutoff: 1000,
    color: `#1151d1`
  },
  {
    cutoff: 10000,
    color: `#35419b`
  },
  {
    cutoff: 100000,
    color: `#0e0573`
  },
  {
    cutoff: 1000000,
    color: `#07004c`
  }
]
const defaultColor = `#eeeeee`

describe(`Colorize`, () => {
  const _colorize = colorize(stops, defaultColor)

  test(`assigns the maximum colour for values greater than or equal to 1,000,000`, () => {
    expect(_colorize(generateRandomInt(stops[stops.length - 1].cutoff, Number.MAX_SAFE_INTEGER))).toEqual(Color(stops[stops.length - 1].color).toString())
  })

  test(`returns defaultColor if value is less than 0`, () => {
    expect(_colorize(generateRandomArbitrary(0, stops[0].cutoff))).toEqual(Color(defaultColor).alpha(0.65).toString())
  })

  test(`exact color`, () => {
    const foo = generateRandomInt(0, stops.length)

    expect(_colorize(stops[foo].cutoff)).toEqual(Color(stops[foo].color).toString())
  })
})
