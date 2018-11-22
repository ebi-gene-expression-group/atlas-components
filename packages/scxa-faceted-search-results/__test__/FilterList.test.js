import React from 'react'
import renderer from 'react-test-renderer'
import Enzyme from 'enzyme'
import { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import { episodes, EpisodesHeader, EpisodeCard } from './TestUtils'

import FilterList from '../src/FilterList'

Enzyme.configure({ adapter: new Adapter() })

const props = {
  filteredResults: episodes,
  ResultsHeaderClass: EpisodesHeader,
  ResultElementClass: EpisodeCard
}

describe(`FilterList`, () => {
  test(`renders as many components of ResultElementClass as filtered results`, () => {
    const randomFilteredResults = episodes.filter(() => Math.random() > 0.5)
    const wrapper = shallow(<FilterList {...props} filteredResults={randomFilteredResults}/>)
    expect(wrapper.find(EpisodesHeader)).toHaveLength(1)
    expect(wrapper.find(EpisodeCard)).toHaveLength(randomFilteredResults.length)
  })

  test(`matches snapshot`, () => {
    const tree = renderer.create(<FilterList {...props} />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
