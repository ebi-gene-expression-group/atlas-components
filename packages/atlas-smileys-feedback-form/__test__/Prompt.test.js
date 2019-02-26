import React from 'react'
import renderer from 'react-test-renderer'
import Enzyme from 'enzyme'
import {shallow, mount} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import Prompt from '../src/Prompt'
import Emoji from '../src/Emoji'

Enzyme.configure({ adapter: new Adapter() })


describe(`Prompt`, () => {

  test(`should render 5 smiley faces and 1 link to EBI support`, () => {
    const wrapper = shallow(<Prompt feedbackFormLink={`linto`} onSelect={()=>{}} />)
    expect(wrapper.find(Emoji)).toHaveLength(5)
    expect(wrapper.find(`a`)).toHaveLength(1)
  })

  test(`should display a feedback scale when click smiley faces`, () => {
    const wrapper = mount(<Prompt feedbackFormLink={`linto`}  onSelect={()=>{}} />)
    expect(wrapper.find(`#scale`).text()).toBe(`empty`)

    wrapper.find(Emoji).first().simulate(`click`)
    expect(wrapper.find(`#scale`).text()).toBe(`Terrible`)
  })

  test(`matches snapshot`, () => {
    const tree = renderer.create(<Prompt feedbackFormLink={`linto`}  onSelect={()=>{}}/>).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
