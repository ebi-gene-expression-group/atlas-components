import React from 'react'
import { shallow } from 'enzyme'
import { data } from './TestUtils'

import TableContent from '../src/TableContent'
import {alertInvalidFiles} from '../src/TableContent'
import TooltipIcon from '../src/TooltipIcon'

import { Table } from 'evergreen-ui'

import '@babel/polyfill'
import fetchMock from 'fetch-mock'


describe(`TableContent`, () => {

  beforeEach(() => {
    fetchMock.restore()
  })

  const props = {
    enableIndex: true,
    tableHeader: [{
      type: `sort`,
      title: `type`,
      width: 3,
      dataParam: `experimentType`,
      image: {
        SINGLE: {src: `www.foo.com`, alt: `foo`},
        DOUBLE: {src: `www.bar.cn`, alt: `bar`}
      }
    },
    {
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
    checkedRows: [`E-EHCA-2`, `E-EHCA-1`],
    currentPageData: data,
    host: `http://boo`,
    entriesPerPage: 2,
    currentPage: 1,
    tableHeaderOnClick: () => {},
    tableHeaderOnChange: () => {},
    downloadOnChange: () => {},
    downloadTooltip: `<t>A random test tooltip text</t>`
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

  test(`should display a HTML component in download button's tooltip`, () => {
    const wrapper = shallow(<TableContent {...props} enableDownload={true}/>)
    const tooltip = wrapper.find(TooltipIcon)
    expect(wrapper).toContainExactlyOneMatchingElement(TooltipIcon)
    expect(tooltip.props().tooltipText).toEqual(props.downloadTooltip)
  })

  test(`should display the images in the table content if the header has image field`, () => {
    const wrapper = shallow(<TableContent {...props}/>)
    expect(wrapper.find(`img`)).toHaveLength(props.tableHeader.length)
  })

  test(`should direct to download window without popping a confirm window if all download files are valid`, async (done) => {
    const checkFileEndpoint = `json/experiments/download/zip/check`
    const response = `{"invalidFiles":{"E-EHCA-2": [], "E-EHCA-1": []}}`
    fetchMock.get(`${props.host}/${checkFileEndpoint}?accession=${props.checkedRows[0]}&accession=${props.checkedRows[1]}`, response)

    global.window.location.replace = jest.fn(() => done())

    await alertInvalidFiles(props.host, props.checkedRows)

    await expect(global.window.location.replace).toBeCalledWith(`http://boo/experiments/download/zip?accession=E-EHCA-2&accession=E-EHCA-1`)
  })

  test(`should pop a confirm window if any download files are invalid`, async (done) => {
    const checkFileEndpoint = `json/experiments/download/zip/check`
    const response = `{"invalidFiles":{"E-EHCA-2": ["file1", "file2"]}, "E-EHCA-1":[]}`
    fetchMock.get(`${props.host}/${checkFileEndpoint}?accession=${props.checkedRows[0]}&accession=${props.checkedRows[1]}`, response)

    global.window.confirm = jest.fn(() => done())

    await alertInvalidFiles(props.host, props.checkedRows)

    await expect(global.window.confirm).toHaveBeenCalled()
  })})
