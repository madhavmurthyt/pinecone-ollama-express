// pdf-ingest.js
import dotenv from 'dotenv';
dotenv.config();

import ollama from 'ollama';
import pdfParse from 'pdf-parse';
import { Pinecone } from '@pinecone-database/pinecone';
import fs from 'fs/promises';

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY
});

async function createIndexIfNeeded() {
  try {
    console.log("Checking index...");
    const indexes = await pinecone.listIndexes();
    const exists = indexes.indexes.some(i => i.name === process.env.PINECONE_INDEX_NAME);

    if (!exists) {
      await pinecone.createIndex({
        name: process.env.PINECONE_INDEX_NAME,
        dimension: 4096,
        metric: 'cosine',
        spec: {
          serverless: {
            cloud: 'aws',
            region: 'us-east-1'
          }
        }
      });
      console.log("Index created.");
    } else {
      console.log("Index already exists.");
    }
  } catch (err) {
    console.error("Index check/create failed:", err);
  }
}

async function ingestPDF(filePath) {
  await createIndexIfNeeded();
  const dataBuffer = await fs.readFile(filePath);
  const data = await pdfParse(dataBuffer);
  const textChunks = data.text.match(/.{1,500}/g);

  for (let i = 0; i < textChunks.length; i++) {
    const embedding = await ollama.embeddings({ model: 'mistral', prompt: textChunks[i] });
    await pinecone.index(process.env.PINECONE_INDEX_NAME).upsert([
      { 
        id: `chunk-${i}`, 
        values: embedding.embedding, 
        metadata: { text: textChunks[i] } 
      }
    ]);
  }

  console.log("✅ PDF content embedded & stored in Pinecone");
}

// // Example usage: pass PDF path from CLI or hardcode
// const pdfPath = process.argv[2] || 'test.pdf';
// ingestPDF(pdfPath);
