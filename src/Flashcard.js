import React, { useState, useEffect, useRef } from 'react'

export default function Flashcard({ flashcard }) {

    const [flip, setFlip] = useState(false);
    const [height, setHeight] = useState('initial');
    const frontEl = useRef();
    const backEl = useRef();

    useEffect(() => {
        setMaxHeight();
    }, [flashcard.question, flashcard.answer, flashcard.options]);

    useEffect(() => {
        window.addEventListener('resize', setMaxHeight);
        return () => window.removeEventListener('resize', setMaxHeight);
    }, []);


    function setMaxHeight() {
        const frontHeight = frontEl.current.getBoundingClientRect().height;
        const backHeight = backEl.current.getBoundingClientRect().height;
        setHeight(Math.max(frontHeight, backHeight, 100));
    }

    return (
        <div onClick={() => setFlip(!flip)}
            style={{ height: height }}
            className={`card ${flip ? 'flip' : ''}`}>
            <div className='front' ref={frontEl}>
                {flashcard.question}
                <div className='flashcard-options'>
                    {flashcard.options.map(option => {
                        return <div className='flashcard-option' key={option}>{option}</div>
                    })}
                </div>
            </div>
            <div className='back' ref={backEl}>{flashcard.answer}</div>
        </div>
    )
}
