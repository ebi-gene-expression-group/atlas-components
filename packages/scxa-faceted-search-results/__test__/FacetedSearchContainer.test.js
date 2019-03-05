import React from 'react'
import renderer from 'react-test-renderer'
import Enzyme from 'enzyme'
import { mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import {episodes, ExperimentTableHeader, ExperimentTableCard} from './TestUtils'

import FacetedSearchContainer from '../src/FacetedSearchContainer'
import FilterSidebar from '../src/FilterSidebar'
import CheckboxFacetGroup from '../src/facetgroups/CheckboxFacetGroup'
import MultiselectDropdownFacetGroup from '../src/facetgroups/MultiselectDropdownFacetGroup'

Enzyme.configure({ adapter: new Adapter() })

const props = {
  results: episodes,
  checkboxFacetGroups: [`Season`],
  ResultsHeaderClass: ExperimentTableHeader,
  ResultElementClass: ExperimentTableCard
}

describe(`FacetedSearchContainer`, () => {
  test(`when results have no facets only the results list is displayed`, () => {
    const wrapperWithFacets = mount(<FacetedSearchContainer {...props} />)
    expect(wrapperWithFacets.find(FilterSidebar)).toHaveLength(1)
    const wrapperWithoutFacets = mount(<FacetedSearchContainer {...props} results={props.results.map((result) => ({element: result.element}))}/>)
    expect(wrapperWithoutFacets.find(FilterSidebar)).toHaveLength(0)
  })

  test(`clicking to select/unselect a single facet in a group works`, () => {
    const wrapper = mount(<FacetedSearchContainer {...props} />)
    wrapper.find(FilterSidebar).find({ type: `checkbox` }).first().simulate(`change`)
    expect(wrapper.find(ExperimentTableCard).length).toBeLessThan(props.results.length)
    wrapper.find(FilterSidebar).find({ type: `checkbox` }).first().simulate(`change`)
    expect(wrapper.find(ExperimentTableCard).length).toBe(props.results.length)
  })

  test(`clicking on a second facet works`, () => {
    const wrapper = mount(<FacetedSearchContainer {...props} />)
    wrapper.find(FilterSidebar).find({ type: `checkbox` }).first().simulate(`change`)
    const numberOfResultsAfterFirstClick = wrapper.find(ExperimentTableCard).length
    wrapper.find(FilterSidebar).find({ type: `checkbox` }).at(1).simulate(`change`)
    expect(wrapper.find(ExperimentTableCard).length).toBeGreaterThan(numberOfResultsAfterFirstClick)
  })

  test(`doesn’t display duplicated facets`, () => {
    const allFacets = episodes.reduce((acc, episode) => acc.concat(episode.facets), [])
    const uniqueFacetsByGroup =
      allFacets
        .filter((facet, index) => allFacets.findIndex((thatFacet) => facet.value === thatFacet.value) === index)
        .reduce((acc, facet) => {
          acc[facet.group] = (acc[facet.group] || []).concat(facet.value)
          return acc
        }, {})

    const wrapper = mount(<FacetedSearchContainer {...props} />)

    wrapper.find(CheckboxFacetGroup).forEach(
      (facetGroup) =>
        expect(facetGroup.props().facets).toHaveLength(uniqueFacetsByGroup[facetGroup.props().facetGroupName].length))

    wrapper.find(MultiselectDropdownFacetGroup).forEach(
      (facetGroup) =>
        expect(facetGroup.props().facets).toHaveLength(uniqueFacetsByGroup[facetGroup.props().facetGroupName].length))
  })

  test(`matches snapshot`, () => {
    const tree = renderer.create(<FacetedSearchContainer {...props} />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
