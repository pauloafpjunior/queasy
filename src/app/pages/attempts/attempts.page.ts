import { Component, OnInit } from '@angular/core';
import { Questionnaire } from 'src/app/model/questionnaire';
import { NavParams, ModalController, AlertController } from '@ionic/angular';
import { QueasyApiService } from 'src/app/services/queasy-api.service';
import { ActivatedRoute } from '@angular/router';
import { QuestionsModalComponent } from 'src/app/modals/questions-modal/questions-modal.component';
import { MyQuests } from 'src/app/model/my-quests';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { MyQuestsModalComponent } from 'src/app/modals/my-quests-modal/my-quests-modal.component';

@Component({
  selector: 'app-attempts',
  templateUrl: './attempts.page.html',
  styleUrls: ['./attempts.page.scss'],
})
export class AttemptsPage implements OnInit {

  private questionnaire: Questionnaire;
  private myQuest: MyQuests;

  constructor(private activatedRoute: ActivatedRoute,
    private queasyApiService: QueasyApiService,
    private localStorageService: LocalStorageService,
    private modalController: ModalController,
    private alertController: AlertController) { }

  async ngOnInit() {
    const questId: number = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    if (!questId) return;    
    
    this.questionnaire = await this.queasyApiService.getQuestionnaire(questId);
    if (!this.questionnaire) return;
    
    this.myQuest = await this.localStorageService.getMyQuest(questId);
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

  async showQuestionnaireFinished(numRA: number) {
    const percentage: number = (numRA / this.questionnaire.numQuest) * 100;
    if (!this.myQuest) {
      this.myQuest = {
        id: this.questionnaire.id,
        title: this.questionnaire.title,
        image: this.questionnaire.image,
        numQuest: this.questionnaire.numQuest,
        numRA: numRA,
        attempts: 1
      };
      await this.localStorageService.addQuest(this.myQuest);
    } else {
      this.myQuest.attempts++;
      this.myQuest.numRA = this.myQuest.numRA < numRA ? numRA : this.myQuest.numRA;
      await this.localStorageService.updateQuest(this.myQuest);
    }

    const alert = await this.alertController.create({
      header: 'Informação!',
      message: `Você <strong>completou</strong> este quiz e acertou ${numRA} de ${this.questionnaire.numQuest} questões. Seu desempenho foi de ${percentage}%!`,
      buttons: [
        {
          text: 'Ok'
        }
      ]
    });

    await alert.present();
  }

}
