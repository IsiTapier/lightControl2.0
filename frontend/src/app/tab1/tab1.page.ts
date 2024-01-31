import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import type { GestureDetail } from '@ionic/angular';
import { GestureController, IonCard } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  @ViewChild(IonCard, { read: ElementRef }) card: ElementRef<HTMLIonCardElement>;
  @ViewChild('debug', { read: ElementRef }) debug: ElementRef<HTMLParagraphElement>;
  @ViewChild('test', { read: ElementRef }) test: ElementRef<HTMLParagraphElement>;

  isCardActive = false;

  constructor(private el: ElementRef, private gestureCtrl: GestureController, private cdRef: ChangeDetectorRef) {}
  ngAfterViewInit() {
    const gesture = this.gestureCtrl.create({
      // el: this.el.nativeElement.closest('ion-content'),
      el: this.test.nativeElement,
      onStart: () => this.onStart(),
      onMove: (detail) => this.onMove(detail),
      onEnd: () => this.onEnd(),
      gestureName: 'example',
    });

    gesture.enable(true);
  }

  private onStart() {
    this.isCardActive = true;
    this.cdRef.detectChanges();
  }

  private onMove(detail: GestureDetail) {
    const { type, currentX, currentY, deltaX, velocityX } = detail;
    this.debug.nativeElement.innerHTML = `
      <div>Type: ${type}</div>
      <div>Current X: ${currentX}</div>
      <div>Current Y: ${currentY}</div>
      <div>Delta X: ${deltaX}</div>
      <div>Velocity X: ${velocityX}</div>`;
  }

  private onEnd() {
    this.isCardActive = false;
    this.cdRef.detectChanges();
  }
}