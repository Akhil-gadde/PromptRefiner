const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());




const genAI = new GoogleGenerativeAI('AIzaSyC9-2Qkz0VEQVl5TC999Pavm9Ki-rA4Jfw');

async function generateGeminiResponse(prompt) {
  const model = await genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}

app.post('/api/generateQuestion', async (req, res) => {  
   const { prompt } = req.body;
   console.log('Received prompt:', prompt);
  try {
    const questionPrompt = `Generate 3 brief and relevant follow-up questions that would help better understand and refine the following user prompt:\n"${prompt}"`;
    const output = await generateGeminiResponse(questionPrompt);
    const questions = output.split('\n').filter(q => q.trim()).slice(0, 4);
    res.json({ questions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate questions' });
  }
  
}
);

app.post('/api/refine-prompt', async (req, res) => {
  const { prompt, answers } = req.body;
  try {
    const refinePrompt = `Refine the following user prompt : \"${prompt}\"\nbased on the user's additional details:\n${answers.map((a, i) => `Q${i + 1}: ${a}`).join('\n')} and provide a single concide and clear prompt that incorporates the user's answers.`;
    const output = await generateGeminiResponse(refinePrompt);
    // const refinedOutput = output.split('\n').find(line => line.trim())?.trim() || '';
    res.json({ refinedPrompt: output });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to refine prompt' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});