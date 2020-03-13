import React from 'react'
import renderer from 'react-test-renderer'
import Enzyme from 'enzyme/build'
import {shallow, mount} from 'enzyme/build'
import Adapter from 'enzyme-adapter-react-16/build'

import Prompt from '../../src/head/Prompt'
import { downloadFileTypes } from '../TestUtils'

Enzyme.configure({ adapter: new Adapter() })

describe(`Prompt`, () => {
  const props = {
    downloadFileTypes: downloadFileTypes,
    onSelect: () => {}
  }

  test(`should render 3 file type checkboxes and descriptions`, () => {
    const wrapper = shallow(<Prompt {...props}/>)
    expect(wrapper.find(`input`)).toHaveLength(downloadFileTypes.length)
    expect(wrapper.find(`p`)).toHaveLength(downloadFileTypes.length + 1) //title
  })

  test(`should store selected/toggled file types when check boxes are clicked`, () => {
    const wrapper = mount(<Prompt {...props}/>)
    //all checked by default
    expect(wrapper.state(`selectedFileTypes`)).toStrictEqual(downloadFileTypes.map(filtype => filtype.id))

    //uncheck the first one
    wrapper.find(`input`).first().simulate(`change`)
    expect(wrapper.state(`selectedFileTypes`)).toStrictEqual([downloadFileTypes[1].id, downloadFileTypes[2].id])

    //toggle the first one
    wrapper.find(`input`).first().simulate(`change`)
    expect(wrapper.state(`selectedFileTypes`)).toStrictEqual(downloadFileTypes.map(filtype => filtype.id))
  })

  test(`matches snapshot`, () => {
    const tree = renderer.create(<Prompt {...props}/>).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
