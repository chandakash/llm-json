import { ChatOpenAI } from '@langchain/openai';
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
  PromptTemplate,
} from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { Constants, explainExample, supported_operations } from 'src/constants';
import {
  RunnablePassthrough,
  RunnableSequence,
} from '@langchain/core/runnables';
import { traceable } from 'langsmith/traceable';
process.env['LANGCHAIN_TRACING_V2'] = Constants.LANGSMITH_TRACING_V2.toString();
process.env['LANGCHAIN_ENDPOINT'] = Constants.LANGSMITH_ENDPOINT;
process.env['LANGCHAIN_API_KEY'] = Constants.LANGSMITH_API_KEY;
import { RunnableWithMessageHistory } from '@langchain/core/runnables';
import { RedisChatMessageHistory } from '@langchain/community/stores/message/ioredis';
import { createClient as redisCreateClient } from 'redis';
import { combineDocuments } from './utils';
import { retriever } from './retriever';

const ANSWER_PROMPT = ChatPromptTemplate.fromMessages([
  [
    'system',
    `You are json-logic formula assistant, you need to provide user the json-logic formula, and there can be some feedback (if there exist user chat history) by user also on the last response you provided so you have to incorporate that as well.
    These are things you need to do while providing the formula,\n
    Rules:\n
    - Check whether {session_variables} is provided or not, if not just return 'session_variables is missing', this is session_variables object is the data on which we will apply the generated formula, 
    this is required because user will ask to create formula and ask to access some fields, or you might have to generate using some asked field.
    - You support only these operation, outside this we won't be able to create simple or compound formula: {supported_operations}
    - Based on User question: {question} we will be retrieving certain simple base examples as {context} which you can take help to understand the formula, based on user description.
    - you might have to create complex compound formula based on user description.
    Only provide output response with these fields 4, do not return any explanation or any extra information just an object with these 4 fields: 
      [
          formula: json_logic_formula which you will be creating,
          examples: minimum 3 examples using the operationInvolved to help user understand how the formula works ,
          formulaOutputType (boolean | value): output of json_logic_formula will be simple boolean or some value,
          operationInvolved: list of operation involved.
      ]`,
  ],
  new MessagesPlaceholder('history'),
  ['human', '{question}'],
]);

const nestedTrace = traceable(
  async (question: any, session_variables: any, sessionId: any) => {
    const redisClient = redisCreateClient({
      url: process.env['REDIS_URL'] ?? 'redis://localhost:6379',
    });
    const model = new ChatOpenAI({
      // modelName: 'gpt-4',
      modelName: 'gpt-3.5-turbo-0125',
      temperature: 0.7,
      openAIApiKey: process.env['OPENAI_API_KEY'],
    });

    await redisClient.connect();
    console.log('redis connection established');

    const standaloneQuestionTemplate =
      'Given a Question: {question}, return a standalone question';
    const standaloneQuestionPrompt = PromptTemplate.fromTemplate(
      standaloneQuestionTemplate,
    );
    const standaloneQuestionChain = standaloneQuestionPrompt
      .pipe(model)
      .pipe(new StringOutputParser());
    const standaloneResponse = await standaloneQuestionChain.invoke({
      question: question,
    });
    console.log({ standaloneResponse });
    const retrieverData = await retriever(redisClient).invoke(question);
    console.log({ retrieverData });

    const retrieverChain = RunnableSequence.from([
      (prevResult) => prevResult.original_input.question,
      retriever(redisClient),
      combineDocuments,
    ]);
    console.log('retrieverChain');
    const answerChain = ANSWER_PROMPT.pipe(model).pipe(
      new StringOutputParser(),
    );
    console.log('answerChain');
    const chain = RunnableSequence.from([
      {
        standalone_question: standaloneQuestionChain,
        original_input: new RunnablePassthrough(),
      },
      {
        context: retrieverChain,
        question: ({ original_input }) => original_input.question,
        supported_operations: ({ original_input }) =>
          original_input.supported_operations,
        example: ({ original_input }) => original_input.example,
        history: ({ original_input }) => original_input.history,
        session_variables: ({ original_input }) =>
          original_input.session_variables,
      },
      answerChain,
    ]);
    const chainWithHistory = new RunnableWithMessageHistory({
      runnable: chain,
      getMessageHistory: (sessionId) =>
        new RedisChatMessageHistory({
          sessionId,
          sessionTTL: 300,
          url: process.env['REDIS_URL'],
        }),
      inputMessagesKey: 'question',
      historyMessagesKey: 'history',
    });

    const result = await chainWithHistory.invoke(
      {
        question: question,
        supported_operations: JSON.stringify(supported_operations),
        example: JSON.stringify(explainExample),
        session_variables: JSON.stringify(session_variables),
      },
      {
        configurable: {
          sessionId: sessionId,
        },
      },
    );

    console.log({ result });
    await redisClient.disconnect();
    console.log('redis connection terminated');
    return result;
  },
);

export const chatWithMultiChainModel = async (
  question: string,
  session_variables: any,
  sessionId: string,
) => {
  const traceResponse = await nestedTrace(
    question,
    session_variables,
    sessionId,
  );
  console.log({ traceResponse });
  return traceResponse;
};
