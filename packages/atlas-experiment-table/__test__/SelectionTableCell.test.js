import React from 'react'
import { shallow, mount } from 'enzyme'

import { Table, Checkbox } from 'evergreen-ui'

import SelectionTableCell from '../src/SelectionTableCell'

import randomString from 'random-string'

describe(`SelectionTableCell`, () => {
  const props = {
    dataRow: {
      string: randomString()
    },
    dataKey: `string`,
    selectedRowIds: [],
    selectOnChange: jest.fn(),
  }

  test(`renders a table cell with a checkbox`, () => {
    const wrapper = shallow(<SelectionTableCell {...props}/>)

    expect(wrapper.find(Table.Cell).find(Checkbox)).toHaveLength(1)
  })

  test(`displays an unchecked checkbox if the current row is not in the array of selected rows`, () => {
    const wrapper = shallow(<SelectionTableCell {...props} selectedRowIds={[randomString()]}/>)

    expect(wrapper.find(Checkbox)).toHaveProp({checked: false})
  })

  test(`displays a checked checkbox if the current row is in the array of selected rows`, () => {
    const wrapper = shallow(<SelectionTableCell {...props} selectedRowIds={[props.dataRow[props.dataKey]]}/>)

    expect(wrapper.find(Checkbox)).toHaveProp({checked: true})
  })

  test(`calls selectOnChange with the keyed value from dataRow as argument when the checkbox is (de)selected`, () => {
    const wrapper = shallow(<SelectionTableCell {...props}/>)
    wrapper.find(Checkbox).simulate(`change`)

    expect(props.selectOnChange).toHaveBeenCalled()
    expect(props.selectOnChange.mock.calls).toContainEqual([props.dataRow[props.dataKey]])
  })

  test(`matches snapshot (unchecked)`, () => {
    const props = {
      dataRow: {
        string: `foobar`
      },
      dataKey: `string`,
      selectedRowIds: [],
      selectOnChange: jest.fn(),
    }
    const wrapper = mount(<SelectionTableCell {...props}/>)
    expect(wrapper).toMatchSnapshot()
  })

  test(`matches snapshot (checked)`, () => {
    const props = {
      dataRow: {
        string: `foobar`
      },
      dataKey: `string`,
      selectedRowIds: [`foobar`],
      selectOnChange: jest.fn(),
    }
    const wrapper = mount(<SelectionTableCell {...props}/>)
    expect(wrapper).toMatchSnapshot()
  })
})
