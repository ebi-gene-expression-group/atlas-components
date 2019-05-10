import React from 'react'
import { shallow } from 'enzyme'
import { data } from './TestUtils'
import TableSearchHeader from '../src/TableSearchHeader'

describe(`TableSearchHeader`, () => {
  const props = {
    kingdomOptions: [`hello`, `bonjour`],
    entriesPerPageOptions: [1, 4, 5, 100],
    aaData: data,
    searchAllOnChange: () => {},
    numberOfEntriesPerPageOnChange: () => {},
    kingdomOnChange: () => {},
    totalNumberOfRows: 2
  }

  test(`should render two dropdown menues and a search box`, () => {
    const wrapper = shallow(<TableSearchHeader {...props}/>)
    expect(wrapper.find(`select`)).toHaveLength(2)
    expect(wrapper.find(`input`)).toHaveLength(1)
  })

})
