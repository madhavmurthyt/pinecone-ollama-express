import dotenv from 'dotenv';
dotenv.config();

import ollama from 'ollama';
import { Pinecone } from '@pinecone-database/pinecone';

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY
});

const index = pinecone.index(process.env.PINECONE_INDEX_NAME);

// Function to perform the RAG query
async function queryRAG(userQuery) {
  
  try {
    console.log(`\n🔍 Generating embeddings for your query...`);
    const embeddingResponse = await ollama.embeddings({
      model: 'mistral',
      prompt: userQuery
    });

    const results = await index.query({
      vector: embeddingResponse.embedding,
      topK: 3,
      includeMetadata: true
    });
    

    const context = results.matches.map(match => match.metadata.text).join('\n\n');

    console.log(`\n📚 Retrieved Context:\n${context}`);

    const finalPrompt = `Use the following context to answer the user's question.\n\nContext:\n${context}\n\nUser Question: ${userQuery}`;

    const response = await ollama.chat({
      model: 'mistral',
      messages: [{ role: "user", content: finalPrompt }]
    });

    console.log(`\n🤖 AI Response:\n${response.message.content}`);

  } catch (error) {
    console.error("❌ Error during RAG query:", error);
  }
}

// 🔸 Replace this with any user query you want to test
// const userInput = "Does the document talk about AI or LLM?";
// queryRAG(userInput);
