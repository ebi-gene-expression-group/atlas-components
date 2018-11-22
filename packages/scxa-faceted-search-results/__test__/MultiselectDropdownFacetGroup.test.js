import React from 'react'
import renderer from 'react-test-renderer'
import Enzyme from 'enzyme'
import { mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import _ from 'lodash'

import { getRandomInt, episodes } from './TestUtils'

import MultiselectDropdownFacetGroup from '../src/facetgroups/MultiselectDropdownFacetGroup'

Enzyme.configure({ adapter: new Adapter() })

describe(`MultiselectDropdownFacetGroup`, () => {
  const allFacets = episodes.reduce((acc, episode) => acc.concat(episode.facets), [])
  const uniqueFacets =
    allFacets
      .filter((facet, index) => allFacets.findIndex((thatFacet) => facet.value === thatFacet.value) === index)
      .map((facet) => ({
        ...facet,
        disabled: false
      }))

  const facetTooltip = _.shuffle(uniqueFacets).find(facet => facet.description)
  const facetWithoutTooltip = _.shuffle(uniqueFacets).find(facet => !facet.description)

  const propsWithTooltip = {
    facetGroupName: facetTooltip.group,
    facetGroupNameDescription: facetTooltip.description,
    facets: uniqueFacets.filter(facet => facet.group === facetTooltip.group),
    onChange: () => {}
  }

  const propsWithoutTooltip = {
    facetGroupName: facetWithoutTooltip.group,
    facets: uniqueFacets.filter(facet => facet.group === facetWithoutTooltip.group),
    onChange: () => {}
  }

  test(`displays tooltip if it exists`, () => {
    const groups = [...new Set(uniqueFacets.map((facet) => facet.group))]
    const descriptions = [...new Set(uniqueFacets.map((facet) => facet.description))]
    const randomMultiselectFacetGroup = groups[getRandomInt(0, groups.length)]
    const randomMultiselectFacetGroupDescription = descriptions[getRandomInt(0, descriptions.length)]

    const wrapper = mount(<MultiselectDropdownFacetGroup {...propsWithTooltip} />)
    expect(wrapper.find(`sup`).first().html()).toEqual(expect.stringMatching(`data-tip`))
  })

  test(`doesn’t display tooltip if not present`, () => {
    const wrapper = mount(<MultiselectDropdownFacetGroup {...propsWithoutTooltip} />)
    expect(wrapper.find(`sup`).exists()).toEqual(false)
  })

  test(`matches snapshot`, () => {
    const tree =
      renderer
        .create(
          <MultiselectDropdownFacetGroup
            facetGroupName = {uniqueFacets[0].group}
            facetGroupNameDescription = {uniqueFacets[0].description}
            facets = {uniqueFacets.filter(facet => facet.group === uniqueFacets[0].group)}
            onChange = {() => {}} />)
        .toJSON()
    expect(tree).toMatchSnapshot()
  })
})
