import { Component, OnInit, Input } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { Question } from 'src/app/model/question';


@Component({
  selector: 'app-questions-modal',
  templateUrl: './questions-modal.component.html',
  styleUrls: ['./questions-modal.component.scss'],
})
export class QuestionsModalComponent implements OnInit {

  private currentQuestion: number;
  @Input() private questions: Question[];

  constructor(private modalController: ModalController,
    private alertController: AlertController) {
    this.currentQuestion = 0;
  }

  ngOnInit() {
    console.log(this.questions);
  }

  async showConfirmClose() {
    const alert = await this.alertController.create({
      header: 'Atenção!',
      message: 'Deseja sair <strong>sem terminar</strong> este quiz?',
      buttons: [
        {
          text: 'Não',
          role: 'cancel'
        }, {
          text: 'Sim',
          handler: () => {
            this.modalController.dismiss(
              {
                'dismissed': false
              }
            );
          }
        }
      ]
    });

    await alert.present();
  }

}
