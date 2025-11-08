import React from 'react';
import { TeacherScreen } from '../../types';

interface DashboardScreenProps {
  navigateTo: (screen: TeacherScreen) => void;
}

const ActionCard: React.FC<{ title: string; description: string; icon: React.ReactElement; onClick: () => void }> = ({ title, description, icon, onClick }) => (
  <button onClick={onClick} className="bg-white p-6 rounded-2xl shadow-md border border-slate-200 hover:shadow-lg hover:border-sky-300 transition-all text-left w-full flex items-center space-x-4">
    <div className="text-3xl bg-sky-100 text-sky-600 p-3 rounded-full flex items-center justify-center w-16 h-16">
      {icon}
    </div>
    <div>
      <h3 className="font-bold text-slate-800 text-lg">{title}</h3>
      <p className="text-slate-500 text-sm">{description}</p>
    </div>
  </button>
);

const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigateTo }) => {
  return (
    <div className="p-2 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Panel de Docente</h1>
        <p className="text-slate-500 mt-1">Gestiona tus clases y actividades.</p>
      </div>

      <div className="space-y-4">
        <ActionCard 
          title="Crear Batalla"
          description="Inicia una nueva competencia para tus estudiantes."
          icon={<ion-icon name="flash-outline"></ion-icon>}
          onClick={() => navigateTo(TeacherScreen.BattleManager)}
        />
        <ActionCard 
          title="Banco de Preguntas"
          description="Crea y edita las preguntas para las batallas."
          icon={<ion-icon name="book-outline"></ion-icon>}
          onClick={() => navigateTo(TeacherScreen.QuestionBank)}
        />
        <ActionCard 
          title="Ver Estudiantes"
          description="Revisa el progreso y los logros de tu clase."
          icon={<ion-icon name="people-outline"></ion-icon>}
          onClick={() => navigateTo(TeacherScreen.StudentList)}
        />
      </div>
    </div>
  );
};

export default DashboardScreen;