import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import '@babel/polyfill'
import fetchMock from 'jest-fetch-mock'

// Enable mocks for fetch
fetchMock.enableMocks()

// Configure Enzyme
configure({ adapter: new Adapter() })
