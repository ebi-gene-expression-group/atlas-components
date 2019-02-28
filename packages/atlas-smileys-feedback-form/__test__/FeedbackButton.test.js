import React from 'react'
import renderer from 'react-test-renderer'
import Enzyme from 'enzyme'
import {mount} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import Prompt from '../src/Prompt'
import FeedbackButton from '../src/FeedbackButton'

Enzyme.configure({ adapter: new Adapter() })

jest.mock(`react-ga`)

describe(`FeedbackButton`, () => {
  const props = {
    feedbackFormLink:
      Math.random() > 0.5 ? `https://www.ebi.ac.uk/support/gxa` : `https://www.ebi.ac.uk/support/gxasc`,
    gaId: `foobar`
  }

  test(`should render a side feedback button`, () => {
    expect(mount(<FeedbackButton {...props}/>).find(`button`)).toHaveLength(1)
  })

  test(`should display a a feedback form by clicking the button`, () => {
    const wrapper = mount(<FeedbackButton {...props}/>)
    expect(wrapper.find(Prompt)).toHaveLength(0)
    wrapper.find(`button`).simulate(`click`)
    expect(wrapper.find(Prompt)).toHaveLength(1)
  })

  test(`matches snapshot`, () => {
    const tree = renderer.create(
      <FeedbackButton
        feedbackFormLink={`https://www.ebi.ac.uk/support/gxasc`}
        gaId={`foobar`}/>).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
