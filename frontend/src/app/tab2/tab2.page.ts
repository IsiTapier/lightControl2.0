import { HttpClient, HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  
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

}
