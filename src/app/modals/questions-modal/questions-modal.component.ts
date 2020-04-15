import { Component, OnInit, Input } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { Question } from 'src/app/model/question';
import { ToastService, ToastMessageType } from 'src/app/services/toast.service';
import { NativeAudio } from '@ionic-native/native-audio/ngx';

@Component({
  selector: 'app-questions-modal',
  templateUrl: './questions-modal.component.html',
  styleUrls: ['./questions-modal.component.scss'],
})
export class QuestionsModalComponent implements OnInit {

  readonly delay;
  currentIndex: number;
  numRA: number;

  a: boolean;
  b: boolean;
  c: boolean;
  d: boolean;

  @Input() questions: Question[];

  constructor(private modalController: ModalController,
    private nativeAudio: NativeAudio,
    private toastService: ToastService,
    private alertController: AlertController) {
    this.currentIndex = 0;
    this.numRA = 0;
    this.delay = 1500;

    this.a = true;
    this.b = true;
    this.c = true;
    this.d = true;
  }

  public answer(value: string) {
    this.a = false;
    this.b = false;
    this.c = false;
    this.d = false;

    if (value === this.currentQuestion.RA) {
      this.numRA++;
      this.nativeAudio.play('success');
      this.toastService.showMessage("Parabéns, você acertou!", ToastMessageType.SUCCESS);
    } else {
      this.nativeAudio.play('error');
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
      this.a = true;
      this.b = true;
      this.c = true;
      this.d = true;
    }, this.delay);
  }

  public get currentQuestion() {
    return this.questions[this.currentIndex];
  }

  async ngOnInit() {
    await this.nativeAudio.preloadSimple('success', 'assets/sounds/success.mp3');
    await this.nativeAudio.preloadSimple('error', 'assets/sounds/error.mp3');
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
