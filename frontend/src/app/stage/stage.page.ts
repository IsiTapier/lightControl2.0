import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import type { GestureDetail } from '@ionic/angular';
import { GestureController, Platform } from '@ionic/angular';
import { MovingHeadService } from './moving-head.service';

// Definitons
const IMAGE_WIDTH = 964;
const IMAGE_HEIGHT = 460;
const STAGE_OFFSET_IMAGE = 405;
const SAAL_WIDTH = 1587.2;
const DOT_SCALE = 0.04;

const LOADING_TIMEOUT = 2;

// TODO : Cach service, which receives every 100ms if no change and updates every 10ms if change

// TODO height
// TODO MH select buttons
// TODO check why touch move doesn't work when not yet activated
// TODO icons offline

@Component({
  selector: 'app-stage',
  templateUrl: 'stage.page.html',
  styleUrls: ['stage.page.scss'],
})
export class StagePage {
  @ViewChild('stage', { read: ElementRef}) stage: ElementRef<HTMLIonContentElement>;
  @ViewChild('header', { read: ElementRef}) header: ElementRef<HTMLIonHeaderElement>;
  
  scale : number;
  width : number;

  activeMh : any;

  public mhs : any;
  private lastMhsAmount : number = 0;

  constructor(private el: ElementRef, private gestureCtrl: GestureController, private cdRef: ChangeDetectorRef, private platform: Platform, public mhService : MovingHeadService) {}

  ngAfterViewInit() {  
    // listen to window resize
    this.platform.resize.subscribe(async () => {
      this.getScale();
    });
    
    // listen to updated mh positions
    this.mhService.getMovings().subscribe((data) => { this.mhs = data; console.log("Received new mh data: "); console.log(this.mhs) });

    // enable click Listener 
    this.clickListener();

    // enable drag/move Listener when new mhs are added
    this.mhService.getMovings().subscribe(async (mhs) => {
      if(mhs.length === this.lastMhsAmount) return;
      this.lastMhsAmount = mhs.length;
      console.log("Moving Head Amount changed to: "+mhs.length);
      
      // TODO proper execution when ready
      setTimeout(() => {
        this.cdRef.detectChanges();

        // calculate scale
        this.getScale();

        let movings = this.stage.nativeElement.children;
        if(movings.length !== this.lastMhsAmount) console.log("ERROR: Found unexpected amount of MH Icons!");

        // add drag/move listener to every mh
        for(let i = 0; i < movings.length; i++) {
          // console.log(movings[i]);
          this.dragListener(movings[i]);
        }
      }, LOADING_TIMEOUT); 
    });    
  }

  // window click listener
  private clickListener() {
    this.stage.nativeElement.addEventListener('click', (e: any) => {
      if(!this.activeMh) return;
      // console.log(e)
      if(e.target.nodeName !== 'ION-CONTENT') return;
      this.moveTo(this.activeMh.id, e.clientX, e.clientY);
    })
  }

  // mh button drag listener
  private dragListener(element: Element) {
    console.log("Enable Draglistener for " +element.id);

    // touch move
    element.addEventListener("touchmove", (e: any) => {
      if(this.activeMh !== element) this.activateMh(element);
      if(!e.touches) return;

      // console.log('touchmove', e.touches ? e.touches[0].clientY : null, e);
      this.moveTo(element.id, e.touches[0].clientX, e.touches[0].clientY);
    }, true);

    // mouse move
    const gesture = this.gestureCtrl.create({
      el: element,
      threshold: 0,
      gesturePriority: 10,
      onStart: () => this.onStart(element),
      onMove: (detail) => this.onMove(element, detail),
      onEnd: () => this.onEnd(element),
      gestureName: 'Mouse Move',
    });
    gesture.enable(true);
  }

  // calculate dot scale
  private getScale() {
    let el = this.stage.nativeElement;
    let height = el.clientHeight;
    // return when view not enabled
    if(height === 0) return;
    this.width = el.clientWidth;

    let size = this.width;
    // enforce minimum aspect ratio
    if(this.width/height > IMAGE_WIDTH/IMAGE_HEIGHT)
      size = height/IMAGE_HEIGHT*IMAGE_WIDTH;

    this.scale = size;
  }

  private onStart(element : Element) {
    console.log("test")
    this.cdRef.detectChanges();
    this.activateMh(element);
  }

  private onMove(element : Element, detail: GestureDetail) {
    const { currentX, currentY } = detail;
    this.cdRef.detectChanges();
    this.moveTo(element.id, currentX, currentY);
  }

  private onEnd(element: Element) {
    this.cdRef.detectChanges();
  }

  private moveTo(id : string, _x : number, _y : number) {
    let newX = (_x-(this.width-this.scale)/2)/this.scale*SAAL_WIDTH-SAAL_WIDTH/2;
    let newY = -((_y-this.header.nativeElement.offsetHeight)/this.scale*IMAGE_WIDTH-STAGE_OFFSET_IMAGE)/IMAGE_WIDTH*SAAL_WIDTH;
    
    this.mhService.setPosition(id, newX, newY);
  }

  public activateMh(element : Element, allowDisable : boolean = false) {
    if(allowDisable && this.activeMh && this.activeMh.id === element.id) this.activeMh = undefined;
    else this.activeMh = element;
    console.log("activated mh "+element.id)
  }

  public getMhById(id : string) {
    let element = (<HTMLIonButtonElement>document.getElementById(id));
    return element;
  }

  public activateDot(event : any) {
    let target = event.target;
    let element;
    if(target.nodeName === "ION-FAB-BUTTON")
      element = target.children[0];
    else 
      element = target;
    this.activateMh(element.parentElement.parentElement);
  }
  
  // TODO function gets called very often
  public getDotSize() : number {
    // console.log(this.scale*DOT_SCALE);
    return this.scale*DOT_SCALE;
  }

  // calculate x position on screen
  public getDotX(x : number) : number {
    let marginLeft = (SAAL_WIDTH/2+x)/SAAL_WIDTH*this.scale;
    marginLeft -= this.getDotSize()/2; 
    marginLeft += (this.width-this.scale)/2;

    return marginLeft;
  }

  // calculate y position on screen
  public getDotY(y: number) : number {
    let marginTop = (-y/SAAL_WIDTH*IMAGE_WIDTH+STAGE_OFFSET_IMAGE)/IMAGE_WIDTH*this.scale;
    marginTop -= this.getDotSize()/2; 

    return marginTop;
  }

  // set home
  public setHome() {
    this.mhService.setHome(this.activeMh.id);
  }

  // drive to home
  public home() {
    this.mhService.home();
  }
}