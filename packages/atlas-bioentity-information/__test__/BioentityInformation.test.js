import React from 'react'
import renderer from 'react-test-renderer'
import Enzyme from 'enzyme'
import {shallow, mount, render} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import BioentityInformation from '../src/BioentityInformation.js'

Enzyme.configure({ adapter: new Adapter() })

describe(`BioentityInformation`, () => {
  test(`should render without throwing an error`, () => {
     expect(shallow(<BioentityInformation />).contains(<div className="foo">Bar</div>)).toBe(true)
  })

  test(`should be selectable by class "foo"`, () => {
    expect(shallow(<BioentityInformation />).is(`.foo`)).toBe(true)
  })

  test(`should mount in a full DOM`, () => {
    expect(mount(<BioentityInformation />).find(`.foo`)).toHaveLength(1)
  })

  test(`should render to static HTML`, () => {
    expect(render(<BioentityInformation />).text()).toEqual(`Bar`)
  })

  test(`matches snapshot`, () => {
    const tree = renderer.create(<BioentityInformation />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
