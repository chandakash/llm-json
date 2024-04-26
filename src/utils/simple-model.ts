import { ChatOpenAI } from '@langchain/openai';
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { traceable } from 'langsmith/traceable';
import { Constants, explainExample, supported_operations } from 'src/constants';
process.env['LANGCHAIN_TRACING_V2'] = Constants.LANGSMITH_TRACING_V2;
process.env['LANGCHAIN_ENDPOINT'] = Constants.LANGSMITH_ENDPOINT;
process.env['LANGCHAIN_API_KEY'] = Constants.LANGSMITH_API_KEY; // Not able to use env for this
import { RunnableWithMessageHistory } from '@langchain/core/runnables';
import { RedisChatMessageHistory } from '@langchain/community/stores/message/ioredis';
import { inputRules } from '../stubs/inputRules';
import { createClient as redisCreateClient } from 'redis';

const ANSWER_PROMPT = ChatPromptTemplate.fromMessages([
  [
    'system',
    `You are assistant which provides json-logic formula.
    Understand these examples: {examples}, it will contain basic as well as complex formula, so try to understand how for different operations, based on a description and session_variables how it returns the formula, see session_variables in just and input data, you might have to use it's value.
    User will be asking a question you need to also understand provide these kind of json-logic formula, follow below rules while providing response.
    If there is previous conversation then user might want to made some change on the last response incorporate them and send the updated response accordingly.
    These are things you need to do while providing the formula,\n
    Rules:\n
    - Check whether session_variables: {session_variables} is provided or not, if not just return 'session_variables is missing', this is session_variables object is the data on which we will apply the generated formula, session_variable is just an input data, don't include it in response, use it's object value, 
    this is required because user will ask to create formula and ask to access some fields, or you might have to generate using some asked field.
    - You support only these operation, outside this we won't be able to create simple or compound formula: {supported_operations}
    Only provide output response with these fields 4, do not return any explanation or any extra information just an object with these 4 fields: 
      [
          formula: json_logic_formula which you will be creating, NOTE: don't include session_variables formula use it's value only,
          examples: minimum 3 examples using the operationInvolved to help user understand how the your formula works, return examples in this format : {explainExample},
          formulaOutputType (boolean | value): output of json_logic_formula will be simple boolean or some value,
          operationInvolved: list of operation involved.
          historyUsed: (true or false) whether you considered the history chat to compute the response.
      ]"`,
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

    const chain = ANSWER_PROMPT.pipe(model).pipe(new StringOutputParser());

    const chainWithHistory = new RunnableWithMessageHistory({
      runnable: chain,
      getMessageHistory: (sessionId) =>
        new RedisChatMessageHistory({
          sessionId,
          sessionTTL: 300, // in sec
          url: process.env['REDIS_URL'],
        }),

      inputMessagesKey: 'question',
      historyMessagesKey: 'history',
    });

    const result = await chainWithHistory.invoke(
      {
        question: question,
        examples: JSON.stringify(inputRules),
        supported_operations: supported_operations.toString(),
        session_variables: JSON.stringify(session_variables),
        explainExample: explainExample,
      },
      {
        configurable: {
          sessionId: sessionId,
        },
      },
    );

    console.log({ result });
    console.log('disconnected client successfully');
    await redisClient.disconnect();
    return result;
  },
);

export const chatWithModel = async (
  question: any,
  session_variables: any,
  sessionId: any,
) => {
  console.log({ question, session_variables, sessionId });
  const traceResponse = await nestedTrace(
    question,
    session_variables,
    sessionId,
  );
  console.log({ traceResponse });
  return traceResponse;
};
