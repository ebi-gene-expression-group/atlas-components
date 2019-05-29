import { shallow, mount } from 'enzyme'
import Slide from 'react-slick'

import {
  aRickleInTimeImageCardProps, findingNemoSpeciesCardProps,     // URL in title, no URLs in content
  theSmithHouseholdImageCardProps, batmanFilmsSpeciesCardProps  // URLs in content, no URL in title
} from './TestUtils'

import ResponsiveCardsRow from '../src/ResponsiveCardsRow'

describe(`ResponsiveCardsRow`, () => {
  const props = {
    cards:
      [
        aRickleInTimeImageCardProps,
        batmanFilmsSpeciesCardProps,
        findingNemoSpeciesCardProps,
        theSmithHouseholdImageCardProps
      ],
    CardClass: () => `topClass`
  }

  test(`displays all cards`, () => {
    expect(shallow(<ResponsiveCardsRow {...props}/>).find(props.CardClass)).toHaveLength(props.cards.length)
  })

  test(`matches snapshot`, () => {
    expect(mount(<ResponsiveCardsRow {...props}/>)).toMatchSnapshot()
  })
})
