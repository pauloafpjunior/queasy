import { Component, OnInit, LOCALE_ID, Inject } from '@angular/core';
import { Questionnaire } from 'src/app/model/questionnaire';
import { ModalController, AlertController, LoadingController } from '@ionic/angular';
import { QueasyApiService } from 'src/app/services/queasy-api.service';
import { ActivatedRoute } from '@angular/router';
import { QuestionsModalComponent } from 'src/app/modals/questions-modal/questions-modal.component';
import { MyQuests } from 'src/app/model/my-quests';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { ToastService, ToastMessageType } from 'src/app/services/toast.service';
import { formatNumber } from '@angular/common';
import { NativeAudio } from '@ionic-native/native-audio/ngx';

@Component({
  selector: 'app-attempts',
  templateUrl: './attempts.page.html',
  styleUrls: ['./attempts.page.scss'],
})
export class AttemptsPage implements OnInit {

  questionnaire: Questionnaire;
  myQuest: MyQuests;

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

  private async saveData(numRA: number) {
    if (this.myQuest.numRA < numRA) {
      this.myQuest.numRA = numRA;
      return this.localStorageService.updateQuest(this.myQuest);
    }
  }

  async showQuestionnaireFinished(numRA: number) {
    const loading = await this.loadingController.create({
      message: 'Carregando...'
    });

    try {
      await loading.present();
      await this.saveData(numRA);
      loading.dismiss();

      this.nativeAudio.play('finished');

      const percentage = formatNumber((numRA / this.questionnaire.numQuest) * 100, this.locale, '1.0-0');
      const alert = await this.alertController.create({
        header: 'Informação!',
        message: `Você <strong>completou</strong> este quiz e acertou ${numRA} de ${this.questionnaire.numQuest} questões. Seu desempenho é ${percentage}%.`,
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
