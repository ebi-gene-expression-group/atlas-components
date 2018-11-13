import React from 'react'
import renderer from 'react-test-renderer'
import Enzyme from 'enzyme'
import {shallow} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import ImageCard from '../src/ImageCard.js'

Enzyme.configure({ adapter: new Adapter() })

describe(`ImageCard`, () => {
  test(`with no data matches snapshot`, () => {
    const tree = renderer.create(<ImageCard iconSrc={``}/>).toJSON()
    expect(tree).toMatchSnapshot()
  })


  test(`does not render non-existent URLs`, () => {
    const wrapper = shallow(<ImageCard iconSrc={``}/>)

    expect(wrapper.find(`.image-icon`).exists()).toBe(true)
    expect(wrapper.find(`.image-description`).exists()).toBe(false)
    expect(wrapper.find(`.content`).exists()).toBe(false)
  })

  test(`does not render non-existent descriptions`, () => {
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
    const speciesName = `Mus musculus`

    const wrapper = shallow(<ImageCard iconSrc={speciesName} content={content} description={speciesName}/>)
    expect(wrapper.find(`.image-description`).exists()).toBe(false)

    const contentWrapper = wrapper.find(`.content`)
    expect(contentWrapper.exists()).toBe(true)
    expect(contentWrapper.find(`.content .text`)).toHaveLength(3)
    expect(contentWrapper.find(`.content .url`).exists()).toBe(false)
  })

  test(`renders URLs`, () => {
    const content = [
      {
        text: `120 experiments`,
        url: `http://example.com/experiments`
      }
    ]

    const wrapper = shallow(<ImageCard iconSrc={``} content={content}/>)
    const urlsWrapper = wrapper.find(`.content .url`)

    expect(urlsWrapper).toHaveLength(1)
  })

  test(`displays upto five experiments be default`, () => {
    const content = [
      {
        text: `1 experiments`
      },
      {
        text: `2 baseline experiment`
      },
      {
        text: `3 differential experiments`
      },
      {
        text: `4 differential experiments`
      },
      {
        text: `5 differential experiments`
      },
      {
        text: `6 differential experiments`
      }
    ]
    const speciesName = `Mus musculus`

    const wrapper = shallow(<ImageCard iconSrc={speciesName} content={content} description={speciesName}/>)
    expect(wrapper.find(`.content .text`)).toHaveLength(5)
    wrapper.setState({ isHidden: false })
    wrapper.update()
    expect(wrapper.find(`.content .text`)).toHaveLength(content.length)
  })
})