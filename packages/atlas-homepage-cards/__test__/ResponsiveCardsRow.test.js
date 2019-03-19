import { mount } from 'enzyme'

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
      ]
  }

  test(`matches snapshot`, () => {
    expect(mount(<ResponsiveCardsRow {...props}/>)).toMatchSnapshot()
  })
})
