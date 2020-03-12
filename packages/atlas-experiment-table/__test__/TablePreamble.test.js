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

    expect(wrapper).toContainExactlyOneMatchingElement(`select`)
    expect(wrapper).toContainExactlyOneMatchingElement(`input`)
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

  test(`adds an ‘All’ option to the page size dropdown if all options are smaller than the number of rows`, () => {
    const wrapper = shallow(<TablePreamble {...props}/>)

    expect(wrapper.find(`option`)).toHaveLength(props.rowsPerPageOptions.length + 1)
    expect(wrapper.find(`option`).last()).toHaveText(`All`)
    expect(wrapper.find(`option`).last()).toHaveProp(`value`, 0)
  })

  test(`calls rowsPerPageOnChange when the page size dropdown is changed`, () => {
    const wrapper = shallow(<TablePreamble {...props}/>)

    const event = { target: { value: props.rowsPerPageOptions[getRandomInt(0, props.rowsPerPageOptions.length)] } }
    wrapper.find(`select`).simulate(`change`, event)

    expect(props.rowsPerPageOnChange).toHaveBeenCalled()
    expect(props.rowsPerPageOnChange.mock.calls).toContainEqual([event.target.value])
  })

  test(`renders as many dropdowns as specified in the dropdowns prop`, () => {
    const dropdowns =
      // https://stackoverflow.com/questions/3751520/how-to-generate-sequence-of-numbers-chars-in-javascript
      Array.apply(0, Array(getRandomInt(1, MAX_DROPDOWN_COUNT)))
        .map(() => (
          {
            label: randomString(),
            dataKey: randomString(),
            options: []
          }
        ))

    const wrapper = shallow(<TablePreamble {...props} dropdowns={dropdowns}/>)

    expect(wrapper.find(`select`)).toHaveLength(dropdowns.length + 1)
  })

  test(`adds an ‘All’ option with an empty value to dropdowns`, () => {
    const options =
      // https://stackoverflow.com/questions/3751520/how-to-generate-sequence-of-numbers-chars-in-javascript
      Array.apply(0, Array(getRandomInt(1, MAX_OPTIONS_COUNT)))
        .map(() => randomString())

    const dropdowns = [
      {
        label: randomString(),
        dataKey: randomString(),
        options: options
      }
    ]

    const wrapper = shallow(<TablePreamble {...props} dropdowns={dropdowns}/>)

    expect(wrapper.find(`select`).first().find(`option`)).toHaveLength(options.length + 1)
    expect(wrapper.find(`select`).first().find(`option`).first()).toHaveText(`All`)
    expect(wrapper.find(`select`).first().find(`option`).first()).toHaveProp(`value`, ``)
  })

  test(`can fuzzily match the initial value in a dropdown filter if it isn’t an exact match of an option`, () => {
    const options =
      // https://stackoverflow.com/questions/3751520/how-to-generate-sequence-of-numbers-chars-in-javascript
      Array.apply(0, Array(getRandomInt(1, MAX_OPTIONS_COUNT)))
        .map(() => randomString().toUpperCase())

    const randomOptionIndex = getRandomInt(0, options.length)

    const dropdowns = [
      {
        label: randomString(),
        dataKey: randomString(),
        options: options,
        value: `  ` + options[randomOptionIndex].toLowerCase() + `\t   `
      }
    ]

    const wrapper = shallow(<TablePreamble {...props} dropdowns={dropdowns}/>)

    expect(wrapper.find(`select`).first().find(`option`)).toHaveLength(options.length + 1)
    expect(wrapper.find(`select`).first()).toHaveProp({value: options[randomOptionIndex]})
  })

  test(`defaults to ‘All’  if the initial value in a dropdown filter isn’t one of the options`, () => {
    const options =
      // https://stackoverflow.com/questions/3751520/how-to-generate-sequence-of-numbers-chars-in-javascript
      Array.apply(0, Array(getRandomInt(1, MAX_OPTIONS_COUNT)))
        .map(() => randomString())

    const dropdowns = [
      {
        label: randomString(),
        dataKey: randomString(),
        options: options,
        value: randomString()
      }
    ]

    const wrapper = shallow(<TablePreamble {...props} dropdowns={dropdowns}/>)

    expect(wrapper.find(`select`).first().find(`option`)).toHaveLength(options.length + 1)
    expect(wrapper.find(`select`).first()).toHaveProp({value: ``})
  })

  test(`renders as many dropdowns as specified in the dropdowns prop`, () => {
    const dropdowns =
      // https://stackoverflow.com/questions/3751520/how-to-generate-sequence-of-numbers-chars-in-javascript
      Array.apply(0, Array(getRandomInt(1, MAX_DROPDOWN_COUNT)))
        .map(() => (
          {
            label: randomString(),
            dataKey: randomString(),
            options: []
          }
        ))

    const wrapper = shallow(<TablePreamble {...props} dropdowns={dropdowns}/>)

    expect(wrapper.find(`select`)).toHaveLength(dropdowns.length + 1)
  })

  test(`calls dropdownOnChange with an explicit flag not to debounce filtering`, () => {
    const dropdowns =
      // https://stackoverflow.com/questions/3751520/how-to-generate-sequence-of-numbers-chars-in-javascript
      Array.apply(0, Array(getRandomInt(1, MAX_DROPDOWN_COUNT)))
        .map(() => (
          {
            label: randomString(),
            dataKey: randomString(),
            options:
              Array.apply(0, Array(getRandomInt(1, MAX_OPTIONS_COUNT)))
                .map(() => randomString())
          }
        ))

    const wrapper = shallow(<TablePreamble {...props} dropdowns={dropdowns}/>)

    const event = { target: { value: randomString() } }
    const randomDropdownIndex = getRandomInt(0, dropdowns.length)
    wrapper.find(`select`).at(randomDropdownIndex).simulate(`change`, event)

    expect(props.dropdownOnChange).toHaveBeenCalled()
    expect(props.dropdownOnChange.mock.calls)
      .toContainEqual([dropdowns[randomDropdownIndex].dataKey, event.target.value, false])
  })

  test(`matches snapshot (basic)`, () => {
    const props = {
      dropdowns: [],
      dropdownOnChange: jest.fn(),
      rowsCount: 1000,
      rowsPerPageOptions: [10, 25, 50],
      rowsPerPage: 10,
      rowsPerPageOnChange: jest.fn(),
      searchAll: ``,
      searchAllOnChange: jest.fn()
    }

    expect(mount(<TablePreamble {...props}/>)).toMatchSnapshot()
  })

  test(`matches snapshot (with dropdowns)`, () => {
    const props = {
      dropdowns: [
        {
          label: `Experiment type`,
          dataKey: `experimentType`,
          options: [`Baseline`, `Differential`],
        },
        {
          label: `Kingdom`,
          dataKey: `kingdom`,
          options: [`Animals`, `Plants`, `Fungi`],
          value: `Dorne`
        },
        {
          label: `Technology type`,
          dataKey: `technologyType`,
          options: [`Smart-Seq`, `10x`, `Droplet-based`],
          value: `Smart-Seq`
        }
      ],
      dropdownOnChange: jest.fn(),
      rowsCount: 1000,
      rowsPerPageOptions: [10, 25, 50],
      rowsPerPage: 10,
      rowsPerPageOnChange: jest.fn(),
      searchAll: ``,
      searchAllOnChange: jest.fn()
    }

    expect(mount(<TablePreamble {...props}/>)).toMatchSnapshot()
  })
})
