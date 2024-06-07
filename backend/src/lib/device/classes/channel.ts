import { ChannelType } from "../types/channelType";

export class Channel {
    type: ChannelType;
    inputAddress: number;
    defaultValue: number;

    constructor(type: ChannelType = ChannelType.None, inputAddress: number = 0, defaultValue: number = 0) {
        this.type = type;
        this.inputAddress = inputAddress < 1 || inputAddress > 512 ? 0 : inputAddress; // TODO Error Message
        this.defaultValue = defaultValue < 0 || defaultValue > 255 ? 0 : defaultValue;
    }
}
