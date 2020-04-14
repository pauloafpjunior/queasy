import { Component, OnInit } from '@angular/core';
import { QueasyApiService } from 'src/app/services/queasy-api.service';
import { Questionnaire } from 'src/app/model/questionnaire';
import { ToastService, ToastMessageType } from 'src/app/services/toast.service';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { MyQuestsModalComponent } from 'src/app/modals/my-quests-modal/my-quests-modal.component';
import { MyQuests } from 'src/app/model/my-quests';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-quests',
  templateUrl: './quests.page.html',
  styleUrls: ['./quests.page.scss'],
})
export class QuestsPage implements OnInit {

  lstQuestionnaires: Questionnaire[];
  lstMyQuests: MyQuests[];

  constructor(
    private queasyApiService: QueasyApiService,
    private localStorageService: LocalStorageService,
    private modalController: ModalController,
    private toastService: ToastService,
    private actionSheetController: ActionSheetController,
    private router: Router) { }

  ngOnInit() { }

  async ionViewDidEnter() {
    try {
      this.lstQuestionnaires = await this.queasyApiService.getQuestionnaires();
      this.lstMyQuests = await this.localStorageService.getMyQuests();
    } catch (error) {
      this.toastService.showMessage("Ops... algo deu errado! Tente novamente mais tarde",
        ToastMessageType.ERROR)
    }
  }

  public wasDone(id: number) {
    if (!this.lstMyQuests) return false;
    return this.lstMyQuests.find(item => item.id == id) ? true : false;
  }

  async showMyQuestsModal() {
    const modal = await this.modalController.create({
      component: MyQuestsModalComponent,
      backdropDismiss: false
    });

    return await modal.present();
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
