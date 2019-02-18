import React from 'react'
import renderer from 'react-test-renderer'
import Enzyme from 'enzyme'
import {shallow, mount, render} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import HeatmapView from '../src/HeatmapView.js'

Enzyme.configure({ adapter: new Adapter() })

describe(`HeatmapView`, () => {

})
