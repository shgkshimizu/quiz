import React, { useState, useEffect, useRef, Fragment } from 'react';
import FlashcardList from './FlashcardList';
import './app.css';
import axios from 'axios';
import he from 'he';

function App() {

  const [flashcards, setFlashcards] = useState([]);
  const [categories, setCategories] = useState([]);
  const categoryEl = useRef();
  const amountEl = useRef();

  useEffect(() => {
    axios.get('https://opentdb.com/api.php?amount=10')
      .then(data => {
        setFlashcards(data.data.results.map((d, index) => {
          const answer = he.decode(d.correct_answer);
          const options = [...d.incorrect_answers.map(a => { return he.decode(a) }), answer];
          return {
            id: `${index}-${Date.now()}`,
            question: he.decode(d.question),
            answer: answer,
            options: options.sort(() => Math.random() - .5)
          }
        }));
      })
  }, flashcards)


  useEffect(() => {
    axios.get('https://opentdb.com/api_category.php')
      .then(res => {
        setCategories(res.data.trivia_categories);
      });
  }, [])

  function handleSubmit(e) {
    axios.get('https://opentdb.com/api.php?amount=10', {
      params: {
        amount: amountEl.current.value,
        category: categoryEl.current.value
      }
    })
      .then(data => {
        setFlashcards(data.data.results.map((d, index) => {
          const answer = d.correct_answer;
          const options = [...d.incorrect_answers.map(a => { return he.decode(a) }), he.decode(answer)];
          return {
            id: `${index}-${Date.now()}`,
            question: he.decode(d.question),
            answer: answer,
            options: options.sort(() => Math.random() - .5)
          }
        }));
      })
    e.preventDefault();
  }

  return (
    <Fragment>
      <form className='header' onSubmit={handleSubmit}>
        <div className='form-group'>
          <label htmlFor='category'>Category</label>
          <select id='category' ref={categoryEl}>
            {categories.map(category => {
              return <option value={category.id} key={category.id}>{category.name}</option>
            })}
          </select>
        </div>

        <div className='form-group'>
          <label htmlFor='amount'>Number of Questions</label>
          <input type='number' id='amount' min='1' step='1' defaultValue='10' max='30' ref={amountEl}></input>
        </div>

        <div className='form-group'>
          <button className='button'>Generate</button>
        </div>
      </form>
      <div className='container'>
        <FlashcardList flashcards={flashcards}></FlashcardList>
      </div>
    </Fragment>
  );
}

export default App;
