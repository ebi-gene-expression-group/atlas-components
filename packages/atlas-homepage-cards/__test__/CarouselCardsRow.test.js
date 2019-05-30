import { shallow, mount } from 'enzyme'
import Slide from 'react-slick'

import {
  aRickleInTimeImageCardProps, findingNemoSpeciesCardProps,     // URL in title, no URLs in content
  theSmithHouseholdImageCardProps, batmanFilmsSpeciesCardProps  // URLs in content, no URL in title
} from './TestUtils'

import CarouselCardsRow from '../src/CarouselCardsRow'

describe(`CarousleCardsRow`, () => {
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

  test(`displays cards in slider mode if the number of cards is smaller than slides`, () => {
    const slideSettings = {slidesToShow: props.cards.length - 1}

    const wrapper = shallow(<CarouselCardsRow {...props} slideSettings={slideSettings}/>)
    expect(wrapper).toContainExactlyOneMatchingElement(Slide)
  })

  test(`displays cards in slider mode if the number of cards is larger than slides`, () => {
    const slideSettings = {slidesToShow: props.cards.length + 1}

    const wrapper = shallow(<CarouselCardsRow {...props} slideSettings={slideSettings}/>)
    expect(wrapper).not.toContainMatchingElement(Slide)
  })

  test(`displays all cards`, () => {
    expect(shallow(<CarouselCardsRow {...props}/>)).toContainMatchingElements(props.cards.length, props.CardClass);
  })

  test(`matches snapshot with displaying a part of cards in the slider`, () => {
    const slideSettings = {slidesToShow: props.cards.length - 1}

    expect(shallow(<CarouselCardsRow {...props} slideSettings={slideSettings}/>)).toMatchSnapshot()
  })

  test(`matches snapshot with displaying all cards in the slider`, () => {
    const slideSettings = {slidesToShow: props.cards.length + 1}

    expect(shallow(<CarouselCardsRow {...props} slideSettings={slideSettings}/>)).toMatchSnapshot()
  })
})
