import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AttemptsPageRoutingModule } from './attempts-routing.module';

import { AttemptsPage } from './attempts.page';
import { QuestionsModalComponent } from 'src/app/modals/questions-modal/questions-modal.component';
import { SafeStylePipe } from 'src/app/pipes/safe-style.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AttemptsPageRoutingModule
  ],
  declarations: [AttemptsPage, QuestionsModalComponent, SafeStylePipe],
  entryComponents: [QuestionsModalComponent]
})
export class AttemptsPageModule {}
