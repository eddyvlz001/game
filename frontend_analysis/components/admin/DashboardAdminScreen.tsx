import React from 'react';
import { AdminScreen } from '../../types';

interface DashboardAdminScreenProps {
    setActiveScreen: (screen: AdminScreen) => void;
}

const StatCard: React.FC<{ title: string; value: string; icon: string; color: string; }> = ({ title, value, icon, color }) => (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center space-x-3">
        <div className={`p-3 rounded-full ${color}`}>
            <ion-icon name={icon} class="text-xl text-white"></ion-icon>
        </div>
        <div>
            <p className="text-slate-500 text-xs font-medium">{title}</p>
            <p className="text-xl font-bold text-slate-800">{value}</p>
        </div>
    </div>
);

const ActionCard: React.FC<{ title: string; icon: string; onClick: () => void; }> = ({ title, icon, onClick }) => (
    <button 
        onClick={onClick} 
        className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:border-indigo-400 hover:shadow-lg transition-all flex flex-col items-center justify-center text-center group"
    >
        <div className="p-3 rounded-full bg-slate-100 text-slate-600 mb-2 transition-colors group-hover:bg-indigo-100 group-hover:text-indigo-600">
            <ion-icon name={icon} class="text-2xl"></ion-icon>
        </div>
        <p className="font-semibold text-sm text-slate-700 group-hover:text-indigo-600 transition-colors">{title}</p>
    </button>
);


const DashboardAdminScreen: React.FC<DashboardAdminScreenProps> = ({ setActiveScreen }) => {
  return (
    <div className="space-y-6">
        <div>
            <h1 className="text-2xl font-bold text-slate-800">Bienvenido, Admin</h1>
            <p className="text-slate-500 mt-1">Resumen de la plataforma.</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
            <StatCard title="Total Usuarios" value="150" icon="people-circle-outline" color="bg-sky-500" />
            <StatCard title="Batallas Activas" value="12" icon="flash-outline" color="bg-amber-500" />
            <StatCard title="Preguntas Creadas" value="230" icon="book-outline" color="bg-emerald-500" />
        </div>

        <div>
            <h2 className="text-xl font-bold text-slate-700 mb-3">Acciones Rápidas</h2>
            <div className="grid grid-cols-2 gap-4">
                <ActionCard title="Usuarios" icon="people-outline" onClick={() => setActiveScreen(AdminScreen.Users)} />
                <ActionCard title="Cartas" icon="id-card-outline" onClick={() => setActiveScreen(AdminScreen.Cards)} />
                <ActionCard title="Preguntas" icon="book-outline" onClick={() => setActiveScreen(AdminScreen.Questions)} />
                <ActionCard title="Módulos" icon="layers-outline" onClick={() => setActiveScreen(AdminScreen.Modules)} />
                <ActionCard title="Documentación" icon="document-text-outline" onClick={() => setActiveScreen(AdminScreen.Documentation)} />
            </div>
        </div>
    </div>
  );
};

export default DashboardAdminScreen;