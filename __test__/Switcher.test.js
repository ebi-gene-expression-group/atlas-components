import React from 'react'
import renderer from 'react-test-renderer'
import { mount } from 'enzyme'

import Switcher from '../src/Switcher'

import svgsMetadata from '../src/json/svgsMetadata.json'
import {unique, getAnatomogramViews, getDefaultView, getParentView} from '../src/Assets'

const allSpecies = svgsMetadata
  .map((svgMetadata) => svgMetadata.species)
  .filter(unique)
  .sort()

const allChildrenViews = species =>
  svgsMetadata.filter(svgsMetadata => svgsMetadata.species === species)
    .filter(view => view.hasOwnProperty(`parent`))
    .map(data => data.view)

const organs = [`kidney`, `pancreas`, `liver`, `lung`, `gut`, `placenta`]

describe(`Anatomogram switcher`, () => {
  const requiredProps = {
    onChangeView: () => {}
  }

  test(`should contain as many buttons as views are defined for a species apart from organs`, function() {
    allSpecies.filter(species => !organs.includes(species)).forEach((species) => {
      expect(mount(<Switcher {...requiredProps} species={species}/>).find(`img`)).toHaveLength(getAnatomogramViews(species).length)
    })
  })
  
  test(`should contain a backward button for parent tissue parts for kidney species`, function() {
    const species = `kidney`
    allChildrenViews(species).forEach(view =>{
      expect(mount(<Switcher {...requiredProps} species={species} parentView={getParentView(species, view)}/>).find(`img`)).toHaveLength(1)
    }
    )
  })

  test(`should respond to onClick events with the anatomogram view and corresponding species`, () => {
    const onButtonClick = jest.fn()
    const wrapper = mount(<Switcher {...requiredProps} species={`homo_sapiens`} onChangeView={onButtonClick}/>)
    wrapper.find(`img`).first().simulate(`click`)
    wrapper.find(`img`).last().simulate(`click`)
    expect(onButtonClick.mock.calls.length).toBe(2)
    expect(onButtonClick.mock.calls[0]).toEqual([`homo_sapiens`, getAnatomogramViews(`homo_sapiens`)[0]])
    expect(onButtonClick.mock.calls[1]).toEqual([`homo_sapiens`, getAnatomogramViews(`homo_sapiens`)[2]])
  })

  allSpecies.forEach((species) => {
    test(`matches snapshot for ${species}`, () => {
      const tree = renderer.create(<Switcher {...requiredProps} species={species} selectedView={getDefaultView(species)}/>).toJSON()
      expect(tree).toMatchSnapshot()
    })
  })
})
