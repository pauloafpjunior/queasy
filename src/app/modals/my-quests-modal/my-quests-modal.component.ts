import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MyQuests } from 'src/app/model/my-quests';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-my-quests-modal',
  templateUrl: './my-quests-modal.component.html',
  styleUrls: ['./my-quests-modal.component.scss'],
})
export class MyQuestsModalComponent implements OnInit {

  lstMyQuests: MyQuests[];
  talents: number;

  constructor(private modalController: ModalController,
    private localStorageService: LocalStorageService) {
      this.talents = 0;
  }

  ngOnInit() { }

  async ionViewDidEnter() {
    this.lstMyQuests = await this.localStorageService.getMyQuests();
    this.lstMyQuests.forEach((item: MyQuests) => {
      this.talents = this.talents + item.talents;
    });
  }

  public close() {
    this.modalController.dismiss();
  }
}
