import '../../src/util/MathRound'

describe(`Mozilla’s round util`, () => {

  test(`round10 works as advertised`, () => {
    expect(Math.round10(55.55, -1)).toBe(55.6)
    expect(Math.round10(55.549, -1)).toBe(55.5)
    expect(Math.round10(55, 1)).toBe(60)
    expect(Math.round10(54.9, 1)).toBe(50)
    expect(Math.round10(-55.55, -1)).toBe(-55.6)
    expect(Math.round10(-55.551, -1)).toBe(-55.6)
    expect(Math.round10(-55, 1)).toBe(-60)
    expect(Math.round10(-55.1, 1)).toBe(-60)
    expect(Math.round10(1.005, -2)).toBe(1.01)   // compare this with Math.round(1.005*100)/100 above
    expect(Math.round10(-1.005, -2)).toBe(-1.01)
  })

  test(`floor10 works as advertised`, () => {
    expect(Math.floor10(55.59, -1)).toBe(55.5)
    expect(Math.floor10(59, 1)).toBe(50)
    expect(Math.floor10(-55.51, -1)).toBe(-55.5)
    expect(Math.floor10(-51, 1)).toBe(-50)
  })

  test(`ceil10 works as advertised`, () => {
    expect(Math.ceil10(55.51, -1)).toBe(55.6)
    expect(Math.ceil10(51, 1)).toBe(60)
    expect(Math.ceil10(-55.59, -1)).toBe(-55.6)
    expect(Math.ceil10(-59, 1)).toBe(-60)
  })

  test(`returns NaN if the value is not a number or the exp is a non-integer number`, () => {
    expect(Math.round10(NaN, 2)).toEqual(NaN)
    expect(Math.round10(`foobar`, 2)).toEqual(NaN)
    expect(Math.round10([1, 2], 2)).toEqual(NaN)
    expect(Math.round10(() => {}, 2)).toEqual(NaN)
    expect(Math.round10({a:1}, 2)).toEqual(NaN)
    expect(Math.round10(10, 1.5)).toEqual(NaN)
  })

  test(`null is rounded to 0`, () => {
    expect(Math.round10(null, 1)).toEqual(0)
    expect(Math.floor10(null, 1)).toEqual(0)
    expect(Math.ceil10(null, 1)).toEqual(0)
  })

  test(`defaults to Math’s rounding methods if exp is 0 or undefined`, () => {
    const value = Math.random() * 100
    expect(Math.round10(value, 0)).toEqual(Math.round(value))
    expect(Math.floor10(value, 0)).toEqual(Math.floor(value))
    expect(Math.ceil10(value, 0)).toEqual(Math.ceil(value))
    expect(Math.round10(value, undefined)).toEqual(Math.round(value))
    expect(Math.floor10(value, undefined)).toEqual(Math.floor(value))
    expect(Math.ceil10(value, undefined)).toEqual(Math.ceil(value))
  })
})
