import React from 'react'
import Enzyme from 'enzyme'
import { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import {
  aRickleInTimeImageCardProps, theSmithHouseholdImageCardProps,
  batmanFilmsSpeciesCardProps, findingNemoSpeciesCardProps
} from './TestUtils'
import ExtendableCard from '../src/cards/ExtendableCard'

import HcaLandingPageContainer from '../src/containers/HcaLandingPageContainer'

Enzyme.configure({ adapter: new Adapter() })

describe(`HcaLandingPageContainer`, () => {
  const props = {
    cards: [
      aRickleInTimeImageCardProps,
      theSmithHouseholdImageCardProps,
      batmanFilmsSpeciesCardProps,
      findingNemoSpeciesCardProps
    ]
  }

  test(`renders species cards using Foundation’s centered grid`, () => {
    const wrapper = shallow(<HcaLandingPageContainer {...props} />)

    expect(wrapper.find(ExtendableCard)).toHaveLength(props.cards.length)
    expect(wrapper.find(`.row`).exists()).toBe(true)
    expect(wrapper.find(`.small-centered`)).toHaveLength(Math.ceil(props.cards.length / 3))
  })
})
