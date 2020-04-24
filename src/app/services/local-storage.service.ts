import { Injectable } from '@angular/core';
import { MyQuests } from '../model/my-quests';
import { Profile } from '../model/profile';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  private readonly STORAGE_KEY: string = "MY_QUESTS";
  private readonly PROFILE_KEY: string = "MY_PROFILE";

  constructor(private storage: Storage) { }

  async getMyQuests(): Promise<MyQuests[]> {
    return this.storage.get(this.STORAGE_KEY).then((val: any) => {
      return val ? val : [];
    });
  }

  async getMyProfile(): Promise<Profile> {
    return this.storage.get(this.PROFILE_KEY).then((val: any) => {
      return val ? val : 
      {
        numQuizzes: 0,
        numSharing: 0,
        num100percentage: 0,
        numTalents: 0
      };
    });
  }

  async getMyQuest(id: number): Promise<MyQuests> {
    return this.storage.get(this.STORAGE_KEY).then((val: MyQuests[]) => {
      if (!val) return null;
      return val.find(item => item.id == id);
    });
  }

  async updateQuest(value: MyQuests): Promise<any> {
    let lstMyQuests: MyQuests[] = await this.getMyQuests();
    lstMyQuests = lstMyQuests.map(item => item.id == value.id ? value : item);
    return this.storage.set(this.STORAGE_KEY, lstMyQuests);
  }

  async addQuest(value: MyQuests): Promise<any> {
    let lstMyQuests: MyQuests[] = await this.getMyQuests();
    lstMyQuests.push(value);
    return this.storage.set(this.STORAGE_KEY, lstMyQuests);
  }

  async saveProfile(value: Profile): Promise<any> {
    return this.storage.set(this.PROFILE_KEY, value);
  }
}
