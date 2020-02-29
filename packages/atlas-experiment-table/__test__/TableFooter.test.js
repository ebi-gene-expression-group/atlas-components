import React from 'react'
import { shallow, mount } from 'enzyme'

import TableFooter from '../src/TableFooter'

import { getRandomInt } from './TestUtils'

describe(`TableFooter`, () => {
  // This value depends on the actual implementation of TableFooter; can be exporeted if we don’t want to declare it
  const MAX_PAGE_ITEMS_COUNT = 7

  const props = {
    dataRowsLength: 0,
    filteredDataRowsLength: 0,
    rowsPerPage: 10,
    currentPage: 1,
    onChange: jest.fn()
  }

  afterEach(() => {
    props.onChange.mockReset()
  })

  test(`shows nothing if the number of filtered rows is greater than the total number of rows`, () => {
    const wrapper = shallow(<TableFooter {...props} filteredDataRowsLength={props.dataRowsLength + 1}/>)
    expect(wrapper).toBeEmptyRender()
  })

  test(`displays only two disabled links, Previous and Next, if no rows are shown in the table and we want all items`, () => {
    const wrapper = shallow(<TableFooter {...props} dataRowsLength={1000} filteredDataRowsLength={0} rowsPerPage={0}/>)
    expect(wrapper.find(`li`)).toHaveLength(2)
  })

  test(`displays only two disabled links, Previous and Next, if no rows are shown in the table`, () => {
    const wrapper = shallow(<TableFooter {...props}/>)

    expect(wrapper.find(`li`)).toHaveLength(2)
    expect(wrapper.find(`li`).first()).toHaveText(`Previous`)
    expect(wrapper.find(`li`).first().find(`span`)).toHaveClassName(`disabled`)
    expect(wrapper.find(`li`).last()).toHaveText(`Next`)
    expect(wrapper.find(`li`).last().find(`span`)).toHaveClassName(`disabled`)
  })

  test(`shows all page items if the number of data rows spans ${MAX_PAGE_ITEMS_COUNT} or fewer pages`, () => {
    const filteredDataRowsLength = getRandomInt(1, props.rowsPerPage * MAX_PAGE_ITEMS_COUNT + 1)
    const wrapper =
    shallow(
      <TableFooter
        {...props}
        dataRowsLength={filteredDataRowsLength}
        filteredDataRowsLength={filteredDataRowsLength}/>)

    expect(wrapper.find(`li`)).toHaveLength(Math.ceil(filteredDataRowsLength / props.rowsPerPage) + 2)
  })

  test(`shows the first page itemes anchored at 1 if data rows spans ${MAX_PAGE_ITEMS_COUNT} or more pages`, () => {
    const filteredDataRowsLength = getRandomInt(props.rowsPerPage * MAX_PAGE_ITEMS_COUNT + 1, props.rowsPerPage * 20)
    const wrapper =
      shallow(
        <TableFooter
          {...props}
          dataRowsLength={filteredDataRowsLength}
          filteredDataRowsLength={filteredDataRowsLength}/>)

    expect(wrapper.find(`li`)).toHaveLength(MAX_PAGE_ITEMS_COUNT + 2)
    expect(wrapper.find(`li`).at(0)).toHaveText(`Previous`)
    expect(wrapper.find(`li`).at(1)).toHaveText(`1`)
    expect(wrapper.find(`li`).at(2)).toHaveText(`2`)
    expect(wrapper.find(`li`).at(3)).toHaveText(`3`)
    expect(wrapper.find(`li`).at(4)).toHaveText(`4`)
    expect(wrapper.find(`li`).at(5)).toHaveText(`5`)
    expect(wrapper.find(`li`).at(6)).toHaveText(`…`)
    expect(wrapper.find(`li`).at(7)).toHaveText(`${Math.ceil(filteredDataRowsLength / props.rowsPerPage)}`)
    expect(wrapper.find(`li`).at(8)).toHaveText(`Next`)
  })

  test(`shows the first page itemes anchored at N if data rows spans ${MAX_PAGE_ITEMS_COUNT} or more pages`, () => {
    const filteredDataRowsLength = getRandomInt(props.rowsPerPage * MAX_PAGE_ITEMS_COUNT + 1, props.rowsPerPage * 20)
    const wrapper =
      shallow(
        <TableFooter
          {...props}
          currentPage={Math.ceil(filteredDataRowsLength / props.rowsPerPage)}
          dataRowsLength={filteredDataRowsLength}
          filteredDataRowsLength={filteredDataRowsLength}/>)

    expect(wrapper.find(`li`)).toHaveLength(MAX_PAGE_ITEMS_COUNT + 2)
    expect(wrapper.find(`li`).at(0)).toHaveText(`Previous`)
    expect(wrapper.find(`li`).at(1)).toHaveText(`1`)
    expect(wrapper.find(`li`).at(2)).toHaveText(`…`)
    expect(wrapper.find(`li`).at(3)).toHaveText(`${Math.ceil(filteredDataRowsLength / props.rowsPerPage) - 4}`)
    expect(wrapper.find(`li`).at(4)).toHaveText(`${Math.ceil(filteredDataRowsLength / props.rowsPerPage) - 3}`)
    expect(wrapper.find(`li`).at(5)).toHaveText(`${Math.ceil(filteredDataRowsLength / props.rowsPerPage) - 2}`)
    expect(wrapper.find(`li`).at(6)).toHaveText(`${Math.ceil(filteredDataRowsLength / props.rowsPerPage) - 1}`)
    expect(wrapper.find(`li`).at(7)).toHaveText(`${Math.ceil(filteredDataRowsLength / props.rowsPerPage)}`)
    expect(wrapper.find(`li`).at(8)).toHaveText(`Next`)
  })

  test(`shows the first, last and middle page items if data rows spans ${MAX_PAGE_ITEMS_COUNT} or more pages`, () => {
    const filteredDataRowsLength = getRandomInt(props.rowsPerPage * 8 + 1, props.rowsPerPage * 20)
    const currentPage = getRandomInt(5, Math.ceil(filteredDataRowsLength / props.rowsPerPage) - 4)
    const wrapper =
      shallow(
        <TableFooter
          {...props}
          currentPage={currentPage}
          dataRowsLength={filteredDataRowsLength}
          filteredDataRowsLength={filteredDataRowsLength}/>)

    expect(wrapper.find(`li`)).toHaveLength(MAX_PAGE_ITEMS_COUNT + 2)
    expect(wrapper.find(`li`).at(0)).toHaveText(`Previous`)
    expect(wrapper.find(`li`).at(1)).toHaveText(`1`)
    expect(wrapper.find(`li`).at(2)).toHaveText(`…`)
    expect(wrapper.find(`li`).at(3)).toHaveText(`${currentPage - 1}`)
    expect(wrapper.find(`li`).at(4)).toHaveText(`${currentPage}`)
    expect(wrapper.find(`li`).at(5)).toHaveText(`${currentPage + 1}`)
    expect(wrapper.find(`li`).at(6)).toHaveText(`…`)
    expect(wrapper.find(`li`).at(7)).toHaveText(`${Math.ceil(filteredDataRowsLength / props.rowsPerPage)}`)
    expect(wrapper.find(`li`).at(8)).toHaveText(`Next`)
  })

  test(`calls onClick with the next page index as argument when “Next” is clicked`, () => {
    const filteredDataRowsLength = getRandomInt(props.rowsPerPage + 1, props.rowsPerPage * 20)
    const currentPage = getRandomInt(1, Math.ceil(filteredDataRowsLength / props.rowsPerPage) - 1)
    const wrapper =
      shallow(
        <TableFooter
          {...props}
          currentPage={currentPage}
          dataRowsLength={filteredDataRowsLength}
          filteredDataRowsLength={filteredDataRowsLength}/>)

    wrapper.find(`li`).last().find(`a`).simulate(`click`)
    expect(props.onChange).toHaveBeenCalled()
    expect(props.onChange.mock.calls).toContainEqual([currentPage + 1])
  })

  test(`calls onClick with the previous page index as argument when “Previous” is clicked`, () => {
    const filteredDataRowsLength = getRandomInt(props.rowsPerPage + 1, props.rowsPerPage * 20)
    const currentPage = getRandomInt(2, Math.ceil(filteredDataRowsLength / props.rowsPerPage))
    const wrapper =
      shallow(
        <TableFooter
          {...props}
          currentPage={currentPage}
          dataRowsLength={filteredDataRowsLength}
          filteredDataRowsLength={filteredDataRowsLength}/>)

    wrapper.find(`li`).first().find(`a`).simulate(`click`)
    expect(props.onChange).toHaveBeenCalled()
    expect(props.onChange.mock.calls).toContainEqual([currentPage - 1])
  })

  test(`calls onClick with the displayed page index as argument when a page number is clicked`, () => {
    const filteredDataRowsLength = getRandomInt(props.rowsPerPage + 1, props.rowsPerPage * 20)
    const currentPage = getRandomInt(1, Math.ceil(filteredDataRowsLength / props.rowsPerPage))
    const wrapper =
      shallow(
        <TableFooter
          {...props}
          currentPage={currentPage}
          dataRowsLength={filteredDataRowsLength}
          filteredDataRowsLength={filteredDataRowsLength}/>)

    const activePageLinks =
      wrapper.find(`a`).filterWhere(e => !e.hasClass(`disabled`) && e.text() !== `Previous` && e.text() !== `Next`)

    const randomPageLinkIndex = getRandomInt(0, activePageLinks.length)

    activePageLinks.at(randomPageLinkIndex).simulate(`click`)
    expect(props.onChange).toHaveBeenCalled()
    expect(props.onChange.mock.calls).toContainEqual([Number.parseInt(activePageLinks.at(randomPageLinkIndex).text())])
  })

  test(`matches snapshot (more than ${MAX_PAGE_ITEMS_COUNT} pages filtered from a superset of rows)`, () => {
    //const filteredDataRowsLength = getRandomInt(props.rowsPerPage * MAX_PAGE_ITEMS_COUNT + 1, props.rowsPerPage * 20)
    const filteredDataRowsLength = 197
    const wrapper =
      mount(
        <TableFooter
          {...props}
          currentPage={Math.ceil(filteredDataRowsLength / props.rowsPerPage)}
          dataRowsLength={filteredDataRowsLength * 3}
          filteredDataRowsLength={filteredDataRowsLength}/>)
    expect(wrapper).toMatchSnapshot()
  })

  test(`matches snapshot (fewer than ${MAX_PAGE_ITEMS_COUNT} pages in total)`, () => {
    // const filteredDataRowsLength = getRandomInt(1, props.rowsPerPage * MAX_PAGE_ITEMS_COUNT + 1)
    const filteredDataRowsLength = 34
    const wrapper =
      mount(
        <TableFooter
          {...props}
          currentPage={Math.ceil(filteredDataRowsLength / props.rowsPerPage)}
          dataRowsLength={filteredDataRowsLength}
          filteredDataRowsLength={filteredDataRowsLength}/>)
    expect(wrapper).toMatchSnapshot()
  })

  test(`matches snapshot (one page)`, () => {
    // const filteredDataRowsLength = getRandomInt(1, props.rowsPerPage * MAX_PAGE_ITEMS_COUNT + 1)
    const filteredDataRowsLength = 1
    const wrapper =
      mount(
        <TableFooter
          {...props}
          currentPage={Math.ceil(filteredDataRowsLength / props.rowsPerPage)}
          dataRowsLength={filteredDataRowsLength}
          filteredDataRowsLength={filteredDataRowsLength}/>)
    expect(wrapper).toMatchSnapshot()
  })

  test(`matches snapshot (no data)`, () => {
    const wrapper = mount(<TableFooter {...props} dataRowsLength={5}/>)
    expect(wrapper).toMatchSnapshot()
  })
})
