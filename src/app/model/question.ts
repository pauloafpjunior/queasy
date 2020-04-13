export interface Question {
    readonly id?: number;
    readonly question: string;
    readonly A: string;
    readonly B: string;
    readonly C?: string;
    readonly D?: string;
    readonly RA: string;
}