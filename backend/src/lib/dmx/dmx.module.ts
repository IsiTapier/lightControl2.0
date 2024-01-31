import { Module } from '@nestjs/common';

// import { CatsController } from './cats.controller';
// import { CatsService } from './cats.service';



@Module({
//   controllers: [CatsController],
//   providers: [CatsService],
})
export class DMXModule {
    public static artnet() {
        this.tx();
        this.rx();
    }

    private static rx() {

    }

    private static tx() {
    // 'use strict';  ??????????????
    // Load dmxnet as libary
    var dmxlib=require('dmxnet');
    // Create new dmxnet instance
    var dmxnet = new dmxlib.dmxnet({
        verbose: 1,
    });
    // Create new Sender instance
    var sender = dmxnet.newSender({
        ip: '192.168.178.118',
        subnet: 0,
        universe: 0,
        net: 0,
    });
    // Set Channels
    sender.setChannel(0, 255);
    sender.setChannel(1, 128);

    // Fill Channels
    // sender.fillChannels(1, 20, 10);

    // Prepare Channel 26+27 after 10 s and send next secondly
    setTimeout(function() {
        sender.prepChannel(1, 0);
        sender.prepChannel(2, 255);
        sender.prepChannel(3, 255);
        sender.transmit();
    }, 2000);
    
    // Stop sender after 5 seconds
    // setTimeout(function() {
    // sender.stop();
    // }, 50000);
        console.log("Arnet started");
    }
}
