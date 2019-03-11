import renderer from 'react-test-renderer'
import { shallow } from 'enzyme'

import CalloutAlert from '../src/CalloutAlert'

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
    expect(wrapper).toIncludeText(props.error.description)
    expect(wrapper).toIncludeText(props.error.name)
    expect(wrapper).toIncludeText(props.error.message)
  })

  it(`matches snapshot`, () => {
    const tree = renderer.create(<CalloutAlert {...props} />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
