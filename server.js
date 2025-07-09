import express from 'express';
import multer from 'multer';
import dotenv from 'dotenv';
dotenv.config();
import pdfParse from 'pdf-parse';
import ollama from 'ollama';
import { ingestfile  } from './routes/ingest.js';
import { queryPrompt } from './routes/query.js';
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



//Endpoint : Upload PDF and ingest
app.post('/ingest', upload.single('file'), async(req,res) => {
  try {  
        const dataBuffer = req.file.buffer;
        const parsed = await pdfParse(dataBuffer);
        const result = await ingestfile(parsed.text);
        res.json(result)
  }catch (error) {
    console.error(error);
    res.status(500).json({error: 'failed to upload pdf'});
  }
})


//Endpoint : Ask a question
app.post('/query', async(req,res) => {
  try {

  const userPrompt = req.body.prompt;
  const result = await queryPrompt(userPrompt);
  res.json(result);
  }catch(error) {
    console.error(error);
    res.status(500).json({error: 'Failed to get response from Model'});
  }
})

app.listen(3022, () => console.log('RAG app running on http://localhost:3022'));
