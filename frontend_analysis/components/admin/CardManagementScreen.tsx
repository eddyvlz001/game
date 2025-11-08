import React from 'react';
import { Professor } from '../../types';

const MOCK_TEACHERS_AS_PROFESSORS: Professor[] = [
  { id: 1, name: 'Dr. Ada Lovelace', title: 'Algoritmos', imageUrl: 'https://picsum.photos/seed/prof1/400/500', skills: [], locked: false },
  { id: 2, name: 'Dr. Alan Turing', title: 'Computación', imageUrl: 'https://picsum.photos/seed/prof2/400/500', skills: [], locked: true },
  { id: 3, name: 'Dr. Grace Hopper', title: 'Sistemas', imageUrl: 'https://picsum.photos/seed/prof3/400/500', skills: [], locked: true },
  { id: 4, name: 'Dr. Tim Berners-Lee', title: 'Redes', imageUrl: 'https://picsum.photos/seed/prof4/400/500', skills: [], locked: false },
];

const CardManagementScreen: React.FC = () => {

    const handleEdit = (profName: string) => alert(`Editando ${profName}`);
    const handleDelete = (profName: string) => {
        if(confirm(`¿Eliminar la carta de ${profName}?`)) {
            alert(`${profName} eliminada.`);
        }
    }

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h2 className="text-xl font-bold text-slate-800">Gestión de Cartas de Maestros</h2>
                <p className="text-slate-500 mt-1">Edita, reemplaza o elimina las cartas de profesores que ven los estudiantes.</p>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
                {MOCK_TEACHERS_AS_PROFESSORS.map(prof => (
                    <div key={prof.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden group transition-all hover:shadow-lg hover:border-slate-300">
                        <div className="relative">
                            <img src={prof.imageUrl} alt={prof.name} className="h-48 w-full object-cover" />
                            {prof.locked && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                    <ion-icon name="lock-closed" class="text-white text-3xl"></ion-icon>
                                    <span className="ml-2 text-white font-semibold">Bloqueada</span>
                                </div>
                            )}
                        </div>

                        <div className="p-4">
                            <h3 className="font-bold text-slate-800 text-lg">{prof.name}</h3>
                            <p className="text-sm text-slate-500">{prof.title}</p>
                        </div>
                        <div className="p-3 border-t border-slate-100 flex justify-end space-x-2 bg-slate-50/70">
                             <button onClick={() => handleEdit(prof.name)} className="px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-100 rounded-md hover:bg-indigo-200 transition-colors flex items-center space-x-1">
                                <ion-icon name="create-outline"></ion-icon>
                                <span>Editar</span>
                             </button>
                             <button onClick={() => handleDelete(prof.name)} className="px-3 py-1.5 text-xs font-semibold text-red-700 bg-red-100 rounded-md hover:bg-red-200 transition-colors flex items-center space-x-1">
                                <ion-icon name="trash-outline"></ion-icon>
                                <span>Eliminar</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CardManagementScreen;