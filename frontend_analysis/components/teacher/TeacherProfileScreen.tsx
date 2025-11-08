import React from 'react';
import { User } from '../../types';

interface TeacherProfileScreenProps {
  user: User;
  onLogout: () => void;
}

const InfoCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div>
        <h2 className="text-xl font-bold text-slate-700 mb-3 px-1">{title}</h2>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
            {children}
        </div>
    </div>
);

const Tag: React.FC<{ text: string }> = ({ text }) => (
    <span className="bg-sky-100 text-sky-700 text-sm font-semibold px-3 py-1 rounded-full">
        {text}
    </span>
);

const TeacherProfileScreen: React.FC<TeacherProfileScreenProps> = ({ user, onLogout }) => {
  return (
    <div className="space-y-6">
        {/* User Info Section */}
        <div className="flex items-center space-x-4 p-2">
            <img src={user.imageUrl} alt={user.name} className="w-24 h-24 rounded-full border-4 border-white shadow-lg" />
            <div className="flex-grow">
            <h1 className="text-2xl font-bold text-slate-800">{user.name}</h1>
            <p className="text-indigo-600 font-semibold">Rol: Docente</p>
            </div>
            <div className="flex items-center space-x-2">
                <button 
                    onClick={onLogout} 
                    className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition flex items-center justify-center"
                    aria-label="Cerrar sesión"
                >
                    <ion-icon name="log-out-outline" class="text-xl"></ion-icon>
                </button>
            </div>
        </div>

        {/* Subjects Card */}
        <InfoCard title="Clases que imparte">
            <div className="flex flex-wrap gap-2">
                {user.subjects?.map(subject => <Tag key={subject} text={subject} />)}
            </div>
        </InfoCard>

        {/* Skills Card */}
        <InfoCard title="Habilidades">
             <div className="flex flex-wrap gap-2">
                {user.skills?.map(skill => <Tag key={skill} text={skill} />)}
            </div>
        </InfoCard>

        {/* Cycles Card */}
        <InfoCard title="Ciclos Académicos">
             <div className="flex flex-wrap gap-2">
                {user.cycles?.map(cycle => <Tag key={cycle} text={cycle} />)}
            </div>
        </InfoCard>
    </div>
  );
};

export default TeacherProfileScreen;