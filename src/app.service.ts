import { Injectable } from '@nestjs/common';
import { chatWithMultiChainModel } from './utils/multi-chain-model';
import { chatWithModel } from './utils/simple-model';

@Injectable()
export class AppService {
  chatJsonLogic(question: string, session_variables: any, sessionId: any): any {
    return chatWithModel(question, session_variables, sessionId);
  }

  chatWithMultiChainJsonLogic(question: string, session_variables: any, sessionId: any): any {
    return chatWithMultiChainModel(question, session_variables, sessionId);
  }
}
