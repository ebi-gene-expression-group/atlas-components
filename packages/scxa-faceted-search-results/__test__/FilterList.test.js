import React from 'react'
import renderer from 'react-test-renderer'
import Enzyme from 'enzyme'
import { mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { episodes, ExperimentTableHeader, ExperimentTableCard } from './TestUtils'

import FilterList from '../src/FilterList'

Enzyme.configure({ adapter: new Adapter() })

const props = {
  filteredResults: episodes,
  ResultsHeaderClass: ExperimentTableHeader,
  ResultElementClass: ExperimentTableCard
}

describe(`FilterList`, () => {
  test(`renders a table header and as many components of ResultElementClass as filtered results`, () => {
    const wrapper = mount(<FilterList {...props} />)
    expect(wrapper.find(ExperimentTableHeader)).toHaveLength(1)
    expect(wrapper.find(ExperimentTableCard)).toHaveLength(episodes.length)
  })

  test(`sorts table contents by clicking/toggling on headers`, () => {
    const wrapper = mount(<FilterList {...props} />)
    const sortOrder = wrapper.state(`ascending`)
    wrapper.find(`IconDiv`).simulate(`click`)
	  expect(wrapper.state(`ascending`)).toBe(!sortOrder)
	  wrapper.find(`IconDiv`).simulate(`click`)
	  expect(wrapper.state(`ascending`)).toBe(sortOrder)
  })

  test(`matches snapshot`, () => {
    const tree = renderer.create(<FilterList {...props} />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
