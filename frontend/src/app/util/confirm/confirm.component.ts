import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss'],
})
export class ConfirmComponent {
  @Input() text : string = 'Willst du fortfahren?';
  @Input() confirm : string = 'bestätigen';
  @Input() back : string = 'abbrechen';
  @Input() onConfirm : any = () => {};
  @Input() onBack : any = () => {};

  constructor() { }

}
