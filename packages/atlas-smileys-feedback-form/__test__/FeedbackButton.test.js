import React from 'react'
import renderer from 'react-test-renderer'
import Enzyme from 'enzyme'
import {shallow, mount} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import Prompt from '../src/Prompt'
import FeedbackButton from '../src/FeedbackButton.js'

jest.mock("react-ga")

Enzyme.configure({ adapter: new Adapter() })

describe(`FeedbackButton`, () => {
  test(`should render a feedback button`, () => {
    expect(shallow(<FeedbackButton />).find(`button`)).toHaveLength(1)
  })

  test(`should popup a feedback form by clicking a button`, () => {
    const wrapper = mount(<FeedbackButton />)
    expect(wrapper.find(Prompt)).toHaveLength(0)
    wrapper.find(`button`).simulate('click')
    expect(wrapper.find(Prompt)).toHaveLength(1)
  })

  test(`matches snapshot`, () => {
    const tree = renderer.create(<FeedbackButton />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
