import React from 'react'
import renderer from 'react-test-renderer'
import Enzyme from 'enzyme'
import {shallow} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import EbiSpeciesIcon from 'react-ebi-species'

import SpeciesCard from '../src/SpeciesCard.js'

Enzyme.configure({ adapter: new Adapter() })

describe(`SpeciesCard`, () => {
  test(`with no data matches snapshot`, () => {
    const tree = renderer.create(<SpeciesCard iconSrc={``}/>).toJSON()
    expect(tree).toMatchSnapshot()
  })

  test(`does not render optional empty content`, () => {
    const wrapper = shallow(<SpeciesCard iconSrc={``} />)

    expect(wrapper.find(EbiSpeciesIcon).exists()).toBe(true)
    expect(wrapper.find(`.species-name`).exists()).toBe(false)
    expect(wrapper.find(`.content`).exists()).toBe(false)
  })

  test(`does not render non-existent URLs`, () => {
    const speciesName = `Mus musculus`
    const content = [
      {
        text: `120 experiments`
      },
      {
        text: `1 baseline experiment`
      },
      {
        text: `119 differential experiments`
      }
    ]

    const description = {
      text: speciesName
    }

    const wrapper = shallow(<SpeciesCard iconSrc={speciesName} content={content} description={description}/>)
    expect(wrapper.find(`.species-name`).exists()).toBe(true)
    expect(wrapper.find(`.species-name`).text()).toBe(speciesName)
    expect(wrapper.find(`.species-url`).exists()).toBe(false)

    const contentWrapper = wrapper.find(`.content`)

    expect(contentWrapper.exists()).toBe(true)
    expect(contentWrapper.find(`.content .text`)).toHaveLength(3)
    expect(contentWrapper.find(`.content .url`).exists()).toBe(false)
  })

  test(`renders URLs`, () => {
    const description = {
      text: `Mus musculus`,
      url: `http://foo.bar/species`
    }

    const content = [
      {
        text: `120 experiments`,
        url: `http://example.com/experiments`
      }
    ]

    const wrapper = shallow(<SpeciesCard iconSrc={``} content={content} description={description}/>)
    const urlsWrapper = wrapper.find(`.content .url`)

    expect(urlsWrapper).toHaveLength(1)
  })
})
