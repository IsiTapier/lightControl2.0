import { Injectable, OnModuleInit } from '@nestjs/common';
import { DeviceService } from '../device/device.service';
import { ModuleRef } from '@nestjs/core';
import { DMXDevice } from '../device/classes/dmxDevice';
import { DeviceType } from '../device/types/deviceType';
import { ChannelType } from '../device/types/channelType';
import { Channel } from '../device/classes/channel';

@Injectable()
export class DMXService implements OnModuleInit {
    private static deviceService: DeviceService;
    private static dmxnet;
    private static sender;
    private static receiver;

    constructor(private moduleRef: ModuleRef) {}
  
    onModuleInit() {
      DMXService.deviceService = this.moduleRef.get(DeviceService, { strict: false });
    }

    public static artnet() {
        // 'use strict';  ???
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

    public static readChannel(channel: number, inputUniverse : boolean = true) : number {
        if(channel < 1 || channel > 512) return;
        return (inputUniverse ? this.receiver : this.sender).values[channel-1];
    }

    private static rx() {
        this.receiver = this.dmxnet.newReceiver({
            // ip: '192.168.178.118',
            subnet: 0, //Destination subnet, default 0
            universe: 0, //Destination universe, default 0
            net: 0, //Destination net, default 0
            base_refresh_interval: 100
        });

        // Dump data if DMX Data is received
        this.receiver.on('data', function(data) {  // TODO receiving faster/slower => bad on init
            // console.log(DMXService.deviceService.getDevices().length);
            // console.log('DMX data:', data); // eslint-disable-line no-console
            DMXService.deviceService.update();
        });
    }

    private static tx() {
        this.sender = this.dmxnet.newSender({
            ip: '192.168.1.106', //IP to send to, default 255.255.255.255
            subnet: 0, //Destination subnet, default 0
            universe: 1, //Destination universe, default 0
            net: 0, //Destination net, default 0
            port: 6454, //Destination UDP Port, default 6454
            base_refresh_interval: 100 // Default interval for sending unchanged ArtDmx
        });
        return;
        // Set Channels
        this.sender.setChannel(0, 255);
        this.sender.setChannel(1, 128);

        // Fill Channelss
        // sender.fillChannels(1, 20, 10);

        // Prepare Channel 26+27 after 10 s and send next secondly
        setTimeout(function() {
            this.sender.prepChannel(1, 0);
            this.sender.prepChannel(2, 255);
            this.sender.prepChannel(3, 255);
            this.sender.transmit();
        }, 2000);
        
        // Stop sender after 5 secondsd
        // setTimeout(function() {
        // sender.stop();
        // }, 50000);
        console.log("Arnet started");
    }
}