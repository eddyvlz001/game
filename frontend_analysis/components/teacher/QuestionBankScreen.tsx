import React, { useState, useEffect } from 'react';
import { Question } from '../../types';

const QuestionBankScreen: React.FC = () => {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [newQuestion, setNewQuestion] = useState('');
    const [newAnswers, setNewAnswers] = useState(['', '', '', '']);
    const [correctAnswer, setCorrectAnswer] = useState(0);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                // const response = await fetch('http://localhost:3001/api/questions');
                // const data = await response.json();
                // setQuestions(data);
                
                // Simulating API call
                const MOCK_QUESTIONS: Question[] = [
                    { id: 'q1', text: '¿Qué es un componente en React?', answers: ['Una función que retorna HTML', 'Una clase de CSS', 'Un archivo de video', 'Una base de datos'], correctAnswerIndex: 0 },
                    { id: 'q2', text: '¿Cuál de estos es un hook de React?', answers: ['useLoop', 'useEffect', 'useIf', 'useStyle'], correctAnswerIndex: 1 },
                ];
                setQuestions(MOCK_QUESTIONS);

            } catch (error) {
                console.error("Failed to fetch questions:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchQuestions();
    }, []);

    const handleAnswerChange = (index: number, value: string) => {
        const updatedAnswers = [...newAnswers];
        updatedAnswers[index] = value;
        setNewAnswers(updatedAnswers);
    };

    const handleAddQuestion = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newQuestion.trim() === '' || newAnswers.some(a => a.trim() === '')) {
            alert('Por favor, completa todos los campos.');
            return;
        }

        const questionToAdd: Omit<Question, 'id'> = {
            text: newQuestion,
            answers: newAnswers,
            correctAnswerIndex: correctAnswer,
        };
        
        try {
            // const response = await fetch('http://localhost:3001/api/questions', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(questionToAdd),
            // });
            // const savedQuestion = await response.json();
            // setQuestions([savedQuestion, ...questions]);
            
            // Simulating API response
             const savedQuestion: Question = { ...questionToAdd, id: `q${Date.now()}`};
             setQuestions([savedQuestion, ...questions]);

            // Reset form
            setNewQuestion('');
            setNewAnswers(['', '', '', '']);
            setCorrectAnswer(0);

        } catch (error) {
             console.error("Failed to add question:", error);
             alert('Error al guardar la pregunta.');
        }
    };

    return (
       <div className="p-2 space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-800">Banco de Preguntas</h1>
                <p className="text-slate-500 mt-1">Añade y gestiona las preguntas para las batallas.</p>
            </div>

            {/* Add Question Form */}
            <form onSubmit={handleAddQuestion} className="bg-white p-6 rounded-2xl shadow-md border border-slate-200 space-y-4">
                <h2 className="text-xl font-bold text-slate-700">Añadir Nueva Pregunta</h2>
                <div>
                    <label htmlFor="questionText" className="block text-sm font-medium text-slate-600 mb-1">Texto de la pregunta</label>
                    <textarea 
                        id="questionText"
                        value={newQuestion}
                        onChange={(e) => setNewQuestion(e.target.value)}
                        className="w-full px-4 py-2 bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-400 transition"
                        placeholder="Ej: ¿Qué renderiza un componente de React?"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Opciones de respuesta</label>
                    {newAnswers.map((answer, index) => (
                         <div key={index} className="flex items-center space-x-2 mb-2">
                             <input 
                                type="radio" 
                                name="correctAnswer" 
                                id={`answer_radio_${index}`}
                                checked={correctAnswer === index}
                                onChange={() => setCorrectAnswer(index)}
                                className="h-4 w-4 text-sky-600 border-slate-300 focus:ring-sky-500"
                            />
                            <input 
                                type="text" 
                                value={answer}
                                onChange={(e) => handleAnswerChange(index, e.target.value)}
                                className="w-full px-3 py-2 text-sm bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-sky-400 transition"
                                placeholder={`Respuesta ${index + 1}`}
                                required
                            />
                         </div>
                    ))}
                    <p className="text-xs text-slate-400 mt-1">Selecciona la respuesta correcta marcando el círculo.</p>
                </div>
                <button
                    type="submit"
                    className="w-full py-2 bg-sky-500 text-white font-bold rounded-lg shadow-sm hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-opacity-75 transition"
                >
                    Guardar Pregunta
                </button>
            </form>

            {/* Existing Questions List */}
            <div className="space-y-3">
                 <h2 className="text-xl font-bold text-slate-700">Preguntas Existentes</h2>
                {isLoading ? (
                    <p className="text-slate-500 text-center">Cargando preguntas...</p>
                ) : (
                    questions.map(q => (
                        <div key={q.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                            <p className="font-bold text-slate-800">{q.text}</p>
                            <ul className="mt-2 space-y-1 text-sm">
                                {q.answers.map((ans, index) => (
                                    <li key={index} className={`pl-4 py-1 rounded ${index === q.correctAnswerIndex ? 'bg-green-100 text-green-800 font-semibold' : 'text-slate-600'}`}>
                                        {ans}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))
                )}
            </div>
       </div>
    );
};

export default QuestionBankScreen;