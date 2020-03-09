import React from 'react'
import { shallow, mount } from 'enzyme'
import renderer from 'react-test-renderer'

import randomString from 'random-string'

import BioentityProperty, { PropertyValue } from '../src/BioentityProperty'

import { bioentityProperties } from './brca2-bioentity-information.json'


describe(`BioentityProperty`, () => {
  test(`only shows the 3 most relevant Gene Ontology terms with a button to show more`, () => {
    const goTerms = bioentityProperties[2]
    const wrapper = shallow(<BioentityProperty {...goTerms}/>)

    expect(wrapper.find(PropertyValue)).toHaveLength(3)
    expect(wrapper.find(`a`)).toHaveProp({ role: `button` })
  })

  test(`only shows the 3 most relevant Plant Ontology terms with a button to show more`, () => {
    const goTerms = bioentityProperties[2]
    const wrapper = shallow(<BioentityProperty {...goTerms} type={`po`}/>)

    expect(wrapper.find(PropertyValue)).toHaveLength(3)
    expect(wrapper.find(`a`)).toHaveProp({ role: `button` })
  })

  test(`shows all values if they’re not Gene Ontology or Plant Ontology terms`, () => {
    const goTerms = bioentityProperties[2]
    const wrapper = shallow(<BioentityProperty {...goTerms} type={randomString()}/>)

    expect(wrapper.find(PropertyValue).length).toBeGreaterThan(3)
    expect(wrapper.find(`a`)).not.toExist()
  })

  test(`shows more/fewer GO and PO terms by clicking on the button to show more/fewer`, () => {
    const goTerms = bioentityProperties[2]
    const wrapper = shallow(<BioentityProperty {...goTerms}/>)

    expect(wrapper.find(PropertyValue)).toHaveLength(3)

    wrapper.find(`a`).simulate(`click`)
    expect(wrapper.find(PropertyValue).length).toBeGreaterThan(3)

    wrapper.find(`a`).simulate(`click`)
    expect(wrapper.find(PropertyValue)).toHaveLength(3)
  })

  test(`properties without URLs are displayed as text (i.e. no links)`, () => {
    const synonyms = bioentityProperties[0]
    const wrapper = mount(<BioentityProperty {...synonyms}/>)

    expect(wrapper).not.toContainMatchingElement(`a`)
  })

  test(`properties with URLs contain links`, () => {
    const orthologs = bioentityProperties[1]
    const wrapper = mount(<BioentityProperty {...orthologs}/>)

    expect(wrapper).toContainMatchingElement(`a`)
  })

  test(`matches snapshot`, () => {
    bioentityProperties.forEach(bioentityProperty => {
      const tree = renderer.create(<BioentityProperty {...bioentityProperty}/>).toJSON()
      expect(tree).toMatchSnapshot()
    })
  })
})
