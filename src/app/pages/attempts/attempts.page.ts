import { Component, OnInit, LOCALE_ID, Inject } from '@angular/core';
import { Questionnaire } from 'src/app/model/questionnaire';
import { ModalController, AlertController, LoadingController } from '@ionic/angular';
import { QueasyApiService } from 'src/app/services/queasy-api.service';
import { ActivatedRoute } from '@angular/router';
import { QuestionsModalComponent } from 'src/app/modals/questions-modal/questions-modal.component';
import { MyQuests } from 'src/app/model/my-quests';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { ToastService, ToastMessageType } from 'src/app/services/toast.service';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { Profile } from 'src/app/model/profile';

@Component({
  selector: 'app-attempts',
  templateUrl: './attempts.page.html',
  styleUrls: ['./attempts.page.scss'],
})
export class AttemptsPage implements OnInit {

  questionnaire: Questionnaire;
  myQuest: MyQuests;
  myProfile: Profile;

  constructor(private activatedRoute: ActivatedRoute,
    @Inject(LOCALE_ID) private locale: string,
    private queasyApiService: QueasyApiService,
    private localStorageService: LocalStorageService,
    private toastService: ToastService,
    private modalController: ModalController,
    private loadingController: LoadingController,
    private nativeAudio: NativeAudio,
    private alertController: AlertController) { }

  ngOnInit() { }

  async ionViewDidEnter() {
    const loading = await this.loadingController.create({
      message: 'Carregando...'
    });

    try {
      await loading.present();

      await this.nativeAudio.preloadSimple('finished', 'assets/sounds/finished.mp3');
      const questId: number = Number(this.activatedRoute.snapshot.paramMap.get('id'));
      this.questionnaire = await this.queasyApiService.getQuestionnaire(questId);
      this.myQuest = await this.localStorageService.getMyQuest(questId);
      this.myProfile = await this.localStorageService.getMyProfile();
      loading.dismiss();
    } catch (error) {
      loading.dismiss();
      this.toastService.showMessage("Ops... algo deu errado! Tente novamente mais tarde",
        ToastMessageType.ERROR)
    }
  }

  async showQuestionsModal() {
    const modal = await this.modalController.create({
      component: QuestionsModalComponent,
      backdropDismiss: false,
      componentProps: {
        'questions': this.questionnaire.questions
      }
    });

    modal.onWillDismiss().then((value: any) => {
      if (value.data.finished) {
        this.showQuestionnaireFinished(value.data.numRA);
      }
    });

    return await modal.present();
  }

  private async saveAttempt() {
    if (!this.myQuest) {
      this.myQuest = {
        id: this.questionnaire.id,
        title: this.questionnaire.title,
        image: this.questionnaire.image,
        numQuest: this.questionnaire.numQuest,
        numRA: 0,
        attempts: 1
      };
      return this.localStorageService.addQuest(this.myQuest);
    } else {
      this.myQuest.attempts += 1;
      return this.localStorageService.updateQuest(this.myQuest);
    }
  }

  private getTalents(numRA: number) {
    //const percentage = formatNumber((numRA / this.questionnaire.numQuest) * 100, this.locale, '1.0-0');
    const percentage: number = (numRA / this.questionnaire.numQuest) * 100;

    if (percentage == 0) return 0;
    else if (percentage < 60) return 5;
    else if (percentage < 80) return 10;
    else if (percentage < 100) return 15;
    else return 20;
  }

  private async saveData(numRA: number) {
    if (this.myQuest.numRA < numRA) {
      this.myQuest.numRA = numRA;
    }

    return this.localStorageService.updateQuest(this.myQuest);
  }

  private async saveProfile(numRA: number, numTalents?: number) {
    this.myProfile.canPractice = true;
    this.myProfile.numQuizzes++;
    if (numRA == this.questionnaire.numQuest) {
      this.myProfile.num100percentage++;
    }
    if (numTalents) {
      this.myProfile.numTalents += numTalents;
    }
    return this.localStorageService.saveProfile(this.myProfile);
  }

  async showQuestionnaireFinished(numRA: number) {
    const loading = await this.loadingController.create({
      message: 'Carregando...'
    });

    try {
      await loading.present();
      await this.saveData(numRA);
      loading.dismiss();

      if (this.myProfile.isSoundOn) {
        this.nativeAudio.play('finished');
      }

      let msg: string;
      msg = `Você <strong>completou</strong> este quiz e acertou ${numRA} de ${this.questionnaire.numQuest} questões.`;

      if (this.myQuest.attempts == 1) {
        msg = msg + `Você <strong>ganhou ${this.getTalents(numRA)} talentos</strong>.`;
        await this.saveProfile(numRA, this.getTalents(numRA));
      } else {
        await this.saveProfile(numRA);
      }

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


  async showConfirmStart() {
    const alert = await this.alertController.create({
      header: 'Atenção!',
      message: 'Deseja realmente iniciar uma <strong>tentativa</strong> para este quiz?',
      buttons: [
        {
          text: 'Não',
          role: 'cancel'
        }, {
          text: 'Sim',
          handler: async () => {
            await this.saveAttempt();
            this.showQuestionsModal();
          }
        }
      ]
    });

    await alert.present();
  }

}
