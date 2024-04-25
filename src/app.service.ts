import { Injectable } from '@nestjs/common';
import { chatWithModel } from './utils/simple-model';

@Injectable()
export class AppService {
  chatJsonLogic(question: string, session_variables: any, sessionId: any): any {
    return chatWithModel(question, session_variables, sessionId);
  }
}
