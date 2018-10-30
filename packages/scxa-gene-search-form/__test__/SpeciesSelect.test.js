import React from 'react'
import renderer from 'react-test-renderer'
import Enzyme from 'enzyme'
import { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import Select from 'react-select'
import SpeciesSelect from '../src/SpeciesSelect'

Enzyme.configure({ adapter: new Adapter() })

const getRandomInt = (max) => Math.floor(Math.random() * Math.floor(max))

const props = {
  topSpecies: [
    `Meeseek`,
    `Zigerion`
  ],
  allSpecies: [
    `Meeseek`,
    `Gromflomite`,
    `Cromulon`,
    `Zigerion`,
    `Moopian`,
    `Bliznarvian`,
    `Greebybobe`
  ],
  statusMessage: null,
  onChange: ()=> {},
  selectedSpecies: ``
}

describe(`SpeciesSelect`, () => {
  test(`is made up of a label and a React Select component`, () => {
    const wrapper = shallow(<SpeciesSelect {...props} />)
    expect(wrapper.first().find(`label`)).toHaveLength(1)
    expect(wrapper.first().find(`label`).text()).toEqual(`Species`)
    expect(wrapper.last().find(Select)).toHaveLength(1)
  })

  test(`is disabled when a statusMessage (i.e. an error message) is passed in and it is displayed`, () => {
    const errorMessage = `Any schwifty, non-empty string`
    const wrapper = shallow(<SpeciesSelect {...props} statusMessage={errorMessage} />)
    expect(wrapper.find(Select).prop(`isDisabled`)).toEqual(true)
    expect(wrapper.find(Select).prop(`placeholder`)).toEqual(errorMessage)
  })

  test(`is enabled when statusMessage is null`, () => {
    const wrapper = shallow(<SpeciesSelect {...props} />)
    expect(wrapper.find(Select).prop(`isDisabled`)).toEqual(false)
  })

  test(`selects Any species by default`, () => {
    const wrapper = shallow(<SpeciesSelect {...props} />)
    expect(wrapper.find(Select).prop(`defaultValue`)).toHaveProperty(`value`, ``)
    expect(wrapper.find(Select).prop(`defaultValue`)).toHaveProperty(`label`, `Any`)
  })

  test(`preselects the selectedSpecies prop`, () => {
    const selectedSpecies = props.allSpecies[getRandomInt(props.allSpecies.length)]
    const wrapper = shallow(<SpeciesSelect {...props} selectedSpecies={selectedSpecies}/>)
    expect(wrapper.find(Select).prop(`defaultValue`)).toHaveProperty(`value`, selectedSpecies)
  })

  test(`selects Any if selecetdSpecies doesn’t match any in topSpecies or allSpecies`, () => {
    const wrapper = shallow(<SpeciesSelect {...props} selectedSpecies={`Human`}/>)
    expect(wrapper.find(Select).prop(`defaultValue`)).toHaveProperty(`value`, ``)
    expect(wrapper.find(Select).prop(`defaultValue`)).toHaveProperty(`label`, `Any`)
  })

  test(`top species may not be included in all species`, () => {
    const topSpecies = [`Human`]
    const wrapper = shallow(<SpeciesSelect {...props} topSpecies={topSpecies}/>)

    // allSpecies group is the one which has an options property instead of a value one
    const allSpeciesGroup = wrapper.find(Select).prop(`options`).find(obj => Boolean(obj.options))

    expect(allSpeciesGroup.options).toContainEqual({
      value: props.allSpecies[getRandomInt(props.allSpecies.length)],
      label: expect.stringMatching(/.*/)
    })

    expect(allSpeciesGroup.options).not.toContainEqual({
      value: topSpecies[0],
      label: expect.stringMatching(/.*/)
    })
  })

  test(`changing the value in the React Select component fires the onChange prop function`, () => {
    const onChangeMock = jest.fn()
    const wrapper = shallow(<SpeciesSelect {...props} onChange={onChangeMock} />)

    const speciesToSelect = props.allSpecies[getRandomInt(props.allSpecies.length)]
    wrapper.find(Select).simulate(`change`, { value: speciesToSelect, label: speciesToSelect })

    expect(onChangeMock.mock.calls).toHaveLength(1)
    expect(onChangeMock.mock.calls[0][0]).toEqual({ value: speciesToSelect, label: speciesToSelect });
  })

  test(`matches snapshot`, () => {
    const tree = renderer.create(<SpeciesSelect {...props}/>).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
