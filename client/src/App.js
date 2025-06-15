import { useState } from 'react';
import axios from 'axios';
import "./App.css"; // Assuming you have some basic styles in App.css


function App() {
  const [initialPrompt, setInitialPrompt] = useState('');
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [refinedPrompt, setRefinedPrompt] = useState('');

  const getQuestions = async () => {
    const res = await axios.post('http://localhost:5000/api/generateQuestion', { prompt: initialPrompt });
    setQuestions(res.data.questions);
    setAnswers(Array(res.data.questions.length).fill(''));
  };

  const submitAnswers = async () => {
    const res = await axios.post('http://localhost:5000/api/refine-prompt', {
      prompt: initialPrompt,
      answers,
    });
    setRefinedPrompt(res.data.refinedPrompt);
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="container"  style={{ maxWidth: 600 }}>
      <h1 className="text-center mt-5">🎯 Prompt Refiner</h1>

      {!questions.length && (
        <div className="d-flex mb-4">
          <textarea
            className="form-control mb-3"
            rows="4"
            placeholder="Enter your initial prompt..."
            value={initialPrompt}
            onChange={(e) => setInitialPrompt(e.target.value)}
          />
          <button
            className="btn btn-primary"
            onClick={getQuestions}
            disabled={!initialPrompt.trim()}
          >
            Generate Follow-up Questions
          </button>
        </div>
      )}

      {questions.length > 0 && refinedPrompt === '' && (
        <div className="mb-4">
          <h4 className="mb-3">📝 Answer the following questions:</h4>
          {questions.map((q, i) => (
            <div key={i} className="mb-3">
              <label className="form-label">{q}</label>
              <input
                type="text"
                className="form-control"
                placeholder="Your answer"
                value={answers[i]}
                onChange={(e) => {
                  const newAnswers = [...answers];
                  newAnswers[i] = e.target.value;
                  setAnswers(newAnswers);
                }}
              />
            </div>
          ))}
          <button
            className="btn btn-success"
            onClick={submitAnswers}
            disabled={answers.some(ans => ans.trim() === '')}
          >
            ✨ Refine Prompt
          </button>
        </div>
      )}

      {refinedPrompt && (
        <div>
          <h4 className="mb-3">🎉 Refined Prompt:</h4>
          <textarea
            className="form-control"
            rows="5"
            readOnly
            value={refinedPrompt}
          ></textarea>
        </div>
      )}
    </div>
    </div>
  );
}

export default App;