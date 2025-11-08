import React, { useState } from 'react';
import { Professor } from '../types';

interface ProfessorCardProps {
  professor: Professor;
}

const ProfessorCard: React.FC<ProfessorCardProps> = ({ professor }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const isLocked = professor.locked;

  const handleCardClick = () => {
    if (!isLocked) {
      setIsFlipped(!isFlipped);
    }
  };

  return (
    <div className="group perspective w-64 h-80" onClick={handleCardClick}>
      <div className={`relative preserve-3d w-full h-full duration-500 transition-transform ${isFlipped ? 'rotate-y-180' : ''}`}>
        {/* Front Face */}
        <div className={`absolute backface-hidden w-full h-full rounded-2xl overflow-hidden shadow-lg group-hover:scale-105 transition-transform duration-500 ${isLocked ? 'grayscale' : ''}`}>
          <img src={professor.imageUrl} alt={professor.name} className="w-full h-full object-cover" />
           {isLocked && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <ion-icon name="lock-closed" class="text-5xl text-white/70"></ion-icon>
            </div>
          )}
          <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent">
            <h3 className="text-white text-xl font-bold">{professor.name}</h3>
            <p className="text-sky-300 text-sm">{professor.title}</p>
          </div>
        </div>

        {/* Back Face (only renders if not locked) */}
        {!isLocked && (
            <div className="absolute rotate-y-180 backface-hidden w-full h-full bg-gradient-to-br from-sky-500 to-cyan-500 rounded-2xl shadow-lg p-6 text-white group-hover:scale-105 transition-transform duration-500">
            <div className="flex flex-col h-full">
                <h3 className="text-xl font-bold mb-1">{professor.name}</h3>
                <p className="text-sky-200 text-sm mb-4">Habilidades</p>
                <div className="space-y-3 flex-grow">
                {professor.skills.map(skill => (
                    <div key={skill.name}>
                    <div className="flex justify-between items-end mb-1">
                        <span className="font-semibold text-sm">{skill.name}</span>
                        <span className="font-bold text-lg">{skill.score}</span>
                    </div>
                    <div className="w-full bg-sky-400/50 rounded-full h-2">
                        <div 
                        className="bg-white h-2 rounded-full" 
                        style={{ width: `${skill.score}%` }}
                        ></div>
                    </div>
                    </div>
                ))}
                </div>
            </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default ProfessorCard;