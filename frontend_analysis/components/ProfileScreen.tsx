import React, { useState, useRef, useEffect } from 'react';
import { User, Professor } from '../types';
import ProfessorCard from './ProfessorCard';
import EditProfileModal from './EditProfileModal';

interface ProfileScreenProps {
  user: User;
  lastPointsWon?: number;
  onLogout: () => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ user, lastPointsWon = 0, onLogout }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editableUser, setEditableUser] = useState<User>(user);
  const [professors, setProfessors] = useState<Professor[]>([]);
  const professorsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch professors from the local backend API
    const fetchProfessors = async () => {
        try {
            // In a real setup, this URL would be in an environment variable
            // const response = await fetch('http://localhost:3001/api/professors');
            // const data = await response.json();
            // setProfessors(data);

            // Simulating API call for now
            const MOCK_TEACHERS_AS_PROFESSORS: Professor[] = [
              { id: 1, name: 'Dr. Ada Lovelace', title: 'Algoritmos', imageUrl: 'https://picsum.photos/seed/prof1/400/500', skills: [{ name: 'Lógica', score: 95 }, { name: 'Estructura de Datos', score: 92 }, { name: 'Optimización', score: 88 }], locked: false },
              { id: 2, name: 'Dr. Alan Turing', title: 'Computación', imageUrl: 'https://picsum.photos/seed/prof2/400/500', skills: [{ name: 'Criptografía', score: 98 }, { name: 'Teoría de Autómatas', score: 94 }, { name: 'IA', score: 90 }], locked: true },
              { id: 3, name: 'Dr. Grace Hopper', title: 'Sistemas', imageUrl: 'https://picsum.photos/seed/prof3/400/500', skills: [{ name: 'Compiladores', score: 97 }, { name: 'Debugging', score: 99 }, { name: 'COBOL', score: 85 }], locked: true },
            ];
            setProfessors(MOCK_TEACHERS_AS_PROFESSORS);

        } catch (error) {
            console.error("Failed to fetch professors:", error);
        }
    };
    fetchProfessors();
  }, []);

  const handleSaveProfile = (updatedData: { name: string; imageUrl: string }) => {
    setEditableUser(prev => ({ ...prev, ...updatedData }));
    setIsEditModalOpen(false);
  };

  const scroll = (direction: 'left' | 'right') => {
    if (professorsContainerRef.current) {
      const scrollAmount = 300; // A bit more than card width + gap
      professorsContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="space-y-8 relative">
       {/* Points Animation */}
       {lastPointsWon > 0 && (
          <div key={Date.now()} className="absolute top-10 right-4 bg-green-500 text-white font-bold px-4 py-2 rounded-full shadow-lg animate-fade-out-up z-50">
              +{lastPointsWon} Puntos!
          </div>
      )}

      {/* User Info Section */}
      <div className="flex items-center space-x-4 p-4">
        <img src={editableUser.imageUrl} alt={editableUser.name} className="w-24 h-24 rounded-full border-4 border-white shadow-lg" />
        <div className="flex-grow">
          <h1 className="text-2xl font-bold text-slate-800">{editableUser.name}</h1>
          <p className="text-sky-600 font-semibold">Nivel {editableUser.level}</p>
        </div>
         <div className="flex items-center space-x-2">
            <button 
                onClick={() => setIsEditModalOpen(true)}
                className="p-2 rounded-full bg-slate-200 text-slate-600 hover:bg-slate-300 transition flex items-center justify-center" 
                aria-label="Editar perfil">
                <ion-icon name="create-outline" class="text-xl"></ion-icon>
            </button>
             <button 
                onClick={onLogout} 
                className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition flex items-center justify-center"
                aria-label="Cerrar sesión"
            >
                <ion-icon name="log-out-outline" class="text-xl"></ion-icon>
            </button>
        </div>
      </div>

      {/* Achievements Section */}
      <div>
        <h2 className="text-xl font-bold text-slate-700 mb-3 px-1">Logros Recientes</h2>
        <div className="flex space-x-4 overflow-x-auto pb-4 horizontal-scrollbar">
          {editableUser.achievements.slice(0, 5).map((ach) => (
            <div key={ach.id} className="flex-shrink-0 flex flex-col items-center justify-center w-24 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-full flex items-center justify-center text-3xl shadow-inner text-white">
                <ion-icon name={ach.icon}></ion-icon>
              </div>
              <p className="mt-2 text-xs font-semibold text-slate-600 leading-tight">{ach.name}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Professor Cards Section */}
      <div>
        <div className="flex justify-between items-center mb-3 px-1">
          <h2 className="text-xl font-bold text-slate-700">Maestros</h2>
           <div className="flex space-x-2">
            <button onClick={() => scroll('left')} className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 hover:bg-slate-300 transition flex items-center justify-center" aria-label="Desplazar a la izquierda">
              <ion-icon name="chevron-back-outline"></ion-icon>
            </button>
            <button onClick={() => scroll('right')} className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 hover:bg-slate-300 transition flex items-center justify-center" aria-label="Desplazar a la derecha">
              <ion-icon name="chevron-forward-outline"></ion-icon>
            </button>
          </div>
        </div>
        <div ref={professorsContainerRef} className="flex space-x-6 overflow-x-auto pb-6 horizontal-scrollbar snap-x snap-mandatory" style={{ scrollBehavior: 'smooth' }}>
          {professors.map((prof) => (
             <div key={prof.id} className="snap-center flex-shrink-0">
                <ProfessorCard professor={prof} />
             </div>
          ))}
        </div>
      </div>

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={editableUser}
        onSave={handleSaveProfile}
      />
    </div>
  );
};

export default ProfileScreen;