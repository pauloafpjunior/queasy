import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Questionnaire } from '../model/questionnaire';
import 'rxjs/Rx';
import { Question } from '../model/question';

@Injectable({
  providedIn: 'root'
})
export class QueasyApiService {

  private readonly API_URL: string = "http://localhost:3000";

  constructor(private http: HttpClient) { }

  public getQuestionnaires(): Promise<Questionnaire[]> {
    return this.http.get<Questionnaire[]>(`${this.API_URL}/questionnaires`).toPromise();
  }

  public getQuestionnaire(id: number): Promise<Questionnaire> {
    return this.http.get<Questionnaire>(`${this.API_URL}/questionnaires/${id}?_embed=questions`).toPromise();
  }
}
