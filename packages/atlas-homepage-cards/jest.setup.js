import '@testing-library/jest-dom';
import { ReadableStream } from 'web-streams-polyfill';
// Polyfill TextEncoder and TextDecoder for compatibility
import { TextEncoder, TextDecoder } from 'util';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import 'jest-enzyme';

configure({ adapter: new Adapter() })

if (typeof global.TextEncoder === 'undefined') {
    global.TextEncoder = TextEncoder;
}

if (typeof global.TextDecoder === 'undefined') {
    global.TextDecoder = TextDecoder;
}
global.ReadableStream = ReadableStream;