import React from 'react';

const BattleLobbyScreen: React.FC = () => {
  const teamMembers = [
    { name: 'Tú', avatar: 'https://picsum.photos/seed/user123/100/100' },
    { name: 'Ana', avatar: 'https://picsum.photos/seed/user2/100/100' },
    { name: 'Luis', avatar: 'https://picsum.photos/seed/user3/100/100' },
    { name: 'Eva', avatar: 'https://picsum.photos/seed/user4/100/100' },
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-4 bg-slate-50">
      <h1 className="text-3xl font-bold text-slate-800 mb-4">Sala de Batalla</h1>
      <p className="text-slate-500 mb-8">Esperando al profesor y a los demás jugadores...</p>
      
      <div className="w-full max-w-sm">
        <h2 className="text-lg font-semibold text-sky-700 mb-4">Tu Equipo</h2>
        <div className="grid grid-cols-2 gap-4">
          {teamMembers.map((member, index) => (
            <div key={index} className="flex flex-col items-center p-3 bg-white rounded-lg shadow-sm border border-slate-200">
              <img src={member.avatar} alt={member.name} className="w-16 h-16 rounded-full mb-2" />
              <p className="font-semibold text-slate-700">{member.name}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500"></div>
        <p className="mt-4 text-sm text-slate-400">Conectando...</p>
      </div>
    </div>
  );
};

export default BattleLobbyScreen;
