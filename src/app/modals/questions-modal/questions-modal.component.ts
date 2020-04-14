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

  readonly delay;
  currentIndex: number;
  numRA: number;
  @Input() questions: Question[];

  constructor(private modalController: ModalController,
    private toastService: ToastService,
    private alertController: AlertController) {
    this.currentIndex = 0;
    this.numRA = 0;
    this.delay = 750;
  }

  public answer(value: string) {
    if (value === this.currentQuestion.RA) {
      this.numRA++;
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
      this.modalController.dismiss(
        {
          'finished': true,
          'numRA': this.numRA
        }
      );
    }, this.delay);
  }

  private nextQuestion() {
    setTimeout(() => {
      this.currentIndex++;
    }, this.delay);
  }

  public get currentQuestion() {
    return this.questions[this.currentIndex];
  }

  ngOnInit() {
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
                'finished': false,
                'numRA': this.numRA
              }
            );
          }
        }
      ]
    });

    await alert.present();
  }


}
