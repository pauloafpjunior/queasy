import { Component, OnInit } from '@angular/core';
import { Questionnaire } from 'src/app/model/questionnaire';
import { NavParams, ModalController, AlertController } from '@ionic/angular';
import { QueasyApiService } from 'src/app/services/queasy-api.service';
import { ActivatedRoute } from '@angular/router';
import { QuestionsModalComponent } from 'src/app/modals/questions-modal/questions-modal.component';
import { MyQuests } from 'src/app/model/my-quests';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-attempts',
  templateUrl: './attempts.page.html',
  styleUrls: ['./attempts.page.scss'],
})
export class AttemptsPage implements OnInit {

  private questionnaire: Questionnaire;

  constructor(private activatedRoute: ActivatedRoute,
    private queasyApiService: QueasyApiService,
    private localStorageService: LocalStorageService,    
    private modalController: ModalController,
    private alertController: AlertController) { }

  async ngOnInit() {
    const questId = this.activatedRoute.snapshot.paramMap.get('id');
    this.questionnaire = await this.queasyApiService.getQuestionnaire(Number(questId));
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
    const myQuests: MyQuests = {
      id: this.questionnaire.id,
      title: this.questionnaire.title,
      image: this.questionnaire.image,
      numQuest: this.questionnaire.numQuest,
      numRA: numRA
    };   
    this.localStorageService.saveQuest(myQuests);

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
