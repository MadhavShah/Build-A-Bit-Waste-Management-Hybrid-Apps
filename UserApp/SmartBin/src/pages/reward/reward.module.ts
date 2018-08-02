import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RewardPage } from './reward';

@NgModule({
  declarations: [
    RewardPage,
  ],
  imports: [
    IonicPageModule.forChild(RewardPage),
  ],
  entryComponents: [
    RewardPage
  ],
  exports: [
    RewardPage
  ]
})
export class RewardPageModule {}
