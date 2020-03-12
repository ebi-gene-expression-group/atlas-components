import React from 'react'
import renderer from 'react-test-renderer'
import { shallow } from 'enzyme'

import SearchExamples from '../src/SearchExamples'
import searchExamples from './utils/searchExamples'

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
