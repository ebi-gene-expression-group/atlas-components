import React from 'react'
import { shallow } from 'enzyme'

import Anatomogram from '../src/Anatomogram'

describe(`Anatomogram`, () => {

  test(`should render for a supported species`, () => {
    expect(shallow(<Anatomogram
      idsWithMarkup={[]}
      onClick={jest.fn()}
      onMouseOut={jest.fn()}
      onMouseOver={jest.fn()}
      parentView={`parent`}
      species={`mus_musculus`}
      initShowIds={() => {}}
      clearSelectIds={() => {}}
    />)).toMatchSnapshot()
  })

  test(`should not render for an unsupported species`, () => {
    expect(shallow(<Anatomogram species={`ovis_aries`}
      initShowIds={() => {}} clearSelectIds={() => {}}/>).children()).toHaveLength(0)
  })

})
