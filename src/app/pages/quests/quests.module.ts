import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { QuestsPageRoutingModule } from './quests-routing.module';

import { QuestsPage } from './quests.page';
import { MyQuestsModalComponent } from '../../modals/my-quests-modal/my-quests-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    QuestsPageRoutingModule
  ],
  declarations: [QuestsPage, MyQuestsModalComponent],
  entryComponents: [MyQuestsModalComponent]
})
export class QuestsPageModule {}
