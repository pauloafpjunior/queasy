import { Component, OnInit } from '@angular/core';
import { QueasyApiService } from 'src/app/services/queasy-api.service';
import { Questionnaire } from 'src/app/model/questionnaire';
import { ToastService, ToastMessageType } from 'src/app/services/toast.service';
import { ActionSheetController, ModalController, LoadingController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { MyQuestsModalComponent } from 'src/app/modals/my-quests-modal/my-quests-modal.component';
import { MyQuests } from 'src/app/model/my-quests';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { NgNavigatorShareService } from 'ng-navigator-share';
import { Profile } from 'src/app/model/profile';
import { ProfileModalComponent } from 'src/app/modals/profile-modal/profile-modal.component';
import { QuestionsModalComponent } from 'src/app/modals/questions-modal/questions-modal.component';
import { Question } from 'src/app/model/question';
import { NativeAudio } from '@ionic-native/native-audio/ngx';

@Component({
  selector: 'app-quests',
  templateUrl: './quests.page.html',
  styleUrls: ['./quests.page.scss'],
})
export class QuestsPage implements OnInit {

  lstQuestionnaires: Questionnaire[];
  lstMyQuests: MyQuests[];
  myProfile: Profile;
  questions: Question[];
  practiceRateOfQuestions: number;

  private readonly APP_URL: string = "http://queasy-app.web.app";

  constructor(
    private queasyApiService: QueasyApiService,
    private localStorageService: LocalStorageService,
    private modalController: ModalController,
    private nativeAudio: NativeAudio,
    private toastService: ToastService,
    private ngNavigatorShareService: NgNavigatorShareService,
    private actionSheetController: ActionSheetController,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private router: Router) {
    this.questions = [];
    this.practiceRateOfQuestions = 0.3;
  }

  ngOnInit() { }

  async ionViewDidEnter() {
    const loading = await this.loadingController.create({
      message: 'Carregando...'
    });
    try {
      await loading.present();
      await this.nativeAudio.preloadSimple('finished', 'assets/sounds/finished.mp3');
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

  async showConfirmStartPractice() {
    const alert = await this.alertController.create({
      header: 'Atenção!',
      message: 'Deseja realmente iniciar um <strong>treino</strong>?',
      buttons: [
        {
          text: 'Não',
          role: 'cancel'
        }, {
          text: 'Sim',
          handler: () => {
            this.showQuestionsModal();
          }
        }
      ]
    });

    await alert.present();
  }

  public getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

  async showQuestionsModal() {
    // Create a list of random questions
    this.lstQuestionnaires.forEach((quest: Questionnaire) => {
      if (this.wasDone(quest.id)) {
        quest.questions.forEach((q: Question) => {
          this.questions.push(q);
        })
      }
    });

    let numOfQuestions = Math.floor(this.questions.length * this.practiceRateOfQuestions);
    let amountToRemove = this.questions.length - numOfQuestions;
    for (let i = 0; i < amountToRemove; i++) {
      let indexToRemove = this.getRandomInt(0, this.questions.length);
      this.questions.splice(indexToRemove, 1);
    }

    const modal = await this.modalController.create({
      component: QuestionsModalComponent,
      backdropDismiss: false,
      componentProps: {
        'questions': this.questions
      }
    });

    modal.onWillDismiss().then((value: any) => {
      if (value.data.finished) {
        this.showQuestionnaireFinished(value.data.numRA);
      }
    });

    return await modal.present();
  }

  private async saveProfile(numRA: number, numTalents: number) {
    this.myProfile.canPractice = false;
    if (numRA == this.questions.length) {
      this.myProfile.num100percentage++;
    }
    if (numTalents) {
      this.myProfile.numTalents += numTalents;
    }
    return this.localStorageService.saveProfile(this.myProfile);
  }

  private getTalents(numRA: number) {
    //const percentage = formatNumber((numRA / this.questionnaire.numQuest) * 100, this.locale, '1.0-0');
    const percentage: number = (numRA / this.questions.length) * 100;

    if (percentage == 0) return 0;
    else if (percentage < 60) return 5;
    else if (percentage < 80) return 10;
    else if (percentage < 100) return 15;
    else return 20;
  }

  async showQuestionnaireFinished(numRA: number) {
    const loading = await this.loadingController.create({
      message: 'Carregando...'
    });

    try {
      await loading.present();

      if (this.myProfile.isSoundOn) {
        this.nativeAudio.play('finished');
      }

      let msg = `Você <strong>completou</strong> este quiz e <strong>ganhou ${this.getTalents(numRA)} talentos</strong>.`;
      await this.saveProfile(numRA, this.getTalents(numRA));
      loading.dismiss();

      const alert = await this.alertController.create({
        header: 'Informação!',
        message: msg,
        buttons: [
          {
            text: 'Ok'
          }
        ]
      });

      await alert.present();
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
