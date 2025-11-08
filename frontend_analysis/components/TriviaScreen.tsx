import React, { useState } from 'react';

const MOCK_TRIVIA = [
  {
    question: '¿Cuál es la capital de Francia?',
    answers: ['Londres', 'Berlín', 'París', 'Madrid'],
    correct: 2,
  },
  {
    question: '¿Qué planeta es conocido como el Planeta Rojo?',
    answers: ['Tierra', 'Marte', 'Júpiter', 'Saturno'],
    correct: 1,
  },
  {
    question: '¿Quién escribió "Don Quijote de la Mancha"?',
    answers: ['García Márquez', 'Shakespeare', 'Cervantes', 'Vargas Llosa'],
    correct: 2,
  },
];

interface TriviaScreenProps {
  onWin: (points: number) => void;
  onLose: () => void;
}

const TriviaScreen: React.FC<TriviaScreenProps> = ({ onWin, onLose }) => {
  const [round, setRound] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const currentQuestion = MOCK_TRIVIA[round];

  const handleNext = () => {
    if (round < MOCK_TRIVIA.length - 1) {
      setRound(round + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      // Game finished, calculate points
      const pointsMapping: { [key: number]: number } = {
        3: 100,
        2: 70,
        1: 30,
      };
      const pointsWon = pointsMapping[correctAnswers] || 0;
      if (pointsWon > 0) {
        onWin(pointsWon);
      } else {
        onLose();
      }
    }
  };

  const handleAnswer = (index: number) => {
    if (isAnswered) return;
    
    setSelectedAnswer(index);
    setIsAnswered(true);

    if (index === currentQuestion.correct) {
      setCorrectAnswers(correctAnswers + 1);
    }

    setTimeout(handleNext, 1500); // Wait 1.5s to show feedback then move to next
  };

  const getButtonClass = (index: number) => {
      if (!isAnswered) return 'bg-white hover:bg-slate-100 border-slate-200';
      if (index === currentQuestion.correct) return 'bg-green-500 border-green-600 text-white';
      if (index === selectedAnswer && index !== currentQuestion.correct) return 'bg-red-500 border-red-600 text-white';
      return 'bg-white border-slate-200 opacity-50';
  }

  return (
    <div className="flex flex-col h-full p-6 bg-slate-50">
      <div className="text-center mb-6">
        <p className="text-sky-600 font-bold">Ronda {round + 1} / {MOCK_TRIVIA.length}</p>
        <h1 className="text-2xl font-bold text-slate-800 mt-2">{currentQuestion.question}</h1>
      </div>

      <div className="flex-grow flex flex-col justify-center space-y-4">
        {currentQuestion.answers.map((answer, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(index)}
            disabled={isAnswered}
            className={`w-full p-4 rounded-xl text-lg font-semibold border-2 text-slate-700 shadow-sm transition-all duration-300 ${getButtonClass(index)}`}
          >
            {answer}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TriviaScreen;