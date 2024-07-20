import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { ip } from '../database';

@Component({
  selector: 'app-configure',
  templateUrl: 'configure.page.html',
  styleUrls: ['configure.page.scss']
})
export class ConfigurePage {
  devices : Observable<any>;

  constructor(private http: HttpClient) {
    // TODO fetch
    this.get();
  }

  async get() {
    // TODO types
    this.devices = this.http.get('http://'+ip+':3000/devices'); //.subscribe((result) => { console.log(result); this.devices = result; }); 
    console.log((await this.devices));
  }

  toggleSettings(event : any) {
    let deviceId = event.target.id.substring(0, 24);
    document.getElementById(deviceId)?.classList.toggle('visible');
  }

  delete(event : any) {
    let deviceId = event.target.id.substring(0, 24);
    this.http.delete('http://'+ip+':3000/devices'+'/'+deviceId).subscribe((result) => { console.log(result); this.get();});
  }
}
