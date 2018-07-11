import React from 'react'
import renderer from 'react-test-renderer'
import Enzyme from 'enzyme'
import {shallow, mount, render} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import GeneSearchForm from '../src/GeneSearchForm.js'

Enzyme.configure({ adapter: new Adapter() })

describe(`GeneSearchForm`, () => {
  test(`should render without throwing an error`, () => {
     expect(shallow(<GeneSearchForm />).contains(<div className="foo">Bar</div>)).toBe(true)
  })

  test(`should be selectable by class "foo"`, () => {
    expect(shallow(<GeneSearchForm />).is(`.foo`)).toBe(true)
  })

  test(`should mount in a full DOM`, () => {
    expect(mount(<GeneSearchForm />).find(`.foo`)).toHaveLength(1)
  })

  test(`should render to static HTML`, () => {
    expect(render(<GeneSearchForm />).text()).toEqual(`Bar`)
  })

  test(`matches snapshot`, () => {
    const tree = renderer.create(<GeneSearchForm />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
