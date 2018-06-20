import React from 'react'
import renderer from 'react-test-renderer'
import Enzyme from 'enzyme'
import {mount} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import {getRandomInt, episodes} from './TestUtils'

import FilterSidebar from '../src/FilterSidebar'
import CheckboxFacetGroup from '../src/facetgroups/CheckboxFacetGroup'
import MultiselectDropdownFacetGroup from '../src/facetgroups/MultiselectDropdownFacetGroup'

Enzyme.configure({ adapter: new Adapter() })

describe(`FilterSidebar`, () => {
  const allFacets = episodes.reduce((acc, episode) => acc.concat(episode.facets), [])
  const uniqueFacets =
    allFacets
      .filter((facet, index) => allFacets.findIndex((thatFacet) => facet.value === thatFacet.value) === index)
      .map((facet) => ({
        ...facet,
        disabled: false
      }))

  const props = {
    facets: uniqueFacets,
    checkboxFacetGroups: [`Season`],
    onChange: () => {}
  }

  test(`shows checkbox facet groups above dropdown filters`, () => {
    const groups = [...new Set(uniqueFacets.map((facet) => facet.group))]
    const randomCheckboxFacetGroup = groups[getRandomInt(0, groups.length)]
    const wrapper = mount(<FilterSidebar {...props} checkboxFacetGroups={[randomCheckboxFacetGroup]} />)
    expect(wrapper.find(`h4`).first().text()).toEqual(randomCheckboxFacetGroup)
    expect(wrapper.find(`h4`).last().text()).not.toEqual(randomCheckboxFacetGroup)
  }),

  test(`matches snapshot`, () => {
    const tree = renderer.create(<FilterSidebar {...props}/>).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
