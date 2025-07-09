import axios from 'axios';

async function getEmbedding(text) {

 try {
  const response = await axios.post(
    'https://api.openai.com/v1/embeddings',
    {
      input: text,
      model: 'text-embedding-ada-002',
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
    }
  );

  return response.data.data[0].embedding;
 }catch(e) {
    console.log(e.text);
 }
}
export { getEmbedding };
