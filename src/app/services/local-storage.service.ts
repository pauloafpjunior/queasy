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
      const items: any[] = val ? val : [];
      return items;
    }
    );
  }

  async saveQuest(value: MyQuests): Promise<any> {
    let lstMyQuests: MyQuests[] = await this.getMyQuests();
    const found = lstMyQuests.find(item => item.id == value.id);
    if (found) {
      lstMyQuests = lstMyQuests.map(item => item.id == value.id && item.numRA < value.numRA ? value : item);
    } else {
      lstMyQuests.push(value);
    }
    return this.storage.set(this.STORAGE_KEY, lstMyQuests);
  }
}
