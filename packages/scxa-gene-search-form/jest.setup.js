import { TextEncoder, TextDecoder } from "util";
import { TransformStream } from "stream/web";
import { BroadcastChannel } from "broadcast-channel";

class FakeBroadcastChannel {
    constructor(name) {
        this.name = name;
        this.onmessage = () => {};
    }
    postMessage(msg) {
        setTimeout(() => this.onmessage({ data: msg }), 0);
    }
    close() {}
}

global.BroadcastChannel = FakeBroadcastChannel;
global.TransformStream = TransformStream;

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
