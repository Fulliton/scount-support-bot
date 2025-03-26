import Action from "@actions/Action";
import {Middleware} from "@decorators/Middleware";
import CheckSpeakStateMiddleware from "@middlewares/CheckSpeakStateMiddleware";
import Message from "@decorators/Message";

@Middleware(CheckSpeakStateMiddleware)
@Message()
export default class GenerateAudioAction extends Action {
    async handle(): Promise<void> {
        console.log('test')
    }

}