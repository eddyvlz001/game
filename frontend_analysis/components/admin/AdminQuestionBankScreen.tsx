import React from 'react';
import { Question } from '../../types';

const MOCK_QUESTIONS: Question[] = [
    { id: 'q1', text: '¿Qué es un componente en React?', answers: ['Una función que retorna HTML', 'Una clase de CSS', 'Un archivo de video', 'Una base de datos'], correctAnswerIndex: 0 },
    { id: 'q2', text: '¿Cuál de estos es un hook de React?', answers: ['useLoop', 'useEffect', 'useIf', 'useStyle'], correctAnswerIndex: 1 },
    { id: 'tq1', text: '¿Cuál es la capital de Francia?', answers: ['Londres', 'Berlín', 'París', 'Madrid'], correctAnswerIndex: 2 },
    { id: 'tq2', text: '¿Qué planeta es conocido como el Planeta Rojo?', answers: ['Tierra', 'Marte', 'Júpiter', 'Saturno'], correctAnswerIndex: 1 },
];

const AdminQuestionBankScreen: React.FC = () => {

    return (
       <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h2 className="text-xl font-bold text-slate-800">Banco de Preguntas Global</h2>
                <p className="text-slate-500 mt-1">Gestiona todas las preguntas de la plataforma.</p>
            </div>
            
            <div className="space-y-4">
                {MOCK_QUESTIONS.map(q => (
                    <div key={q.id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 transition-all hover:shadow-md hover:border-slate-300">
                        <div className="flex justify-between items-start mb-3">
                             <p className="font-bold text-slate-800 flex-grow pr-4">{q.text}</p>
                             <div className="flex-shrink-0 space-x-3">
                                <button className="text-indigo-600 hover:text-indigo-800 text-sm font-semibold flex items-center space-x-1">
                                    <ion-icon name="create-outline"></ion-icon>
                                    <span>Editar</span>
                                </button>
                                <button className="text-red-600 hover:text-red-800 text-sm font-semibold flex items-center space-x-1">
                                    <ion-icon name="trash-outline"></ion-icon>
                                    <span>Eliminar</span>
                                </button>
                             </div>
                        </div>
                        <ul className="space-y-2 text-sm">
                            {q.answers.map((ans, index) => (
                                <li key={index} className={`flex items-center space-x-3 pl-3 pr-2 py-1 rounded-md ${index === q.correctAnswerIndex ? 'bg-green-100 text-green-800 font-semibold' : 'bg-slate-50 text-slate-700'}`}>
                                    {index === q.correctAnswerIndex ? 
                                        <ion-icon name="checkmark-circle" class="text-green-600 text-base"></ion-icon> :
                                        <ion-icon name="ellipse-outline" class="text-slate-400 text-base"></ion-icon>
                                    }
                                    <span>{ans}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
       </div>
    );
};

export default AdminQuestionBankScreen;