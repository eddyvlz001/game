import React from 'react';
import PlaceholderScreen from '../PlaceholderScreen';
import { Student } from '../../types';

const MOCK_STUDENTS: Student[] = [
    { id: '1', name: 'Ana García', level: 14, imageUrl: 'https://picsum.photos/seed/student1/100/100' },
    { id: '2', name: 'Luis Pérez', level: 11, imageUrl: 'https://picsum.photos/seed/student2/100/100' },
    { id: '3', name: 'Eva Morales', level: 15, imageUrl: 'https://picsum.photos/seed/student3/100/100' },
    { id: '4', name: 'Carlos Ruiz', level: 9, imageUrl: 'https://picsum.photos/seed/student4/100/100' },
];

const StudentListScreen: React.FC = () => {
    return (
       <div className="p-2 space-y-4">
            <div>
                <h1 className="text-3xl font-bold text-slate-800">Mis Estudiantes</h1>
                <p className="text-slate-500 mt-1">Sigue el rendimiento de tu clase.</p>
            </div>
            <div className="space-y-3">
                {MOCK_STUDENTS.map(student => (
                    <div key={student.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center space-x-4">
                        <img src={student.imageUrl} alt={student.name} className="w-12 h-12 rounded-full" />
                        <div className="flex-grow">
                            <p className="font-bold text-slate-700">{student.name}</p>
                            <p className="text-sm text-slate-500">Nivel {student.level}</p>
                        </div>
                        <div className="text-right">
                             <span className="px-3 py-1 text-xs font-semibold text-sky-700 bg-sky-100 rounded-full">
                                Nivel {student.level}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
       </div>
    );
};

export default StudentListScreen;