import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PresetsPage } from './presets.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { PresetsPageRoutingModule } from './presets-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    PresetsPageRoutingModule
  ],
  declarations: [PresetsPage]
})
export class PresetsPageModule {}
