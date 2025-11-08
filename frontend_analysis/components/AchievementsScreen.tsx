import React from 'react';
import { Achievement } from '../types';

// FIX: Defined the missing props interface for the component.
interface AchievementsScreenProps {
  achievements: Achievement[];
}

const AchievementsScreen: React.FC<AchievementsScreenProps> = ({ achievements }) => {
  return (
    <div className="p-2 bg-slate-50 min-h-full">
      <h1 className="text-3xl font-bold text-slate-800 mb-6 text-center">Mis Logros</h1>
      <div className="space-y-4">
        {achievements.map((ach) => (
          <div key={ach.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center space-x-4 transform transition-transform hover:scale-105 hover:shadow-lg">
            <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-lg flex items-center justify-center text-white shadow-inner">
              <ion-icon name={ach.icon} style={{ fontSize: '36px' }}></ion-icon>
            </div>
            <div className="flex-grow">
              <h3 className="font-bold text-slate-700 text-lg">{ach.name}</h3>
              <p className="text-sm text-slate-500">{ach.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AchievementsScreen;