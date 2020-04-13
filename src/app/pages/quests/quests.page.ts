import { Component, OnInit } from '@angular/core';
import { QueasyApiService } from 'src/app/services/queasy-api.service';
import { Questionnaire } from 'src/app/model/questionnaire';
import { ToastService, ToastMessageType } from 'src/app/services/toast.service';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quests',
  templateUrl: './quests.page.html',
  styleUrls: ['./quests.page.scss'],
})
export class QuestsPage implements OnInit {

  private lstQuestionnaires: Questionnaire[];

  constructor(
    private queasyApiService: QueasyApiService,
    private toastService: ToastService,
    private actionSheetController: ActionSheetController, 
    private router: Router) { }

    ngOnInit() {}

    async ionViewDidEnter() {
    try {
      this.lstQuestionnaires = await this.queasyApiService.getQuestionnaires();
    } catch (error) {
      this.toastService.showMessage("Ops... algo deu errado! Tente novamente mais tarde",
        ToastMessageType.ERROR)
    }
  }

  async showActions(item: Questionnaire) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Ações',
      buttons: [
        {
          text: 'Responder',
          icon: 'create-outline',
          handler: () => {
            this.router.navigate(['/quests', item.id])
          }
        },
        {
          text: 'Compartilhar',
          icon: 'share-social-outline',
          handler: () => {
            // Compartilhar questionário
          }
        },
        {
          text: 'Cancelar',
          icon: 'close',
          role: 'cancel'
        }]
    });
    await actionSheet.present();
  }
}
