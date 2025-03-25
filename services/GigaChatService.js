import { Agent } from 'node:https';
import OpenAI from "openai";
import {addState, getState} from "@states/tobaccoStates";

export default class GigaChatService {
    /**
     * @type {OpenAI}
     * @private
     */
    _chat;

    constructor() {
        this.tobaccos = [
            {
                name: "DarkSide - Wildberry",
                strength: 3,
                sweetness: 5,
                freshness: 1,
                score: 8.5,
                comment: "Средний табак, курили 1 час, быстро подгорел"
            },
            {
                name: "Tangiers - Cane Mint",
                strength: 4,
                sweetness: 3,
                freshness: 5,
                score: 9.0,
                comment: "Очень тяжёлый? убил сразу. Нужно курить аккуратной, держит долго жар"
            },
            {
                name: "MustHave - Raspberry",
                strength: 2,
                sweetness: 4,
                freshness: 2,
                score: 7.8,
                comment: "Средний. Долго держит жар, Можно взять как основной табак для микса. В целом производитель этого табака среднячок"
            }
        ];
        this.initGigaChat()
    }

    initGigaChat() {
        this._chat = new OpenAI()
        const info = this.tobaccos.map(t => {
            return `${t.name} — крепость: ${t.strength}/5, сладость: ${t.sweetness}/5, свежесть: ${t.freshness}/5, оценка: ${t.score}`;
        }).join('\n');

        addState({
            role: 'user',
            content: `Я курил данные табака: ${info}`
        });
    }

    async suggestTobacco(text) {
        const systemPrompt = 'Ты мой кальянный ассистент. Я буду давать тебе табаки и оценку а ты запоминать. Когда попрошу что нибудь покурить то ищи из моего списка только';

        const body = {
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: systemPrompt
                },
                ...getState(),
                {
                    role: 'user',
                    content: text
                }
            ]
        };

        const res = await this._chat.chat.completions.create(body);
        const reply = res.choices[0].message.content;
        addState({role: 'user', content: text});
        addState({role: 'assistant', content: res.choices[0].message.content});
        return reply
    }
}