import React from 'react'
import { shallow, mount } from 'enzyme'

import TablePreamble from '../src/TablePreamble'

import randomString from 'random-string'
import { getRandomInt } from './TestUtils'

describe(`TablePreamble`, () => {
  const MAX_ROW_COUNT = 1000
  const MAX_DROPDOWN_COUNT = 4
  const MAX_OPTIONS_COUNT = 10

  const props = {
    dropdowns: [],
    dropdownOnChange: jest.fn(),
    rowsCount: getRandomInt(100, MAX_ROW_COUNT),
    rowsPerPageOptions: [10, 25, 50],
    rowsPerPage: 10,
    rowsPerPageOnChange: jest.fn(),
    searchAll: randomString(),
    searchAllOnChange: jest.fn()
  }

  test(`displays, at the very least, a page size dropdown and a global search box`, () => {
    const wrapper = shallow(<TablePreamble {...props}/>)

    expect(wrapper.find(`select`)).toHaveLength(1)
    expect(wrapper.find(`input`)).toHaveLength(1)
  })

  test(`can have an initial value passed to the global search box`, () => {
    const wrapper = shallow(<TablePreamble {...props}/>)

    expect(wrapper.find(`input`)).toHaveProp(`value`, props.searchAll)
  })

  test(`calls searchAllOnChange when the global text box changes`, () => {
    const wrapper = shallow(<TablePreamble {...props}/>)

    const event = { target: { value: randomString() } }
    wrapper.find(`input`).simulate(`change`, event)

    expect(props.searchAllOnChange).toHaveBeenCalled()
    expect(props.searchAllOnChange.mock.calls).toContainEqual([event.target.value])
  })
})
