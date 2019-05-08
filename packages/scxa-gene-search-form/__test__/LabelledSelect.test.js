import React from 'react'
import renderer from 'react-test-renderer'
import { shallow } from 'enzyme'

import Select from 'react-select'
import LabelledSelect from '../src/LabelledSelect'

import * as species from './utils/species'

const props = {
  name: `Species`,
  topGroup: species.getRandomSet(),
  bottomGroup: species.getAll(),
  bottomGroupLabel: `All species`,
  statusMessage: null,
  onChange: ()=> {}
}

describe(`LabelledSelect`, () => {
  test(`is made up of a label and a React Select component`, () => {
    const wrapper = shallow(<LabelledSelect {...props} />)
    expect(wrapper.first().find(`label`)).toHaveLength(1)
    expect(wrapper.first().find(`label`).text()).toEqual(props.name)
    expect(wrapper.last().find(Select)).toHaveLength(1)
  })

  test(`is disabled when a statusMessage (i.e. an error message) is passed in and it is displayed`, () => {
    const errorMessage = `Any schwifty, non-empty string`
    const wrapper = shallow(<LabelledSelect {...props} statusMessage={errorMessage} />)
    expect(wrapper.find(Select).prop(`isDisabled`)).toEqual(true)
    expect(wrapper.find(Select).prop(`placeholder`)).toEqual(errorMessage)
  })

  test(`is enabled when statusMessage is null`, () => {
    const wrapper = shallow(<LabelledSelect {...props} />)
    expect(wrapper.find(Select).prop(`isDisabled`)).toEqual(false)
  })

  test(`selects Any by default`, () => {
    const wrapper = shallow(<LabelledSelect {...props} />)
    expect(wrapper.find(Select).prop(`value`)).toHaveProperty(`value`, ``)
    expect(wrapper.find(Select).prop(`value`)).toHaveProperty(`label`, `Any`)
  })

  test(`can select an option via props`, () => {
    const selectedSpecies = species.getRandom()
    const wrapper = shallow(<LabelledSelect {...props} value={selectedSpecies}/>)
    expect(wrapper.find(Select).prop(`value`)).toHaveProperty(`value`, selectedSpecies)
  })

  test(`selects Any if value doesn’t match any in option in topGroup or bottomGroup`, () => {
    const wrapper = shallow(<LabelledSelect {...props} selectedSpecies={`Human`}/>)
    expect(wrapper.find(Select).prop(`value`)).toHaveProperty(`value`, ``)
    expect(wrapper.find(Select).prop(`value`)).toHaveProperty(`label`, `Any`)
  })

  test(`changing the value in the React Select component fires the onChange prop function`, () => {
    const onChangeMock = jest.fn()
    const wrapper = shallow(<LabelledSelect {...props} onChange={onChangeMock} />)

    const speciesToSelect = species.getRandom()
    wrapper.find(Select).simulate(`change`, { value: speciesToSelect, label: speciesToSelect })

    expect(onChangeMock.mock.calls).toHaveLength(1)
    expect(onChangeMock.mock.calls[0][0]).toEqual({ value: speciesToSelect, label: speciesToSelect })
  })

  test(`matches snapshot`, () => {
    const tree = renderer.create(<LabelledSelect {...props}/>).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
