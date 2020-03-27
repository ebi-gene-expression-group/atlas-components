import React from 'react'
import renderer from 'react-test-renderer'
import { shallow } from 'enzyme/build'

import ExperimentFileTypeMultiChoice from '../../src/download/ExperimentFileTypeMultiChoice'
import { downloadFileTypes, getRandomInt } from '../TestUtils'

describe(`ExperimentFileTypeMultiChoice`, () => {
  const props = {
    fileTypes: downloadFileTypes,
    onChange: jest.fn()
  }

  test(`renders as many checkboxes and descriptions as specified by props`, () => {
    const wrapper = shallow(<ExperimentFileTypeMultiChoice {...props}/>)
    expect(wrapper.find(`li`)).toHaveLength(props.fileTypes.length)
    expect(wrapper.find(`input`)).toHaveLength(props.fileTypes.length)
    expect(wrapper.find(`label`)).toHaveLength(props.fileTypes.length)
  })

  test(`calls onChange when a checkbox input is checked/unchecked`, () => {
    const wrapper = shallow(<ExperimentFileTypeMultiChoice {...props}/>)

    const randomInput = wrapper.find(`input`).at(getRandomInt(0, props.fileTypes.length))
    randomInput.simulate(`change`)
    expect(props.onChange).toHaveBeenCalled()
  })

  test(`matches snapshot`, () => {
    const tree = renderer.create(<ExperimentFileTypeMultiChoice {...props}/>).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
