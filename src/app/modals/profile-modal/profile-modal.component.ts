import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { Profile } from 'src/app/model/profile';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-profile-modal',
  templateUrl: './profile-modal.component.html',
  styleUrls: ['./profile-modal.component.scss'],
})
export class ProfileModalComponent implements OnInit {

  myProfile: Profile;

  constructor(private localStorageService: LocalStorageService,
    private modalController: ModalController,
  ) { }

  ngOnInit() {
  }

  async ionViewDidEnter() {
    this.myProfile = await this.localStorageService.getMyProfile();
  }

  public close() {
    this.modalController.dismiss();
  }


}
