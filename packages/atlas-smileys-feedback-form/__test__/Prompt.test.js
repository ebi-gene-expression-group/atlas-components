import React from 'react'
import renderer from 'react-test-renderer'
import Enzyme from 'enzyme'
import {shallow, mount, render} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import Prompt from '../src/Prompt'
import { Emoji } from 'emoji-mart'

Enzyme.configure({ adapter: new Adapter() })


describe(`Prompt`, () => {

  test(`should render 5 smiley faces and 1 input text box`, () => {
    expect(shallow(<Prompt />).find(Emoji)).toHaveLength(5)
    expect(shallow(<Prompt />).find(`input`)).toHaveLength(1)
  })

  test(`should display a feedback scale when click smiley faces`, () => {
    const wrapper = mount(<Prompt onSelect={()=>{}} />)
    expect(wrapper.find(`#scale`).text()).toBe(`empty`)

    wrapper.find(Emoji).first().simulate(`click`)
    expect(wrapper.find(`#scale`).text()).toBe(`Terrible`)
  })

  test(`matches snapshot`, () => {
    const tree = renderer.create(<Prompt />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
