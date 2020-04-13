import { Question} from './question'

export interface Questionnaire {
    readonly id?: number;
    readonly title: string;
    readonly image?: string;
    readonly desc?: string;
    readonly numQuest: number;
    readonly questions?: Question[];  
}