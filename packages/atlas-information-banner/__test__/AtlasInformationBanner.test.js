// If you get ReferenceError: regeneratorRuntime is not defined use this in your tests:
// import '@babel/polyfill'
import renderer from 'react-test-renderer'
import {shallow} from 'enzyme'

import AtlasInformationBanner from '../src/AtlasInformationBanner'

describe(`AtlasInformationBanner`, () => {

	test(`disappears when close button is clicked`, () => {
		const wrapper = shallow(<AtlasInformationBanner/>)

		expect(wrapper.state('visibility')).toHaveLength(0);
		wrapper.find('a').last().simulate('click')
		expect(wrapper.state('visibility')).toBe('none');
	})

	test(`matches snapshot`, () => {
		const tree = renderer.create(<AtlasInformationBanner/>).toJSON()

		expect(tree).toMatchSnapshot()
	})
})
