// If you get ReferenceError: regeneratorRuntime is not defined use this in your tests:
// import '@babel/polyfill'
import renderer from 'react-test-renderer'
import {shallow, mount, render} from 'enzyme'

import AtlasInformationBanner from '../src/AtlasInformationBanner'

describe(`AtlasInformationBanner`, () => {
  test(`should render without throwing an error`, () => {
    expect(shallow(<AtlasInformationBanner />).contains(<div className="foo">Bar</div>)).toBe(true)
  })

  test(`should be selectable by class "foo"`, () => {
    expect(shallow(<AtlasInformationBanner />).is(`.foo`)).toBe(true)
  })

  test(`should mount in a full DOM`, () => {
    expect(mount(<AtlasInformationBanner />).find(`.foo`)).toHaveLength(1)
  })

  test(`should render to static HTML`, () => {
    expect(render(<AtlasInformationBanner />).text()).toEqual(`Bar`)
  })

  test(`matches snapshot`, () => {
    const tree = renderer.create(<AtlasInformationBanner />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
