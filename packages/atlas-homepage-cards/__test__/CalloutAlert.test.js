import React from 'react'
import Enzyme from 'enzyme'
import renderer from 'react-test-renderer'
import { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import fetchMock from 'fetch-mock'

import CalloutAlert from '../src/containers/CalloutAlert'

Enzyme.configure({ adapter: new Adapter() })

describe(`CalloutAlert`, () => {
  const props = {
    error: {
      description: `A human-readable description of the error, hopefully useful to the user`,
      name: `Error name`,
      message: `Error message`
    }
  }

  it(`prints all the relevant error information`, () => {
    const wrapper = shallow(<CalloutAlert {...props} />)
    expect(wrapper.text()).toMatch(props.error.description)
    expect(wrapper.text()).toMatch(props.error.name)
    expect(wrapper.text()).toMatch(props.error.message)
  })

  it(`matches snapshot`, () => {
    const tree = renderer.create(<CalloutAlert {...props} />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
