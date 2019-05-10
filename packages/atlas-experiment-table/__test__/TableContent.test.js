import React from 'react'
import {shallow} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { data } from './TestUtils'

import TableContent from '../src/TableContent'
import { Table } from 'evergreen-ui'

describe(`TableContent`, () => {
  const props = {
    enableIndex: true,
    tableHeader: [{
      type: `search`,
      title: `title1`,
      width: 12,
      dataParam: `hello`
    },
    {
      type: `search`,
      title: `title2`,
      width: 3,
      dataParam: `hi`
    }],
    searchedColumnIndex: 2,
    searchQuery: `search`,
    orderedColumnIndex: 1,
    ascendingOrder: true,
    enableDownload: true,
    checkedRows: [1, 2],
    currentPageData: data,
    host: `boo`,
    entriesPerPage: 2,
    currentPage: 1,
    tableHeaderOnClick: () => {},
    tableHeaderOnChange: () => {},
    downloadOnChange: () => {}
  }

  test(`should render a previous button, a next button and information text`, () => {
    const wrapper = shallow(<TableContent {...props}/>)
    expect(wrapper).toContainExactlyOneMatchingElement(Table)
    expect(wrapper).toContainExactlyOneMatchingElement(Table.Head)
    expect(wrapper).toContainExactlyOneMatchingElement(Table.Body)
  })

  test(`should show/hide download based on props`, () => {
    const wrapper = shallow(<TableContent {...props} enableDownload={true}/>)
    expect(wrapper).toContainExactlyOneMatchingElement(`.downloadHeader`)

    const wrapperNoDownload= shallow(<TableContent {...props} enableDownload={false}/>)
    expect(wrapperNoDownload.find(`.downloadHeader`)).not.toExist()
  })
})
