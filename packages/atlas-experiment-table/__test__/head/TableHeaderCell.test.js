import React from 'react'
import { shallow, mount } from 'enzyme'
import TableHeaderCell from '../../src/head/TableHeaderCell'

import { Table, Heading, SearchInput, Icon } from 'evergreen-ui'

import { getRandomInt } from '../TestUtils'
import randomString from 'random-string'

describe(`TableHeaderCell`, () => {
  const MAX_NUMBER_OF_COLUMNS = 10

  test(`displays a table header cell with only a label if only the required props are passed`, () => {
    const props = {
      label: randomString(),
      dataKey: randomString()
    }
    const wrapper = shallow(<TableHeaderCell {...props}/>)

    expect(wrapper.find(SearchInput)).toHaveLength(0)
    expect(wrapper.find(Icon)).toHaveLength(0)

    expect(wrapper.find(Table.HeaderCell)).toHaveLength(1)
    expect(wrapper.find(Heading)).toHaveLength(1)

    expect(wrapper.find(Heading)).toHaveProp(`children`, props.label)
  })

  test(`displays a text input if it’s searchable`, () => {
    const props = {
      label: randomString(),
      dataKey: randomString(),
      searchable: true
    }
    const wrapper = shallow(<TableHeaderCell {...props}/>)

    expect(wrapper.find(Icon)).toHaveLength(0)

    expect(wrapper.find(SearchInput)).toHaveLength(1)
    expect(wrapper.find(SearchInput)).toHaveProp(`placeholder`, props.label)
  })

  test(`can have an initial value if it’s searchable`, () => {
    const props = {
      label: randomString(),
      dataKey: randomString(),
      searchable: true,
      value: randomString()
    }
    const wrapper = shallow(<TableHeaderCell {...props}/>)

    expect(wrapper.find(SearchInput)).toHaveProp(`value`, props.value)
  })

  test(`displays a sort icon if it is marked as sortable`, () => {
    const props = {
      label: randomString(),
      dataKey: randomString(),
      sortable: true
    }
    const wrapper = shallow(<TableHeaderCell {...props}/>)

    expect(wrapper.find(SearchInput)).toHaveLength(0)

    expect(wrapper.find(Icon)).toHaveLength(1)
    expect(wrapper.find(Heading)).toHaveLength(1)

    expect(wrapper.find(Heading)).toHaveProp(`children`, props.label)
  })

  test(`calls onChange if the search input is changed`, () => {
    const props = {
      label: randomString(),
      dataKey: randomString(),
      searchable: true,
      onChange: jest.fn()
    }
    const event = { target: { value: randomString() } }
    const wrapper = shallow(<TableHeaderCell {...props}/>)
    wrapper.find(SearchInput).simulate(`change`, event)

    expect(props.onChange).toHaveBeenCalled()
    expect(props.onChange.mock.calls).toContainEqual([props.dataKey, event.target.value])
  })

  test(`displays an ascending/descending sort icon if this header cell dictates the sort order`, () => {
    const randomColumnIndex = getRandomInt(0, MAX_NUMBER_OF_COLUMNS)
    const props = {
      label: randomString(),
      dataKey: randomString(),
      sortable: true,
      onClick: jest.fn(),
      columnIndex: randomColumnIndex,
      sortColumnIndex: randomColumnIndex,
      ascendingOrder: Math.random() < 0.5
    }
    const wrapper = shallow(<TableHeaderCell {...props}/>)

    expect(wrapper.find(Icon)).toHaveProp(`icon`, props.ascendingOrder ? `sort-asc` : `sort-desc`)
  })

  test(`calls onClick when the icon of a sortable header cell is clicked`, () => {
    const randomColumnIndex = getRandomInt(0, MAX_NUMBER_OF_COLUMNS)
    const props = {
      label: randomString(),
      dataKey: randomString(),
      searchable: Math.random() < 0.5,
      sortable: true,
      onClick: jest.fn(),
      columnIndex: randomColumnIndex,
      sortColumnIndex: randomColumnIndex + 1,
      ascendingOrder: Math.random() < 0.5
    }
    const wrapper = shallow(<TableHeaderCell {...props}/>)

    wrapper.find(Icon).simulate(`click`)
    expect(props.onClick).toHaveBeenCalled()
  })

  test(`calls onClick when the label of a non-searchable sortable header cell is clicked`, () => {
    const randomColumnIndex = getRandomInt(0, MAX_NUMBER_OF_COLUMNS)
    const props = {
      label: randomString(),
      dataKey: randomString(),
      sortable: true,
      onClick: jest.fn(),
      columnIndex: randomColumnIndex,
      sortColumnIndex: randomColumnIndex,
      ascendingOrder: Math.random() < 0.5
    }
    const wrapper = shallow(<TableHeaderCell {...props}/>)
    wrapper.find(Heading).simulate(`click`)

    expect(props.onClick).toHaveBeenCalled()
  })

  test(`doesn’t call onClick when the text input in a sortable header cell is clicked`, () => {
    const randomColumnIndex = getRandomInt(0, MAX_NUMBER_OF_COLUMNS)
    const props = {
      label: randomString(),
      dataKey: randomString(),
      searchable: true,
      sortable: true,
      onClick: jest.fn(),
      columnIndex: randomColumnIndex,
      sortColumnIndex: randomColumnIndex,
      ascendingOrder: Math.random() < 0.5
    }
    const wrapper = shallow(<TableHeaderCell {...props}/>)
    wrapper.find(SearchInput).simulate(`click`)

    expect(props.onClick).not.toHaveBeenCalled()
  })

  test(`matches snapshot (basic)`, () => {
    const props = {
      label: `Header cell label`,
      dataKey: `Data key field`
    }
    expect(mount(<TableHeaderCell {...props}/>)).toMatchSnapshot()
  })

  test(`matches snapshot (searchable)`, () => {
    const props = {
      label: `Header cell label`,
      dataKey: `Data key field`,
      searchable: true,
      value: ``,
      onChange: jest.fn()}
    expect(mount(<TableHeaderCell {...props}/>)).toMatchSnapshot()
  })

  test(`matches snapshot (sortable)`, () => {
    const props = {
      label: `Header cell label`,
      dataKey: `Data key field`,
      sortable: true,
      columnIndex: 0,
      sortColumnIndex: 0,
      ascendingOrder: true,
      onClick: jest.fn()
    }
    expect(mount(<TableHeaderCell {...props}/>)).toMatchSnapshot()
  })

  test(`matches snapshot (searchable and sortable)`, () => {
    const props = {
      label: `Header cell label`,
      dataKey: `Data key field`,
      searchable: true,
      value: ``,
      onChange: jest.fn(),
      sortable: true,
      columnIndex: 0,
      sortColumnIndex: 0,
      ascendingOrder: true,
      onClick: jest.fn()
    }
    expect(mount(<TableHeaderCell {...props}/>)).toMatchSnapshot()
  })
})
