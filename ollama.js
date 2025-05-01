import ollama from 'ollama';

async function callOllama(prompt) {
//   return new Promise((resolve, reject) => {
//     exec(`ollama run llama2 "${prompt}"`, (err, stdout, stderr) => {
//       if (err || stderr) return reject(err || stderr);
//       resolve(stdout.trim());
//     });
//   });

const response = await ollama.chat({
    model: 'llama2',
    messages: [{role: 'user', content: prompt}],
  });

 return response.message.content;
}

export { callOllama };
