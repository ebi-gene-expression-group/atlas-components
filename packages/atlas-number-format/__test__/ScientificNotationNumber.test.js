import React from 'react'
import renderer from 'react-test-renderer'
import Enzyme from 'enzyme'
import {shallow, mount, render} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

Enzyme.configure({ adapter: new Adapter() })

import ScientificNotationNumber from '../src/ScientificNotationNumber.js'

describe(`ScientificNotationNumber`, () => {
  test(`renders numbers in the range [0.1, 100000[ as-is`, () => {
    expect(render(<ScientificNotationNumber value={0.1}/>).text()).toEqual(`0.1`)
    expect(render(<ScientificNotationNumber value={99999}/>).text()).toEqual(`99999`)
    expect(render(<ScientificNotationNumber value={1.23456}/>).text()).toEqual(`1.23456`)
  })

  test(`renders 0 as 0`, () => {
    expect(render(<ScientificNotationNumber value={0}/>).text()).toEqual(`0`)
  })

  test(`rounds numbers with accuracy 4 by default`, () => {
    expect(render(<ScientificNotationNumber value={123456}/>).text()).toEqual(`1.2346 × 105`)
  })

  test(`displays big powers of 10 without leading "1 ×"`, () => {
    expect(render(<ScientificNotationNumber value={10000000000}/>).text()).toEqual(`1010`)
  })

  test(`removes trailing zeros in the mantissa`, () => {
    expect(render(<ScientificNotationNumber value={23.0000}/>).text()).toEqual(`23`)
    expect(render(<ScientificNotationNumber value={123456.0000}/>).text()).toEqual(`1.2346 × 105`)
    expect(render(<ScientificNotationNumber value={10000000000001}/>).text()).toEqual(`1013`)
  })

  test(`matches snapshot`, () => {
    const bigNumberTree = renderer.create(
      <ScientificNotationNumber value={314159265359} />
    ).toJSON()
    expect(bigNumberTree).toMatchSnapshot()

    const smallNumberTree = renderer.create(
      <ScientificNotationNumber value={0.000000014159265359} />
    ).toJSON()
    expect(smallNumberTree).toMatchSnapshot()

  })
})
