import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StagePage } from './stage.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import { NgxSliderModule } from '@angular-slider/ngx-slider'
import { StagePageRoutingModule } from './stage-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    StagePageRoutingModule,
    NgxSliderModule
  ],
  declarations: [StagePage]
})
export class StagePageModule {}
