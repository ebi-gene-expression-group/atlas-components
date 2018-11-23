import React from 'react'
import renderer from 'react-test-renderer'
import Enzyme from 'enzyme'
import { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import SearchExamples from '../src/SearchExamples'

import searchExamples from './utils/searchExamples'

Enzyme.configure({ adapter: new Adapter() })

const props = {
  links: searchExamples.filter(() => Math.random() > 0.5)
}

describe(`SearchExamples`, () => {
  test(`renders one link per element`, () => {
    const wrapper = shallow(<SearchExamples {...props} />)
    expect(wrapper.find(`a`)).toHaveLength(props.links.length)
  })

  test(`matches snapshot`, () => {
    const tree =
      renderer
        .create(<SearchExamples links={searchExamples} />)
        .toJSON()
    expect(tree).toMatchSnapshot()
  })
})
