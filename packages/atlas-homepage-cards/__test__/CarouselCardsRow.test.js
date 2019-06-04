import { shallow } from 'enzyme'
import Slider from 'react-slick'

import {
  aRickleInTimeImageCardProps, findingNemoSpeciesCardProps,     // URL in title, no URLs in content
  theSmithHouseholdImageCardProps, batmanFilmsSpeciesCardProps  // URLs in content, no URL in title
} from './TestUtils'

import CarouselCardsRow from '../src/carousel/CarouselCardsRow'

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
    const sliderSettings = {slidesToShow: props.cards.length - 1}

    const wrapper = shallow(<CarouselCardsRow {...props} sliderSettings={sliderSettings}/>)
    expect(wrapper).toContainExactlyOneMatchingElement(Slider)
  })

  test(`displays cards in slider mode if the number of cards is larger than slides`, () => {
    const sliderSettings = {slidesToShow: props.cards.length + 1}

    const wrapper = shallow(<CarouselCardsRow {...props} sliderSettings={sliderSettings}/>)
    expect(wrapper).not.toContainMatchingElement(Slider)
  })

  test(`displays all cards`, () => {
    const sliderSettings = {slidesToShow: props.cards.length + 1}

    expect(shallow(<CarouselCardsRow {...props} sliderSettings={sliderSettings}/>)).toContainMatchingElements(props.cards.length, props.CardClass);
  })

  test(`matches snapshot with displaying a part of cards in the slider`, () => {
    const sliderSettings = {slidesToShow: props.cards.length - 1}

    expect(shallow(<CarouselCardsRow {...props} sliderSettings={sliderSettings}/>)).toMatchSnapshot()
  })

  test(`matches snapshot with displaying all cards in the slider`, () => {
    const sliderSettings = {slidesToShow: props.cards.length + 1}

    expect(shallow(<CarouselCardsRow {...props} sliderSettings={sliderSettings}/>)).toMatchSnapshot()
  })
})
