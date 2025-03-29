
export default class Answer {
    constructor(
        public text: string,
        public total_tokens: number,
        public assistant_id: string,
        public thread_id: string,
        public run_id: string
    ) {}
}