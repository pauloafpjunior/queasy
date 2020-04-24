import { Component, OnInit } from '@angular/core';
import { QueasyApiService } from 'src/app/services/queasy-api.service';
import { Questionnaire } from 'src/app/model/questionnaire';
import { ToastService, ToastMessageType } from 'src/app/services/toast.service';
import { ActionSheetController, ModalController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { MyQuestsModalComponent } from 'src/app/modals/my-quests-modal/my-quests-modal.component';
import { MyQuests } from 'src/app/model/my-quests';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { NgNavigatorShareService } from 'ng-navigator-share';
import { Profile } from 'src/app/model/profile';
import { ProfileModalComponent } from 'src/app/modals/profile-modal/profile-modal.component';

@Component({
  selector: 'app-quests',
  templateUrl: './quests.page.html',
  styleUrls: ['./quests.page.scss'],
})
export class QuestsPage implements OnInit {

  lstQuestionnaires: Questionnaire[];
  lstMyQuests: MyQuests[];
  myProfile: Profile;

  private readonly APP_URL: string = "http://queasy-app.web.app";

  constructor(
    private queasyApiService: QueasyApiService,
    private localStorageService: LocalStorageService,
    private modalController: ModalController,
    private toastService: ToastService,
    private ngNavigatorShareService: NgNavigatorShareService,
    private actionSheetController: ActionSheetController,
    private loadingController: LoadingController,
    private router: Router) { }

  ngOnInit() { }

  async ionViewDidEnter() {
    const loading = await this.loadingController.create({
      message: 'Carregando...'
    });
    try {
      await loading.present();
      this.lstQuestionnaires = await this.queasyApiService.getQuestionnaires();
      this.lstMyQuests = await this.localStorageService.getMyQuests();
      this.myProfile = await this.localStorageService.getMyProfile();

      loading.dismiss();
    } catch (error) {
      loading.dismiss();
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

  async showProfileModal() {
    const modal = await this.modalController.create({
      component: ProfileModalComponent,
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
          icon: 'arrow-redo-outline',
          handler: async () => {
            try {
              const sharedResponse = await this.ngNavigatorShareService.share({
                title: 'Queasy',
                text: `Venha realizar o quiz: ${item.title}`,
                url: `${this.APP_URL}/quests/${item.id}`
              });
              this.myProfile.numSharing++;
              await this.localStorageService.saveProfile(this.myProfile);
            } catch (error) {
              this.toastService.showMessage("Não foi possível compartilhar este quiz",
                ToastMessageType.ERROR);
            }
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
