import { HttpClient, HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { ip } from '../database';

@Component({
  selector: 'app-presets',
  templateUrl: 'presets.page.html',
  styleUrls: ['presets.page.scss']
})
export class PresetsPage {
  
  constructor(private http: HttpClient) {}

  red() : void {
    console.log("test");  
   /* this.http.get('http://192.168.178.90:3000/', {responseType: 'text'}).subscribe({
      next: (v) => console.log(v),
      error: (e) => console.error(e),
      complete: () => console.info('complete')
  });*/
    let queryParams = new HttpParams();
    queryParams.append("test","10"); 
    this.http.get('http://192.168.178.90:3000/devices/color?color=red', {
      // responseType: 'text',
      params: {int: 10}
    }).subscribe();
  }

  green() : void {
    console.log("green");
    this.http.post('http://192.168.178.90:3000/devices/green', {responseType: 'text'}, {
     
    }).subscribe((result) => {
      console.log(result);
    });
  }

  blue() : void {
    console.log("blue");
    this.http.post('http://192.168.178.90:3000/devices/blue?int=70', {
      content: 'blue'
    }).subscribe((result) => {
      console.log(result);
    });   
  }

  add() : void {
    const device = {_id: '6670aa31c3f832a7a78c34d8', type: 2, blabla: "12342", address: 160, channels: [{type: 9, defaultValue: 100}, {type: 10, defaultValue: 50}, {blabla: "asdfasdf"}], channelMultiplier: 1}
    let data = {
      test: 100,
      device: device,
      other: "tester",
    }
   this.http.patch('http://'+ip+':3000/devices', data).subscribe((result) => { console.log(result); });   
  }

  remove() : void {
    let id = '6670aa31c3f832a7a78c34d8';
    this.http.delete('http://'+ip+':3000/devices'+'/'+id).subscribe((result) => { console.log(result); });   
  }

  update() : void {
    let id = '6670aa31c3f832a7a78c34d8';
    const device = {_id: id, name: 'updated device', type: 1, address: 161, channels: [{type: 9, defaultValue: 100}, {type: 10, defaultValue: 50}, {blabla: "asdfasdf"}], channelMultiplier: 3}
    this.http.put('http://'+ip+':3000/devices', {device: device}).subscribe((result) => { console.log(result); });   
  }

  get() : void {  
  this.http.get('http://'+ip+':3000/devices').subscribe((result) => { console.log(result); }); 
  }

  setChannel() : void {  
    let id = '6670aa31c3f832a7a78c34d8';
    this.http.put('http://'+ip+':3000/devices/'+id, {channel: 3, value: 0}).subscribe((result) => { console.log(result); }); 
  }

  addMh() : void {
    const device = { name: 'MovingHead', address: 193, blabla: "12342", channels: [{type: 1, defaultValue: 100}, {type: 2, defaultValue: 50}]}
    const mh = {_id: '6671f55d22a148bffcd84547', xOff: -400, yOff: -70, bla: 4, heightOff: 157, panOff: 1, tiltOff: 24, maxPan: 540, maxTilt: 240, home: {x: 27, y: 50, height: 10}, device: device};
    let data = {
      test: 100,
      mh: mh,
      other: "tester",
    }
   this.http.patch('http://'+ip+':3000/movingHeads', data).subscribe((result) => { console.log(result); });   
  }

  removeMh() : void {
    let id = '6671f55d22a148bffcd84547';
    this.http.delete('http://'+ip+':3000/movingHeads'+'/'+id).subscribe((result) => { console.log(result); });   
  }

  updateMh() : void {
    let id = '6671f55d22a148bffcd84547';
    const device = { address: 196, blabla: "12342", type: -1, channels: [{type: 1, defaultValue: 100}, {type: 2, defaultValue: 50}, {blabla: "asdfasdf"}, {}]}
    const mh = {_id: id, xOff: -40, yOff: -7, bla: 4, heightOff: 50, panOff: 1, tiltOff: 24, maxPan: 540, maxTilt: 240, home: {x: 27, y: 50, height: 10}, device: device};
    this.http.put('http://'+ip+':3000/movingHeads', {mh: mh}).subscribe((result) => { console.log(result); });   
  }

  getMh() : void {  
  this.http.get('http://'+ip+':3000/movingHeads').subscribe((result) => { console.log(result); }); 
  }

  setChannelMh() : void {  
    let id = '6671f55d22a148bffcd84547';
    this.http.put('http://'+ip+':3000/movingHeads/'+id, {channel: 3, value: 255}).subscribe((result) => { console.log(result); }); 
  }

  getPositions() : void {  
    this.http.get('http://'+ip+':3000/movingHeads/positions').subscribe((result) => { console.log(result); }); 
  }

  setPosition() : void {  
    let id = '6671f55d22a148bffcd84547';
    this.http.put('http://'+ip+':3000/movingHeads/position/'+id, {position: {x: 300, y: -200, height: 50, blabla: "asdfasdf"}}).subscribe((result) => { console.log(result); }); 
  }

  goHome() : void {
    let id = '6671f55d22a148bffcd84547';
    this.http.get('http://'+ip+':3000/movingHeads/home/'+id).subscribe((result) => { console.log(result); }); 
  }  

  setHome() : void {
    let id = '6671f55d22a148bffcd84547';
    this.http.put('http://'+ip+':3000/movingHeads/home/'+id, {position: {x: 20, y: -5, height: 10}}).subscribe((result) => { console.log(result); }); 
  }  
}