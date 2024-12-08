import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { DeviceService } from '../device/device.service';
import { ModuleRef } from '@nestjs/core';

const ip = '192.168.1.98';
const initTime = 2*1000;

@Injectable()
export class DMXService implements OnModuleInit {
    private static readonly logger = new Logger(DMXService.name);
    
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
        this.logger.debug("channel: "+channel+" value: "+value+" update: "+update);
        // console.log("channel: "+channel+" value: "+value+" update: "+update);
        if(channel < 1 || channel > 512) return;
        if(value < 0 || value > 255) return;
        if(update) this.sender.setChannel(channel-1, value); // since addresses start by 1 while channels start by 0
        else this.sender.prepChannel(channel-1, value);
    }

    public static update() {
        this.logger.debug("update");
        this.sender.transmit();
    }

    public static readChannel(channel: number, inputUniverse : boolean = true) : number {
        if(channel < 1 || channel > 512) return;
        return (inputUniverse ? this.receiver : this.sender).values[channel-1];
    }

    private static rx() {
        this.receiver = this.dmxnet.newReceiver({
            // ip: ip,
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
        // flicker prevention: set wrong ip and collect inital channel data
        this.sender = this.dmxnet.newSender({
            ip: "123.123.123.123", //IP to send to, default 255.255.255.255
            subnet: 0, //Destination subnet, default 0
            universe: 1, //Destination universe, default 0
            net: 0, //Destination net, default 0
            port: 6454, //Destination UDP Port, default 6454
            base_refresh_interval: 100 // Default interval for sending unchanged ArtDmx
        });
        // wait for init to happen
        setTimeout(() => {
            // save init data
            let data = this.sender.values;
            // replace sender with right ip
            this.sender = this.dmxnet.newSender({
                ip: ip, //IP to send to, default 255.255.255.255
                subnet: 0, //Destination subnet, default 0
                universe: 1, //Destination universe, default 0
                net: 0, //Destination net, default 0
                port: 6454, //Destination UDP Port, default 6454
                base_refresh_interval: 100 // Default interval for sending unchanged ArtDmx
            });
            // immidiately replace data with init data and update
            this.sender.values = data;
            this.sender.transmit();
            this.logger.debug("dmx sender initialized");
        }, initTime);
    }
}