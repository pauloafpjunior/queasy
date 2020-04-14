import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Questionnaire } from '../model/questionnaire';
import 'rxjs/Rx';


@Injectable({
  providedIn: 'root'
})
export class QueasyApiService {

  private readonly API_URL: string = "https://queasy-app.firebaseio.com";

  constructor(private http: HttpClient) { }

  public getQuestionnaires(): Promise<Questionnaire[]> {
    return this.http.get<Questionnaire[]>(`${this.API_URL}/questionnaires.json`).toPromise();
  }

  public getQuestionnaire(id: number): Promise<Questionnaire> {
    return this.http.get<Questionnaire>(`${this.API_URL}/questionnaires/${id}.json`).toPromise();
  }
}
