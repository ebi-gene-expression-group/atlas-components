import React from 'react'
import renderer from 'react-test-renderer'
import Enzyme from 'enzyme'
import {shallow, mount} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import Prompt from '../src/Prompt'
import SmileyDiv from '../src/SmileyDiv'

Enzyme.configure({ adapter: new Adapter() })


describe(`Prompt`, () => {
  const props = {
    feedbackFormLink:
      Math.random() > 0.5 ? `https://www.ebi.ac.uk/support/gxa` : `https://www.ebi.ac.uk/support/gxasc`,
    onSelect: () => {}
  }

  test(`should render 5 smiley faces and 1 link to EBI support`, () => {
    const wrapper = shallow(<Prompt {...props}/>)
    expect(wrapper.find(SmileyDiv)).toHaveLength(5)
    expect(wrapper.find(`a`)).toHaveLength(1)
  })

  test(`should store a score when smiley faces are clicked`, () => {
    const wrapper = mount(<Prompt {...props}/>)
    expect(wrapper.state(`selectedSmileyScore`)).toBe(0)

    wrapper.find(SmileyDiv).first().simulate(`click`)
    expect(wrapper.state(`selectedSmileyScore`)).toBe(1)

    wrapper.find(SmileyDiv).last().simulate(`click`)
    expect(wrapper.state(`selectedSmileyScore`)).toBe(5)
  })

  test(`matches snapshot`, () => {
    const tree =
      renderer.create(<Prompt feedbackFormLink={`https://www.ebi.ac.uk/support/gxasc`}  onSelect={()=>{}}/>).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
