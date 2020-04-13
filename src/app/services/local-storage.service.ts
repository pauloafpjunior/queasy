import { Injectable } from '@angular/core';
import { MyQuests } from '../model/my-quests';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  private readonly STORAGE_KEY: string = "MY_QUESTS";

  constructor(private storage: Storage) { }

  async getMyQuests(): Promise<MyQuests[]> {
    return this.storage.get(this.STORAGE_KEY).then((val: any) => {
      return val ? val : [];
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
    lstMyQuests = lstMyQuests.map(item => item.id == value.id && item.numRA < value.numRA ? value : item);
    return this.storage.set(this.STORAGE_KEY, lstMyQuests);
  }

  async addQuest(value: MyQuests): Promise<any> {
    let lstMyQuests: MyQuests[] = await this.getMyQuests();
    lstMyQuests.push(value);
    return this.storage.set(this.STORAGE_KEY, lstMyQuests);
  }

}
