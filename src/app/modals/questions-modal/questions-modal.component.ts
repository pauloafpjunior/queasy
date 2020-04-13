import { Component, OnInit, Input } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { Question } from 'src/app/model/question';
import { ToastService, ToastMessageType } from 'src/app/services/toast.service';


@Component({
  selector: 'app-questions-modal',
  templateUrl: './questions-modal.component.html',
  styleUrls: ['./questions-modal.component.scss'],
})
export class QuestionsModalComponent implements OnInit {

  private currentIndex: number;
  @Input() private questions: Question[];

  constructor(private modalController: ModalController,
    private toastService: ToastService,
    private alertController: AlertController) {
    this.currentIndex = 0;
  }

  public answer(value: string) {
    console.log(value);
    if (value === this.currentQuestion.RA) {
      this.toastService.showMessage("Parabéns, você acertou!", ToastMessageType.SUCCESS);
    } else {
      this.toastService.showMessage("Ops, não foi dessa vez!", ToastMessageType.ERROR);
    }
    if (this.currentIndex < this.questions.length - 1) {
      this.nextQuestion();
    } else {
      this.finished();
    }
  }

  private finished() {
    setTimeout(() => {
      this.showQuestionnaireFinished();  
    }, 1000);
  }

  private nextQuestion() {
    setTimeout(() => {
      this.currentIndex++;
    }, 1000);
  }

  public get currentQuestion() {
    return this.questions[this.currentIndex];
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

  async showQuestionnaireFinished() {
    const alert = await this.alertController.create({
      header: 'Informação!',
      message: 'Você <strong>completou</strong> este quiz. Você acertou X de Y questões. Seu desempenho foi de X%',
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            this.modalController.dismiss(
              {
                'dismissed': true
              }
            );
          }
        }
      ]
    });

    await alert.present();
  }

}
