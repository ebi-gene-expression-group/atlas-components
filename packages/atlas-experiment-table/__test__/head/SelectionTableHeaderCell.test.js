import React from 'react'
import { shallow, mount } from 'enzyme'

import { Table, Heading } from 'evergreen-ui'
import ReactTooltip from 'react-tooltip'

import SelectionTableHeaderCell from '../../src/head/SelectionTableHeaderCell'
import Prompt from '../../src/head/Prompt'

import { getRandomInt, generateRandomExperimentAccession, downloadFileTypes } from '../TestUtils'

import randomString from 'random-string'

describe(`SelectionTableHeaderCell`, () => {
  const MAX_EXPERIMENT_COUNT = 10

  test(`displays a table header cell with only a label if no rows are selected`, () => {
    const props = {
      label: randomString(),
      selectedRowIds: [],
      downloadFileTypes: downloadFileTypes,
      onClick: () => {}
    }
    const wrapper = shallow(<SelectionTableHeaderCell {...props}/>)

    expect(wrapper).not.toContainMatchingElement(`a`)
    expect(wrapper).not.toContainMatchingElement(ReactTooltip)

    expect(wrapper).toContainExactlyOneMatchingElement(Table.HeaderCell)
    expect(wrapper).toContainExactlyOneMatchingElement(Heading)
    expect(wrapper.find(Heading)).toHaveProp(`children`, props.label)
  })

  test(`displays a table header cell with a link if there are rows selected`, () => {
    const props = {
      label: randomString(),
      downloadFileTypes: downloadFileTypes,
      selectedRowIds:
          // https://stackoverflow.com/questions/3751520/how-to-generate-sequence-of-numbers-chars-in-javascript
          Array.apply(0, Array(getRandomInt(1, MAX_EXPERIMENT_COUNT)))
            .map(() => generateRandomExperimentAccession()),
      onClick: () => {}
    }
    const wrapper = shallow(<SelectionTableHeaderCell {...props}/>)

    expect(wrapper).toContainExactlyOneMatchingElement(Table.HeaderCell)
    expect(wrapper).toContainExactlyOneMatchingElement(`a`)
    expect(wrapper.find(`a`)).toIncludeText(props.label)
  })

  test(`opens a popup window when the download link is clicked`, () => {
    const props = {
      label: randomString(),
      downloadFileTypes: downloadFileTypes,
      selectedRowIds:
      // https://stackoverflow.com/questions/3751520/how-to-generate-sequence-of-numbers-chars-in-javascript
        Array.apply(0, Array(getRandomInt(1, MAX_EXPERIMENT_COUNT)))
          .map(() => generateRandomExperimentAccession()),
      onClick: () => {}
    }

    const wrapper = mount(<SelectionTableHeaderCell {...props}/>)

    expect(wrapper.find(Prompt)).toHaveLength(0)
    wrapper.find(`a`).simulate(`click`)
    expect(wrapper.find(Prompt)).toHaveLength(1)
  })

  test(`calls onClick with the selected row IDs when the link is clicked, if download file types not provided`, () => {
    const props = {
      label: randomString(),
      selectedRowIds:
      // https://stackoverflow.com/questions/3751520/how-to-generate-sequence-of-numbers-chars-in-javascript
        Array.apply(0, Array(getRandomInt(1, MAX_EXPERIMENT_COUNT)))
          .map(() => generateRandomExperimentAccession()),
      onClick: jest.fn()
    }

    const wrapper = shallow(<SelectionTableHeaderCell {...props}/>)

    wrapper.find(`a`).simulate(`click`)
    expect(props.onClick).toHaveBeenCalled()
    expect(props.onClick.mock.calls).toContainEqual([props.selectedRowIds])
  })

  test(`can display an optional tooltip`, () => {
    const props = {
      label: randomString(),
      selectedRowIds: [],
      downloadFileTypes: downloadFileTypes,
      onClick: () => {},
      tooltipContent: randomString({length: 100})
    }
    const wrapper = shallow(<SelectionTableHeaderCell {...props}/>)

    expect(wrapper).toContainExactlyOneMatchingElement(ReactTooltip)
  })

  test(`matches snapshot (basic)`, () => {
    const props = {
      label: `Action`,
      selectedRowIds: [],
      downloadFileTypes: downloadFileTypes,
      onClick: () => {}
    }

    expect(mount(<SelectionTableHeaderCell {...props}/>)).toMatchSnapshot()
  })

  test(`matches snapshot (with a selection)`, () => {
    const props = {
      label: `Action`,
      selectedRowIds: [`E-EHCA-1`, `E-MTAB-5200`],
      onClick: jest.fn()
    }

    expect(mount(<SelectionTableHeaderCell {...props}/>)).toMatchSnapshot()
  })

  // Unfortunately ReactTooltip injects dynamically generated class names, and the rowSelectionColumn will cause the
  // snapshots not to match
  // test(`matches snapshot (with a selection and a tooltip)`, () => {
  //   const props = {
  //     label: `Action`,
  //     selectedRowIds: [`E-EHCA-1`, `E-MTAB-5200`],
  //     onClick: jest.fn(),
  //     tooltipContent: `Detailed description of the action performed on the rows when the header cell link is clicked`
  //   }
  //
  //   const wrapper = mount(<SelectionTableHeaderCell {...props}/>)
  //   expect(wrapper).toMatchSnapshot()
  // })
})
