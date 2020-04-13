import { Component, OnInit } from '@angular/core';
import { Questionnaire } from 'src/app/model/questionnaire';
import { NavParams, ModalController } from '@ionic/angular';
import { QueasyApiService } from 'src/app/services/queasy-api.service';
import { ActivatedRoute } from '@angular/router';
import { QuestionsModalComponent } from 'src/app/modals/questions-modal/questions-modal.component';

@Component({
  selector: 'app-attempts',
  templateUrl: './attempts.page.html',
  styleUrls: ['./attempts.page.scss'],
})
export class AttemptsPage implements OnInit {

  private questionnaire: Questionnaire;

  constructor(private activatedRoute: ActivatedRoute,
    private queasyApiService: QueasyApiService,
    private modalController: ModalController) { }

  async ngOnInit() {
    const questId = this.activatedRoute.snapshot.paramMap.get('id');
    this.questionnaire = await this.queasyApiService.getQuestionnaire(Number(questId));
    console.log(this.questionnaire);
  }

  async showQuestionsModal() {
    const modal = await this.modalController.create({
      component: QuestionsModalComponent,
      backdropDismiss: false,
      componentProps: {
        'questions': this.questionnaire.questions
      }
    });
    return await modal.present();
  }


}
