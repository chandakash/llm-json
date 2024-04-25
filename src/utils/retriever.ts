import { RedisVectorStore } from '@langchain/redis';
import { OpenAIEmbeddings } from "@langchain/openai";
import { createClient as redisCreateClient} from "redis";

export const retriever = () => {
  const embeddings = new OpenAIEmbeddings({ openAIApiKey: process.env["OPENAI_API_KEY"] })

  const redisClient = redisCreateClient({
    url: process.env["REDIS_URL"] ?? "redis://localhost:6379",
  });
  
  const redisVectorStore = new RedisVectorStore(embeddings, {
    redisClient: redisClient,
    indexName: "docs",
  });
  
  return redisVectorStore.asRetriever()
}
