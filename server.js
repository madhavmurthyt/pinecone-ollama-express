import express from 'express';
import multer from 'multer';
import pdfParse from 'pdf-parse';
import dotenv from 'dotenv';
dotenv.config();

import ollama from 'ollama';
import { Pinecone } from '@pinecone-database/pinecone';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const upload = multer();
app.use(express.json());
app.get('/', async(req,res) => {
    res.json(200);
})

app.post('/ask', async (req, res) => {
  // const userPrompt = req.body.prompt;

  // const embedding = await getEmbedding(userPrompt);
  // console.log("This the embedding ", JSON.stringify(embedding));
  // const contextResults = await queryPinecone(embedding);

  // const context = contextResults.map(match => match.metadata.text).join('\n');
  // console.log('Context ', context);
  // const finalPrompt = `Use this context:\n${context}\n\nQuestion: ${userPrompt}`;

  // const answer = await callOllama(finalPrompt);
  // res.json({ answer });
});

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
  
});
const index = pinecone.index(process.env.PINECONE_INDEX_NAME);

function chunkText(text, chunkSize = 500) {
  return text.match(/.{1,500}/g) || [];
}


//Endpoint : Upload PDF and ingest
app.post('/uploadFile', upload.single('file'), async(req,res) => {
  try {  
    const dataBuffer = req.file.buffer;
    const parsed = await pdfParse(dataBuffer);
    const chunks = chunkText(parsed.text);

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
    res.json({ message: `Uploaded and indexed ${chunks.length} chunks.` })
  }catch (error) {
    console.error(error);
    res.status(500).json({error: 'failed to upload pdf'});
  }
})


//Endpoint : Ask a question
app.post('/query', async(req,res) => {
  try {
  const userPrompt = req.body.prompt;
  const embeddingResponse = await ollama.embeddings(
    {
      model: 'mistral', 
      prompt: userPrompt
    }
  );
  
  const results = await index.query({
    vector: embeddingResponse.embedding,
    topK: 3,
    includeMetadata: true
  });

  const context = results.matches.map(match => match.metadata.text).join('\n');
  console.log('Context ', context);
  const finalPrompt = `Use this context:\n${context}\n\nQuestion: ${userPrompt}`;

  const response = await ollama.chat({
    model: 'mistral',
    messages: [{ role: 'user', content: finalPrompt }]
  });

  res.json({ answer: response.message.content });
  }catch(error) {
    console.error(error);
    res.status(500).json({error: 'Failed to get response from Model'});
  }
})

app.listen(3022, () => console.log('RAG app running on http://localhost:3022'));
