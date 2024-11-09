import { HttpClient, HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { ip } from '../database';
import { PresetService } from './preset.service';
import { MovingHeadService } from '../stage/moving-head.service';

enum PresetMode {
  PRESETS = 'PRESETS',
  ADD = 'ADD',
  DELETE = 'DELETE',
  EDIT = 'EDIT',
  PREVIEW = 'PREVIEW'
};

@Component({
  selector: 'app-presets',
  templateUrl: 'presets.page.html',
  styleUrls: ['presets.page.scss']
})
export class PresetsPage {
  public presets : any;
  public mode : PresetMode = PresetMode.PRESETS;
  public selectedPresetId : string;
  public selectedPositions : any;
  public presetName : string;
  private previousPositions : any;
  
  constructor(private http: HttpClient, public presetService: PresetService, public mhService: MovingHeadService) {}
  
  ngAfterViewInit() {
    this.presetService.getPresets().subscribe((data) => { this.presets = data; console.log("Received new presets data: "); console.log(this.presets) });
  }

  ionViewWillLeave() {
    this.reset()
  }

  public toggleMode(modeName : string) {
    let toMode : PresetMode = PresetMode[modeName as keyof typeof PresetMode];
    if(this.mode === toMode) return this.reset();
    // todo maybe reset
    this.mode = toMode;
    
    if(toMode === PresetMode.ADD) { this.presetName = 'Preset '+(this.presets.length+1); return; }
  }

  public clickPreset(presetId : string) {
    switch(this.mode) {
      case PresetMode.PRESETS: this.presetService.activatePreset(presetId); return;
      case PresetMode.ADD: return;
      case PresetMode.DELETE: break;
      case PresetMode.EDIT: this.previousPositions = new Map(this.mhService.getPositions()); this.presetService.activatePreset(presetId); break;
      case PresetMode.PREVIEW: break;
    }
    // get preset data
    let preset = this.presets.find((preset : any) => { return preset.presetId === presetId; });
    let positions : Map<string, any> = new Map<string, any>();
    for(let [mhId, position] of Object.entries(preset.positions)) positions.set(mhId, position);
    this.selectedPresetId = presetId;
    this.selectedPositions = positions;
    this.presetName = preset.name;
  }

  onInput(ev : any) {
    this.presetName = ev.target!.value;
  }

  delete() {
    this.presetService.removePreset(this.selectedPresetId);
    this.reset();
  }

  reset() {
    this.mode=PresetMode.PRESETS;
    this.selectedPresetId = '';
    this.selectedPositions = undefined;
    this.presetName = '';
    // if previous positon saved, activate it
    if(this.previousPositions) {
      this.mhService.loadPositions(this.previousPositions, true)
      this.previousPositions = null;
    }
  }

  submit() {
    // check valid
    if(!this.presetName) return;
    let positions = this.mhService.getPresetPositions();
    if(positions.size < 1) return;
    // get return preset
    let preset = {_id: this.selectedPresetId || undefined, name: this.presetName, positions: Array.from(positions, ([id, position]) => ({[id]: position}))};
    // send http request
    if(this.mode === PresetMode.ADD)
      this.presetService.addPreset(preset);
    else if(this.mode === PresetMode.EDIT)
      this.presetService.updatePreset(preset);

    this.reset();
  }

  /*
  red() : void {
    console.log("test");  
   /* this.http.get('http://192.168.178.90:3000/', {responseType: 'text'}).subscribe({
      next: (v) => console.log(v),
      error: (e) => console.error(e),
      complete: () => console.info('complete')
  });
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

  addsPreset() {
    let positions = new Map();
    positions.set("6727c30c0bd3d403fddb6d52", {x: 20, y: -5, height: 10});
    // positions['6727c30c0bd3d403fddb6d52'] = {x: 20, y: -5, height: 10};
    console.log(positions);
    let data = {
      test: 100,
      preset: {name: ' ', positions: [1]},
      other: "tester",
    }
    this.http.patch('http://'+ip+':3000/presets/', data).subscribe((result) => { console.log(result); }); 
  }

  removesPreset() {
    let id = '6727f40de50ee2aa7b609d4e  ';
    this.http.delete('http://'+ip+':3000/presets'+'/'+id).subscribe((result) => { console.log(result); });   
  }

  updatesPreset() {
    let id = '6727cdff1dabd04f9c5572b9';
    const preset = {_id: id, positions: [{"6727c30c0bd3d3fddb6d52": {x: 100, y: -5, height: 10}}]};
    this.http.put('http://'+ip+':3000/presets', {preset: preset}).subscribe((result) => { console.log(result); });   
  }

  getsPreset() {
    this.http.get('http://'+ip+':3000/presets').subscribe((result) => { console.log(result); });
  }

  activatesPreset() {
    let id = '6727f40de50ee2aa7b609d4e  ';
    this.http.get('http://'+ip+':3000/presets'+'/'+id).subscribe((result) => { console.log(result); });
  }*/
}