import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, Subject } from "rxjs";
import { handleError, ip } from "../database";

// TODO timings
const presetsFetchInterval = 1000;

export interface Position {
  x: number;
  y: number;
  height?: number;
}

@Injectable({
  providedIn: 'root'
})
export class PresetService {
  private presets: any; 
  private presetsStream = new Subject()

  constructor(private http: HttpClient) {
    this.fetchPresets();
  }

  // fetch presets every 10s
  private async fetchPresets() {
    await this.http.get('http://' + ip + ':3000/presets').pipe(catchError(handleError)).subscribe((data) => {
        this.presets = this.sort(data);
        this.presetsStream.next(this.presets);
    });

    setInterval(() => {
      this.http.get('http://' + ip + ':3000/presets').pipe(catchError(handleError)).subscribe((data) => {
        data = this.sort(data)
        if(JSON.stringify(data) === JSON.stringify(this.presets)) return;
        this.presets = data;
        this.presetsStream.next(this.presets);
      });
    }, presetsFetchInterval);
  }

  private sort(presets : any) : any {
    return presets.sort(function (a : any, b : any) {
      if (a.name < b.name)  return -1;
      if (a.name > b.name)  return  1;
                            return  0;
                              // TODO null all properties, which shouldn't cause rerender (Depends on what to show in settings)
    })//.map((preset : any) => ({...preset, x: 0, y: 0, height: 0, values: [], home: {}}));
  }

  // get positions as Observable
  public getPresets(): Observable<any> {
    return this.presetsStream.asObservable();
  }

  public activatePreset(presetId : string) {
    this.http.get('http://'+ip+':3000/presets'+'/'+presetId, { responseType: 'text' }).pipe(catchError(handleError)).subscribe((result) => { console.log(result); });
  }

  addPreset(preset : any) {
    this.http.patch('http://'+ip+':3000/presets/', {preset: preset}, { responseType: 'text' }).pipe(catchError(handleError)).subscribe((result) => { console.log(result); }); 
  }

  removePreset(presetId : string) {
    this.http.delete('http://'+ip+':3000/presets'+'/'+presetId, { responseType: 'text' }).pipe(catchError(handleError)).subscribe((result) => { console.log(result); });   
  }

  updatePreset(preset : any) {
    this.http.put('http://'+ip+':3000/presets', {preset: preset}, { responseType: 'text' }).pipe(catchError(handleError)).subscribe((result) => { console.log(result); });   
  }
}