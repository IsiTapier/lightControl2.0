import { Module } from '@nestjs/common';
import { DMXService } from './dmx.service';
import { DeviceModule } from '../device/device.module';
import { DeviceService } from '../device/device.service';

@Module({
    // imports: [DeviceModule],
    providers: [DMXService],
    // exports: [DMXService]
})
export class DMXModule {/*
    private static deviceService : DeviceService;

    private static dmxnet;
    private static sender;
    private static receiver;

    public static artnet(deviceService : DeviceService) {
        // 'use strict';  ???
        this.deviceService = deviceService;
        console.log(deviceService);
        var dmxlib=require('dmxnet');
        this.dmxnet = new dmxlib.dmxnet({verbose: 1});
        this.tx();
        this.rx();
    }

    // TEMP
    public static getSender() {
        return this.sender;
    }

    public static setChannel(channel: number, value: number, update: boolean) {
        console.log("channel: "+channel+" value: "+value+" update: "+update);
        if(channel < 1 || channel > 512) return;
        if(value < 0 || value > 255) return;
        if(update) this.sender.setChannel(channel-1, value); // since addresses start by 1 while channels start by 0
        else this.sender.prepChannel(channel-1, value);
    }

    public static update() {
        console.log("update");
        this.sender.transmit();
    }

    public static readChannel(channel: number) : number {
        if(channel < 1 || channel > 512) return;
        // TODO read input universe

        return 0;
    }

    private static rx() {
        var receiver=this.dmxnet.newReceiver({
            subnet: 0, //Destination subnet, default 0
            universe: 0, //Destination universe, default 0
            net: 0, //Destination net, default 0
        });

        // Dump data if DMX Data is received
        receiver.on('data', function(data) {
            // console.log('DMX data:', data); // eslint-disable-line no-console
            console.log(this.deviceService.getDevices());
        });
    }

    private static tx() {
        this.sender = this.dmxnet.newSender({
            ip: '192.168.178.118', //IP to send to, default 255.255.255.255
            subnet: 0, //Destination subnet, default 0
            universe: 1, //Destination universe, default 0
            net: 0, //Destination net, default 0
            port: 6454, //Destination UDP Port, default 6454
            base_refresh_interval: 1000 // Default interval for sending unchanged ArtDmx
        });
        return;
        // Set Channels
        this.sender.setChannel(0, 255);
        this.sender.setChannel(1, 128);

        // Fill Channelss
        // sender.fillChannels(1, 20, 10);

        // Prepare Channel 26+27 after 10 s and send next secondly
        setTimeout(function() {
            DMXModule.sender.prepChannel(1, 0);
            DMXModule.sender.prepChannel(2, 255);
            DMXModule.sender.prepChannel(3, 255);
            DMXModule.sender.transmit();
        }, 2000);
        
        // Stop sender after 5 seconds
        // setTimeout(function() {
        // sender.stop();
        // }, 50000);
        console.log("Arnet started");
    }*/
}
