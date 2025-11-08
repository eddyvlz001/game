import React, { useState } from 'react';
import { Question } from '../../types';
import CreateBattleModal from './CreateBattleModal';

interface BattleRoom {
    id: string;
    name: string;
    teamACode: string;
    teamBCode: string;
}

// These would typically come from a service or state management
const MOCK_QUESTIONS: Question[] = [
    { id: 'q1', text: '¿Qué es un componente en React?', answers: ['Una función que retorna HTML', 'Una clase de CSS', 'Un archivo de video', 'Una base de datos'], correctAnswerIndex: 0 },
    { id: 'q2', text: '¿Cuál de estos es un hook de React?', answers: ['useLoop', 'useEffect', 'useIf', 'useStyle'], correctAnswerIndex: 1 },
];

const BattleManagerScreen: React.FC = () => {
    const [rooms, setRooms] = useState<BattleRoom[]>([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const generateRandomCode = () => {
        return Math.random().toString(36).substring(2, 8).toUpperCase();
    }

    const handleCreateRoom = (battleName: string, battleQuestions: Question[]) => {
        const newRoom: BattleRoom = {
            id: new Date().toISOString(),
            name: battleName,
            teamACode: generateRandomCode(),
            teamBCode: generateRandomCode(),
        };
        setRooms([newRoom, ...rooms]);
        setIsCreateModalOpen(false);
        console.log('Battle created with questions:', battleQuestions);
    }

    const handleCopyCode = async (code: string) => {
        try {
            await navigator.clipboard.writeText(code);
            alert(`Código "${code}" copiado al portapapeles.`);
        } catch (err) {
            console.error('Failed to copy code: ', err);
            alert('No se pudo copiar el código.');
        }
    }

    return (
        <div className="p-2 space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-800">Gestor de Batallas</h1>
                <p className="text-slate-500 mt-1">Crea y administra las salas de batalla para tus clases.</p>
            </div>
            
            <button 
                onClick={() => setIsCreateModalOpen(true)}
                className="w-full py-3 bg-sky-500 text-white font-bold rounded-lg shadow-md hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-opacity-75 transition transform hover:scale-105 flex items-center justify-center"
            >
                <ion-icon name="add-circle-outline" class="mr-2 text-xl"></ion-icon>
                Crear Nueva Sala de Batalla
            </button>

            <div>
                <h2 className="text-xl font-bold text-slate-700 mb-3">Salas Activas</h2>
                {rooms.length === 0 ? (
                    <p className="text-slate-500 text-center py-8">No hay salas activas. ¡Crea una para empezar!</p>
                ) : (
                    <div className="space-y-4">
                        {rooms.map(room => (
                            <div key={room.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                                <p className="font-bold text-slate-800 text-lg mb-3">{room.name}</p>
                                <div className="grid grid-cols-2 gap-4">
                                    {/* Team A */}
                                    <div className="bg-slate-50 p-3 rounded-lg">
                                        <p className="text-sm font-semibold text-slate-600">Equipo Alfa</p>
                                        <div className="flex items-center justify-between mt-1">
                                            <p className="font-mono text-xl font-bold text-sky-600 tracking-widest">{room.teamACode}</p>
                                            <button 
                                                onClick={() => handleCopyCode(room.teamACode)}
                                                className="p-2 rounded-md bg-slate-200 text-slate-600 hover:bg-slate-300 transition"
                                                aria-label="Copiar código del Equipo Alfa"
                                            >
                                                <ion-icon name="copy-outline" class="text-lg"></ion-icon>
                                            </button>
                                        </div>
                                    </div>
                                    {/* Team B */}
                                    <div className="bg-slate-50 p-3 rounded-lg">
                                        <p className="text-sm font-semibold text-slate-600">Equipo Beta</p>
                                        <div className="flex items-center justify-between mt-1">
                                            <p className="font-mono text-xl font-bold text-indigo-600 tracking-widest">{room.teamBCode}</p>
                                            <button 
                                                onClick={() => handleCopyCode(room.teamBCode)}
                                                className="p-2 rounded-md bg-slate-200 text-slate-600 hover:bg-slate-300 transition"
                                                aria-label="Copiar código del Equipo Beta"
                                            >
                                                <ion-icon name="copy-outline" class="text-lg"></ion-icon>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            
            <CreateBattleModal 
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onCreate={handleCreateRoom}
                existingQuestions={MOCK_QUESTIONS}
            />
        </div>
    );
};

export default BattleManagerScreen;