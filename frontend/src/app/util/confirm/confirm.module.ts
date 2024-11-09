import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { ConfirmComponent } from './confirm.component';

@NgModule({
  imports: [IonicModule],
  declarations: [ConfirmComponent],
  exports: [ConfirmComponent]
})
export class ConfirmModule {}
