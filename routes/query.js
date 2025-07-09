import ollama from 'ollama';

import index from '../services/pinecone.js';

async function queryPrompt(userPrompt) {

 try {
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

  return { answer: response.message.content };
  }catch(error) {
    console.error(error);
  }
}

export {queryPrompt} ;