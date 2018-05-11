import React from 'react'
import renderer from 'react-test-renderer'
import Enzyme from 'enzyme'
import {mount} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import {getRandomInt, vindicators} from './TestUtils'

import FilterSidebar from '../src/FilterSidebar'
import CheckboxFacetGroup from '../src/facetgroups/CheckboxFacetGroup'
import MultiselectDropdownFacetGroup from '../src/facetgroups/MultiselectDropdownFacetGroup'

Enzyme.configure({ adapter: new Adapter() })

describe(`FilterSidebar`, () => {
  const props = {
    facets: [
      ...vindicators,
      {
        group: `Status`,
        value: `deceased`,
        label: `Deceased`
      }
    ],
    checkboxFacetGroups: [`Status`],
    onChange: () => {}
  }

  test(`Checkbox filters are shown above dropdown filters`, () => {
    const wrapper = mount(<FilterSidebar {...props} />)
    expect(wrapper.find(`h4`).first().text()).toEqual(`Status`)
    expect(wrapper.find(`h4`).last().text()).toEqual(vindicators[getRandomInt(0, vindicators.length)].group)
  }),

  test(`doesn’t display duplicates`, () => {
    const dupedFacets = [...vindicators, ...vindicators, props.facets[props.facets.length - 1], props.facets[props.facets.length - 1]]
    const wrapper = mount(<FilterSidebar {...props} facets={dupedFacets} />)
    expect(wrapper.props().facets).toHaveLength(vindicators.length * 2 + 2)
    expect(wrapper.find(CheckboxFacetGroup).props().facets).toHaveLength(1)
    expect(wrapper.find(MultiselectDropdownFacetGroup).props().facets).toHaveLength(vindicators.length)
  })

  test(`matches snapshot`, () => {
    const tree = renderer.create(<FilterSidebar {...props}/>).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
