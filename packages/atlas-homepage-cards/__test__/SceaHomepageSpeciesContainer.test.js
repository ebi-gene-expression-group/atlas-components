import React from 'react'
import Enzyme from 'enzyme'
import { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import { batmanFilmsSpeciesCardProps, findingNemoSpeciesCardProps } from './TestUtils'
import SpeciesCard from '../src/cards/SpeciesCard'

import SceaHomepageSpeciesContainer from '../src/containers/SceaHomepageSpeciesContainer'

Enzyme.configure({ adapter: new Adapter() })

describe(`SceaHomepageSpeciesContainer`, () => {
  const props = {
    cards: [ batmanFilmsSpeciesCardProps, findingNemoSpeciesCardProps ]
  }

  test(`renders species cards using Foundation’s block grid`, async () => {
    const wrapper = shallow(<SceaHomepageSpeciesContainer {...props} />)

    expect(wrapper.find(SpeciesCard)).toHaveLength(props.cards.length)
    expect(wrapper.find(`.row.small-up-2.medium-up-6`).exists()).toBe(true)
    expect(wrapper.find(`.column.column-block`)).toHaveLength(props.cards.length)
  })
})
