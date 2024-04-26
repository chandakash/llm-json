import { RedisVectorStore } from '@langchain/redis';
import { OpenAIEmbeddings } from "@langchain/openai";
import { createClient as redisCreateClient} from "redis";

export const retriever = (redisClient: any) => {
  const embeddings = new OpenAIEmbeddings({ openAIApiKey: process.env["OPENAI_API_KEY"] });  
  const redisVectorStore = new RedisVectorStore(embeddings, {
    redisClient: redisClient,
    indexName: "docs",
  });
  
  return redisVectorStore.asRetriever()
}
