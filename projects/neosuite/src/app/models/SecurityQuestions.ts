export class SecurityQuestionDTO {

    public id: number;
    public question: string;
    public questionCode: string;
    public enabled: boolean;



    public constructor() {
        this.question = null;
        this.questionCode = null;
        this.id = null;
    }

}