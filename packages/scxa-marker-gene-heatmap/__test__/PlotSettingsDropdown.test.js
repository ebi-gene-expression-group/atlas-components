import React from 'react'
import renderer from 'react-test-renderer'

import Enzyme from 'enzyme'
import {mount} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import Select from 'react-select'

import PlotSettingsDropdown from '../src/PlotSettingsDropdown'

Enzyme.configure({ adapter: new Adapter() })

describe(`PlotSettingsDropdown`, () => {
  test(`with no data matches snapshot`, () => {
    const onSelect = () => {}

    const tree = renderer
      .create(<PlotSettingsDropdown onSelect={onSelect} options={[]}/>)
      .toJSON()

    expect(tree).toMatchSnapshot()
  })

  test(`contains Select component and label`, () => {
    const onSelect = () => {}

    const options = [
      {
        value: `hello`,
        label: `hello`
      },
      {
        value: `world`,
        label: `world`
      }
    ]

    const wrapper =
      mount(<PlotSettingsDropdown
        labelText={`Test dropdown`}
        defaultValue={
          {
            value: `world`,
            label: `world`
          }
        }
        options={options}
        onSelect={onSelect}/>)

    expect(wrapper.find(`label`).text()).toBe(`Test dropdown`)
    expect(wrapper.find(Select).length).toBe(1)
  })
})
