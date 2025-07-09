
import { v4 as uuidv4 } from 'uuid';
import ollama from 'ollama';
import dotenv from 'dotenv';
dotenv.config();

import index from '../services/pinecone.js';

function chunkText(text, chunkSize = 500) {
  return text.match(/.{1,500}/g) || []; 
}

async function ingestfile(parsedFile) {
  try {  
    const chunks = chunkText(parsedFile);

    for (let i = 0; i < chunks.length; i++ ){
      const embedding = await ollama.embeddings({ model: 'mistral', prompt: chunks[i] });
      await index.upsert([
          {
            id: uuidv4(),
            values: embedding.embedding,
            metadata: { text: chunks[i] }
          }
        ]
      );
    }
   return { message: `Uploaded and indexed ${chunks.length} chunks.` };
  }catch (error) {
    console.error(error);   
  }
}

export { ingestfile };
