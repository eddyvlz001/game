import React from 'react';
import { AdminScreen } from '../../types';

interface AdminBottomNavProps {
  activeScreen: AdminScreen;
  setActiveScreen: (screen: AdminScreen) => void;
  onLogout: () => void;
}

interface NavItemProps {
  screen: AdminScreen;
  label: string;
  iconName: string;
  isActive: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ label, iconName, isActive, onClick }) => {
  const activeClasses = 'text-sky-500';
  const inactiveClasses = 'text-slate-400';

  return (
    <button
      onClick={onClick}
      className="flex-1 flex flex-col items-center justify-center w-full transition-colors duration-200"
    >
        <ion-icon name={iconName} class={`text-2xl mb-1 ${isActive ? activeClasses : inactiveClasses}`}></ion-icon>
        <span className={`text-xs font-bold ${isActive ? activeClasses : inactiveClasses}`}>{label}</span>
    </button>
  );
};

const AdminBottomNav: React.FC<AdminBottomNavProps> = ({ activeScreen, setActiveScreen, onLogout }) => {
  const navItems = [
    { screen: AdminScreen.Dashboard, label: 'Inicio', iconName: 'grid-outline' },
    { screen: AdminScreen.Users, label: 'Usuarios', iconName: 'people-outline' },
    { screen: AdminScreen.Cards, label: 'Cartas', iconName: 'id-card-outline'},
    { screen: AdminScreen.Questions, label: 'Preguntas', iconName: 'book-outline'},
    { screen: AdminScreen.Modules, label: 'Módulos', iconName: 'layers-outline'},
  ];

  return (
    <div className="absolute bottom-0 left-0 right-0 h-20 bg-white border-t border-slate-200 shadow-t-lg z-20">
       <div className="flex justify-around items-center h-full px-2">
          {navItems.map(item => (
            <NavItem
              key={item.screen}
              {...item}
              isActive={activeScreen === item.screen}
              onClick={() => setActiveScreen(item.screen)}
            />
          ))}
          <button
            onClick={onLogout}
            className="flex-1 flex flex-col items-center justify-center w-full text-slate-400"
            >
            <ion-icon name="log-out-outline" class="text-2xl mb-1"></ion-icon>
            <span className="text-xs font-bold">Salir</span>
          </button>
      </div>
    </div>
  );
};

export default AdminBottomNav;
