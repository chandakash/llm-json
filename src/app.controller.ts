import { Body, Controller, Get, Post } from '@nestjs/common';
import { AnySrvRecord } from 'dns';
import { AppService } from './app.service';

interface ChatRequestBody {
  question: string;
  session_variables: any; 
  sessionId: AnySrvRecord
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post("/simple-chat")
  async chatJsonLogic( @Body() body: ChatRequestBody) {
    const { question, session_variables, sessionId } = body;
    return this.appService.chatJsonLogic(question, session_variables, sessionId);
  }

  @Post("/multi-chain-chat")
  async chatWithMultiChainJsonLogic( @Body() body: ChatRequestBody) {
    const { question, session_variables, sessionId } = body;
    return this.appService.chatWithMultiChainJsonLogic(question, session_variables, sessionId);
  }
}
