import React from 'react'
import renderer from 'react-test-renderer'
import Enzyme from 'enzyme'
import {mount} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import {getRandomInt, episodes, EpisodeCard} from './TestUtils'

import FilterList from '../src/FilterList'
import FilterSidebar from '../src/FilterSidebar'

Enzyme.configure({ adapter: new Adapter() })

const props = {
  results: episodes,
  checkboxFacetGroups: [`Season`],
  hideFacetGroupNames: [`Season`],
  ResultElementComponent: EpisodeCard
}

describe(`FilterList`, () => {
  test(`shows all results when no filters are set`, () => {
    const wrapper = mount(<FilterList {...props} />)
    expect(Object.keys(wrapper.state(`selectedFacets`))).toHaveLength(0)
    expect(wrapper.find(EpisodeCard)).toHaveLength(props.results.length)
  })

  test(`shows a subset of results which match the selected facet`, () => {
    const randomEpisode = props.results[getRandomInt(0, props.results.length)]
    const randomFacet = randomEpisode.facets[getRandomInt(0, randomEpisode.facets.length)]

    const wrapper = mount(<FilterList {...props} />)
    wrapper.setState({
      selectedFacets: {
        [randomFacet.group]: [randomFacet.value]
      }})
    wrapper.update()

    expect(wrapper.find(EpisodeCard).length).toBeLessThan(props.results.length)
    expect(wrapper.find(EpisodeCard).map(e => e.props())).toContainEqual(randomEpisode.element)
  })

  test(`when results have no facets only the results list is displayed`, () => {
    const wrapperWithFacets = mount(<FilterList {...props} />)
    expect(wrapperWithFacets.find(FilterSidebar)).toHaveLength(1)
    const wrapperWithoutFacets = mount(<FilterList {...props} results={props.results.map((result) => ({element: result.element}))}/>)
    expect(wrapperWithoutFacets.find(FilterSidebar)).toHaveLength(0)
  })

  test(`clicking on facets works`, () => {
    const wrapper = mount(<FilterList {...props} />)
    wrapper.find(FilterSidebar).find({ type: `checkbox` }).first(0).simulate(`change`)
    expect(wrapper.find(EpisodeCard).length).toBeLessThan(props.results.length)
  })

  test(`matches snapshot`, () => {
    const tree = renderer.create(<FilterList {...props} />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
