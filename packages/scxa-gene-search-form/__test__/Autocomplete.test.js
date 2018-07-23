import React from 'react'
import renderer from 'react-test-renderer'
import Enzyme from 'enzyme'
import {shallow, mount, render} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import Autocomplete from '../src/Autocomplete.js'
import AsyncCreatableSelect from 'react-select/lib/AsyncCreatable'

Enzyme.configure({ adapter: new Adapter() })

describe(`Autocomplete`, () => {
  const props = {
    atlasUrl: `foo/`,
    actionEndpoint: `bar`,
    suggesterEndpoint: `suggest`,
    onChange: () => {}
  }

  const defaultValue = {
    term: `foo`,
    category: `bar`
  }

  test(`displays the default value`, () => {
     const wrapper = mount(<Autocomplete {...props} defaultValue={defaultValue}/>)
     expect(wrapper.find(AsyncCreatableSelect).props().defaultValue).toEqual({
       label: defaultValue.term,
       value: JSON.stringify(defaultValue)
     })
  })

  // test(`should be selectable by class "foo"`, () => {
  //   expect(shallow(<GeneSearchForm />).is(`.foo`)).toBe(true)
  // })
  //
  // test(`should mount in a full DOM`, () => {
  //   expect(mount(<GeneSearchForm />).find(`.foo`)).toHaveLength(1)
  // })
  //
  // test(`should render to static HTML`, () => {
  //   expect(render(<GeneSearchForm />).text()).toEqual(`Bar`)
  // })
  //
  // test(`matches snapshot`, () => {
  //   const tree = renderer.create(<GeneSearchForm />).toJSON()
  //   expect(tree).toMatchSnapshot()
  // })
})
