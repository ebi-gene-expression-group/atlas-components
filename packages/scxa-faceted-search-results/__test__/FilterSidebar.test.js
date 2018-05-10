import React from 'react'
import renderer from 'react-test-renderer'
import Enzyme from 'enzyme'
import {mount} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import {getRandomInt, vindicators} from './TestUtils'

import FilterSidebar from '../src/FilterSidebar'

Enzyme.configure({ adapter: new Adapter() })

describe(`FilterSidebar`, () => {
  const props = {
    asCheckboxes: [`Status`],
    facetGroups: [
      {
        facetName: `Vindicators`,
        facetItems: vindicators
      },
      {
        facetName: `Status`,
        facetItems: [{value: `deceased`, label: `Deceased`}]
      }
    ],
    onChange: () => {}
  }

  test(`Checkbox filters are shown above dropdown filters`, () => {
    const wrapper = mount(<FilterSidebar {...props} asCheckboxes={[`Status`]}/>)
    expect(wrapper.find(`h4`).first().text()).toEqual(`Status`)
    expect(wrapper.find(`h4`).last().text()).toEqual(`Vindicators`)
  }),

  test(`matches snapshot`, () => {
    const tree = renderer.create(<FilterSidebar {...props}/>).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
