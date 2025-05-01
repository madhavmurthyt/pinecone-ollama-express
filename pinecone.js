import axios from "axios";
import dotenv from 'dotenv';
dotenv.config();

const PINECONE_API_KEY = process.env.PINECONE_API_KEY;
const PINECONE_API_URL = process.env.PINECONE_API_URL;

const headers = {
  'Api-Key': PINECONE_API_KEY,
  'Content-Type': 'application/json',
};

async function queryPinecone(embedding) {
  // const url = `https://${PINECONE_INDEX}-${PINECONE_ENV}.svc.${PINECONE_ENV}.pinecone.io/query`;
const url = PINECONE_API_URL+'/query';
console.log(url);
  const response = await axios.post(
    url,
    {
      topK: 3,
      includeMetadata: true,
      vector: embedding,
    },
    { headers }
  );

  return response.data.matches;
}

export { queryPinecone };
