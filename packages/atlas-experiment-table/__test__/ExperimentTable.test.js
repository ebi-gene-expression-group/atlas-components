import React from 'react'
import { shallow, mount } from 'enzyme'
import { getRandomInt, TableCellDiv, data, tableHeader, tableFilters } from './TestUtils'
import ExperimentTable from '../src/ExperimentTable'
import TableFooter from '../src/TableFooter'
import TableContent from '../src/TableContent'
import TableSearchHeader from '../src/TableSearchHeader'
import { Table } from 'evergreen-ui'
import _ from 'lodash'

describe(`ExperimentTable`, () => {
  const props = {
    experiments: data,
    tableHeader: tableHeader,
    tableFilters: tableFilters,
    host: `fool`,
    resource: `bool`,
    enableDownload: true,
    enableIndex: true,
    TableCellDiv: TableCellDiv,
    downloadTooltip: `<t>A random test tooltip text</t>`
  }

  test(`should render three search general boxes and a table with head and body and two bottom info boxes`, () => {
    const wrapper = shallow(<ExperimentTable {...props}/>)
    expect(wrapper).toContainExactlyOneMatchingElement(TableSearchHeader)
    expect(wrapper).toContainExactlyOneMatchingElement(TableContent)
    expect(wrapper).toContainExactlyOneMatchingElement(TableFooter)
  })


  test(`should sort table content and change header text icon`, () => {
    const randomColumnIndex = getRandomInt(1, tableHeader.length)
    props.tableHeader[randomColumnIndex].type = `sort`
    const wrapper = mount(<ExperimentTable {...props}/>)

    expect(wrapper).toContainExactlyOneMatchingElement(`.icon.icon-common.icon-sort-down`)
    expect(wrapper.find(`.icon.icon-common.icon-sort-up`)).not.toExist()

    const sortedHeader = wrapper.find(`.header${randomColumnIndex}`).at(0)
    sortedHeader.simulate(`click`)
    wrapper.update()
    expect(wrapper.find(`.icon.icon-common.icon-sort-down`)).not.toExist()
    sortedHeader.simulate(`click`)
    wrapper.update()
    expect(wrapper).toContainExactlyOneMatchingElement(`.icon.icon-common.icon-sort-down`)
  })

  test(`should filter based on filter value selection`, () => {
    const event = {target: {name: `pollName`, value: `animals`}}
    const wrapper = mount(<ExperimentTable {...props}/>)
    const filterSelect = wrapper.find(`select`).at(0)
    filterSelect.simulate(`change`, event)

    expect(wrapper.state(`selectedDropdownFilters`).some(filter => filter.value === `animals`)).toEqual(true)
    expect(wrapper.find(Table.Row).length).toBeLessThanOrEqual(data.length)
  })

  test(`should remove filter from if no filter value selected`, () => {
    const event = {target: {name: `pollName`, value: ``}}
    const wrapper = mount(<ExperimentTable {...props}/>)
    const selectedFilter = {label: `Kingdom`, value: ``}
    wrapper.state(`selectedDropdownFilters`).push(selectedFilter)
    const filterSelect = wrapper.find(`select`).at(0)
    filterSelect.simulate(`change`, event)

    expect(wrapper.state(`selectedDropdownFilters`).some(filter => filter.value === `` && filter.label === `Kingdom`)).toEqual(false)
  })

  test(`should not filter if no filter selected`, () => {
    const wrapper = mount(<ExperimentTable {...props}/>)

    expect(wrapper.state(`selectedDropdownFilters`).length).toEqual(0)
    expect(wrapper.find(Table.Row).length).toEqual(data.length)
  })

  test(`should filter based on numbers of entries per page selection`, () => {
    const event = {target: {name: `pollName`, value: 1}}
    const wrapper = mount(<ExperimentTable {...props}/>)
    const entriesSelect = wrapper.find(`select`).at(3)
    entriesSelect.simulate(`change`, event)

    expect(wrapper.state(`entriesPerPage`)).toEqual(1)
    expect(wrapper.find(Table.Row).length).toEqual(1)
  })

  test(`should filter based on search box above the table`, () => {
    const event = {target: {name: `hello`, value: `single`}}
    const wrapper = mount(<ExperimentTable {...props}/>)
    const overallSearch = wrapper.find(`input`).first().at(0)
    overallSearch.simulate(`change`, event)

    expect(wrapper.state(`selectedSearch`)).toEqual(`single`)
    expect(wrapper.find(Table.Row).length).toBeLessThanOrEqual(data.length)
  })


  test(`should filter based on table header search`, () => {
    const randomValue = `si`
    const randomColumn = getRandomInt(1, tableHeader.length)
    props.tableHeader[randomColumn].type = `search`

    const wrapper = mount(<ExperimentTable {...props}/>)
    expect(wrapper.find(`.searchheader${randomColumn}`)).toExist()
    wrapper.setState({searchQuery: randomValue})
    wrapper.update()
    expect(wrapper.find(Table.Row).length).toBeLessThanOrEqual(data.length)
  })

  test(`should filter data if species is predefined`, () => {
    const wrapper = mount(<ExperimentTable {...props} species={`homo`}/>)
    wrapper.update()
    expect(wrapper.find(Table.Row).length).toBeLessThanOrEqual(data.length)
  })

  test(`should change page by clicking buttons`, () => {
    const wrapper = mount(<ExperimentTable {...props}/>)
    const currentPage = wrapper.state().currentPage
    wrapper.setState({entriesPerPage: 1, currentPage: 1})
    wrapper.update()

    const nextButton = wrapper.find(`.pagination li`).last()
    nextButton.children().simulate(`click`)
    wrapper.update()
    expect(wrapper.state().currentPage).toEqual(currentPage + 1)

    const prevButton = wrapper.find(`.pagination li`).first()
    prevButton.children().simulate(`click`)
    expect(wrapper.state().currentPage).toEqual(currentPage)

    const currentNumberButton = wrapper.find(`.current`)
    expect(currentNumberButton).toHaveLength(1)
  })

  test(`should save experiment accession by check download box`, () => {
    const randomRow = getRandomInt(0, data.length)

    const wrapper = mount(<ExperimentTable {...props} enableDownload={true}/>)
    const propKey = tableHeader[wrapper.state(`orderedColumnIndex`)].dataParam
    const sortedElements = _.sortBy(data, propKey).reverse()

    expect(wrapper.state(`checkedRows`)).toEqual([])
    const checkbox = wrapper.find(`.checkbox`).at(randomRow)
    checkbox.simulate(`change`)
    expect(wrapper.state(`checkedRows`)).toEqual([sortedElements[randomRow].experimentAccession])
    checkbox.simulate(`change`)
    expect(wrapper.state(`checkedRows`)).toEqual([])
  })

})
