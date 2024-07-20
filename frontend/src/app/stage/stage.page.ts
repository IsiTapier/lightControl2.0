import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import type { GestureDetail } from '@ionic/angular';
import { GestureController, IonCard, Platform } from '@ionic/angular';
import { Observable } from 'rxjs';
import { ip } from '../database';

// Definitons
const IMAGE_WIDTH = 964;
const IMAGE_HEIGHT = 460;
const STAGE_OFFSET_IMAGE = 405;
const SAAL_WIDTH = 1587.2;
const DOT_SCALE = 0.04;

@Component({
  selector: 'app-stage',
  templateUrl: 'stage.page.html',
  styleUrls: ['stage.page.scss']
})
export class StagePage {
  @ViewChild(IonCard, { read: ElementRef }) card: ElementRef<HTMLIonCardElement>;
  @ViewChild('debug', { read: ElementRef }) debug: ElementRef<HTMLParagraphElement>;
  // @ViewChild('test', { read: ElementRef }) test: ElementRef<HTMLIonContentElement>;
  @ViewChild('stage', { read: ElementRef}) stage: ElementRef<HTMLIonContentElement>;
  @ViewChild('mh', { read: ElementRef}) mh: ElementRef<HTMLIonFabElement>;
  
  scale : number;
  width : number;

  // height : number;

  x = 0;
  y = 0;

  activeMh : Element;

  mhs : Observable<any>;

  constructor(private el: ElementRef, private gestureCtrl: GestureController, private cdRef: ChangeDetectorRef, private platform: Platform, private http: HttpClient) {
    this.getMovings();
  }

  ngAfterViewInit() {
    // this.dragListener();
    this.clickListener();

    setTimeout(async() => {
      await this.mhs; 
      this.getScale();
      let movings = this.stage.nativeElement.children;
      for(let i = 0; i < movings.length; i++) {
        console.log("test");
        console.log(movings[i]);
        this.dragListener(movings[i]);
      }
    }, 0);   

    this.platform.resize.subscribe(async () => {
      this.getScale();
    });

  }

  public async getMovings() : Promise<void> {  
    console.log("Get MH Data");
    this.mhs = this.http.get('http://'+ip+':3000/movingHeads');

    // var movings = await this.mhs;
    console.log(await this.mhs);
  }

  private clickListener() {
    this.stage.nativeElement.addEventListener('click', (e: any) => {
      console.log(e);
      this.moveTo(this.activeMh.id, e.clientX, e.clientY);
    })
  }

  private dragListener(element: Element) {
    // let element = this.mh.nativeElement;
    console.log(element);
    element.addEventListener("touchmove", (e: any) => {
      // e.stopPropagation();
      console.log("drag detected");
      // e.preventDefault();
      this.activateMh(element);
      console.log('touchmove', e.touches ? e.touches[0].clientY : null, e);
      let currentX = e.touches[0].clientX;
      let currentY = e.touches[0].clientY;
      this.moveTo(element.id, currentX, currentY);
    }, false);

    // return;

    const gesture = this.gestureCtrl.create({
      // el: this.el.nativeElement.closest('ion-content'),
      el: element,
      onStart: () => this.onStart(element),
      onMove: (detail) => this.onMove(element, detail),
      onEnd: () => this.onEnd(element),
      gestureName: 'example',
    });

    gesture.enable(true);

  }

  private getScale() {
    let el = this.stage.nativeElement;
    let height = el.offsetHeight;
    this.width = el.offsetWidth;

    let size = this.width;
    if(this.width/height > IMAGE_WIDTH/IMAGE_HEIGHT)
      size = height/IMAGE_HEIGHT*IMAGE_WIDTH;

    this.scale = size;
  }

  public getDotSize() : number {
    return this.scale*DOT_SCALE;
  }

  public getDotX(x : number) : number {
    // console.log(id);
    // TODO get Position
    // let x = 0; 
    
    let marginLeft = (SAAL_WIDTH/2+x)/SAAL_WIDTH*this.scale;
    marginLeft -= this.getDotSize()/2; 
    marginLeft += (this.width-this.scale)/2;

    return marginLeft;
  }

  public getDotY(y: number) : number {
        // TODO get Position
        // let y = 667; 
        // let y = 0;
    
        let marginTop = (-y/SAAL_WIDTH*IMAGE_WIDTH+STAGE_OFFSET_IMAGE)/IMAGE_WIDTH*this.scale;
        marginTop -= this.getDotSize()/2; 

        return marginTop;
  }

  private onStart(element : Element) {
    // this.activeMh = element;

    this.cdRef.detectChanges();
    // element.classList.add('active');

    this.activateMh(element);
    // element.children[0].children[0].setAttribute('name', 'radio-button-on');
  }

  private onMove(element : Element, detail: GestureDetail) {
    const { type, currentX, currentY, deltaX, velocityX } = detail;
    this.moveTo(element.id, currentX, currentY);
  }

  private async moveTo(id : string, x : number, y : number) {
    console.log(id);
    let newX = (x-(this.width-this.scale)/2)/this.scale*SAAL_WIDTH-SAAL_WIDTH/2;
    // this.x = newX;
    let newY = -((y-56)/this.scale*IMAGE_WIDTH-STAGE_OFFSET_IMAGE)/IMAGE_WIDTH*SAAL_WIDTH;
    // this.y = newY;

    /*this.mhs.subscribe(movings => {
      movings.forEach(mh => {
        if(mh.mhId === id) {
          console.log("mh found");
          mh.x = x;
          mh.y = y;
        }
      });
    });*/
    await this.http.put('http://'+ip+':3000/movingHeads/position/'+id, {position: {x: newX, y: newY, /*height: 50*/}}).subscribe(); //.subscribe((result) => {/* console.log(result);*/ });
    this.getMovings();
  }

  private onEnd(element: Element) {
    element.classList.remove('active');
    this.cdRef.detectChanges();

    // this.activateMh(element);
    // element.children[0].children[0].setAttribute('name', 'radio-button-off');
  }

  public activateDot(event : any) {
    // event.stopPropagation();
    console.log(event);
    let target = event.target;
    let element;
    if(target.nodeName === "ION-FAB-BUTTON")
      element = target.children[0];
    else 
      element = target;
    this.activateMh(element.parentElement.parentElement);
    return;
    if(element.name === "radio-button-off")
      element.setAttribute('name', 'radio-button-on');
    else
      element.setAttribute('name', 'radio-button-off');
      this.activeMh = element;
  }

  private activateMh(element : Element) {
    this.activeMh = element;

    return;
    var mhs = this.stage.nativeElement.children;
    for (let i = 0; i < mhs.length; i++) {
      mhs[i].toggleAttribute("activemh", false);
      mhs[i].children[0].children[0].setAttribute('name', 'radio-button-off');
    }
    // element.classList.add('active');
    element.children[0].children[0].setAttribute('name', 'radio-button-on');
    element.toggleAttribute("activemh", true);
  }
}
