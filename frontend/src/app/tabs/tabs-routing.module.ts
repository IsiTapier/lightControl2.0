import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'stage',
        loadChildren: () => import('../stage/stage.module').then(m => m.StagePageModule)
      },
      {
        path: 'presets',
        loadChildren: () => import('../presets/presets.module').then(m => m.PresetsPageModule)
      },
      {
        path: 'configure',
        loadChildren: () => import('../configure/configure.module').then(m => m.ConfigurePageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/stage',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/stage',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
