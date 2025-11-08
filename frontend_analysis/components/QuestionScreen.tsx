import React, { useState, useEffect } from 'react';

const colors = [
  { name: 'Rojo', value: 'red', bg: 'bg-red-500', hover: 'hover:bg-red-600' },
  { name: 'Azul', value: 'blue', bg: 'bg-sky-500', hover: 'hover:bg-sky-600' },
  { name: 'Verde', value: 'green', bg: 'bg-green-500', hover: 'hover:bg-green-600' },
  { name: 'Amarillo', value: 'yellow', bg: 'bg-yellow-400', hover: 'hover:bg-yellow-500' },
];

const colorClasses: { [key: string]: string } = {
    'red': 'text-red-500',
    'blue': 'text-sky-500',
    'green': 'text-green-500',
    'yellow': 'text-yellow-400'
};

interface QuestionScreenProps {
  onCorrect: () => void;
  onIncorrect: () => void;
}

const QuestionScreen: React.FC<QuestionScreenProps> = ({ onCorrect, onIncorrect }) => {
  const [word, setWord] = useState<{ text: string; color: string } | null>(null);
  const [correctColorValue, setCorrectColorValue] = useState<string>('');

  const generateNewChallenge = () => {
    // Elige un color aleatorio para el texto de la palabra (ej. "Rojo")
    const randomWordColor = colors[Math.floor(Math.random() * colors.length)];
    // Elige un color de texto diferente y aleatorio (ej. azul)
    let randomTextColor;
    do {
      randomTextColor = colors[Math.floor(Math.random() * colors.length)];
    } while (randomWordColor.value === randomTextColor.value);

    setWord({ text: randomWordColor.name, color: randomTextColor.value });
    setCorrectColorValue(randomTextColor.value);
  };

  useEffect(() => {
    generateNewChallenge();
  }, []);

  const handleAnswer = (selectedColorValue: string) => {
    if (selectedColorValue === correctColorValue) {
      onCorrect();
    } else {
      onIncorrect();
    }
  };

  if (!word) {
    return (
        <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500"></div>
        </div>
    );
  }

  return (
    <div className="flex flex-col h-full p-4 text-center">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Acierta el Color</h1>
        <p className="text-slate-500 mt-1">Presiona el botón del color en que está escrita la palabra.</p>
      </div>
      
      <div className="flex-grow flex items-center justify-center">
        <h2 className={`text-6xl font-extrabold transition-all duration-300 ${colorClasses[word.color]}`}>
          {word.text}
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {colors.map((color) => (
          <button 
            key={color.name} 
            onClick={() => handleAnswer(color.value)}
            className={`py-8 rounded-2xl text-white font-bold text-2xl shadow-lg transform transition hover:scale-105 active:scale-100 ${color.bg} ${color.hover}`}>
            {color.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuestionScreen;