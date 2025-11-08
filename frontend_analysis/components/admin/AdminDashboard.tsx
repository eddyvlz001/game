import React, { useState } from 'react';
import { AdminScreen, User, Screen, TeacherScreen, CustomModule } from '../../types';
import DashboardAdminScreen from './DashboardAdminScreen';
import UserManagementScreen from './UserManagementScreen';
import CardManagementScreen from './CardManagementScreen';
import DocumentationScreen from './DocumentationScreen';
import AdminQuestionBankScreen from './AdminQuestionBankScreen';
import AdminBottomNav from './AdminBottomNav';
import ModuleManagementScreen from './ModuleManagementScreen';
import ModuleCreatorScreen from './ModuleCreatorScreen';

interface AdminDashboardProps {
  user: User;
  onLogout: () => void;
  enabledModules: Set<Screen | TeacherScreen | string>;
  setEnabledModules: React.Dispatch<React.SetStateAction<Set<Screen | TeacherScreen | string>>>;
  customModules: CustomModule[];
  setCustomModules: React.Dispatch<React.SetStateAction<CustomModule[]>>;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onLogout, enabledModules, setEnabledModules, customModules, setCustomModules }) => {
  const [activeScreen, setActiveScreen] = useState<AdminScreen>(AdminScreen.Dashboard);

  const getScreenTitle = () => {
    switch (activeScreen) {
        case AdminScreen.Dashboard: return 'Panel de Control';
        case AdminScreen.Users: return 'Gestión de Usuarios';
        case AdminScreen.Cards: return 'Gestión de Cartas';
        case AdminScreen.Questions: return 'Banco de Preguntas';
        case AdminScreen.Documentation: return 'Documentación';
        case AdminScreen.Modules: return 'Gestión de Módulos';
        case AdminScreen.ModuleCreator: return 'Creador de Módulos';
        default: return 'Admin Panel';
    }
  }

  const renderContent = () => {
    switch (activeScreen) {
      case AdminScreen.Dashboard:
        return <DashboardAdminScreen setActiveScreen={setActiveScreen} />;
      case AdminScreen.Users:
        return <UserManagementScreen />;
      case AdminScreen.Cards:
        return <CardManagementScreen />;
      case AdminScreen.Questions:
        return <AdminQuestionBankScreen />;
      case AdminScreen.Documentation:
        return <DocumentationScreen />;
      case AdminScreen.Modules:
        return <ModuleManagementScreen 
                    enabledModules={enabledModules} 
                    setEnabledModules={setEnabledModules} 
                    customModules={customModules}
                    setActiveScreen={setActiveScreen} 
                />;
      case AdminScreen.ModuleCreator:
        return <ModuleCreatorScreen 
                    onModuleCreate={(newModule) => {
                        setCustomModules(prev => [...prev, newModule]);
                        // Also enable the new module by default
                        setEnabledModules(prev => new Set(prev).add(newModule.id));
                        setActiveScreen(AdminScreen.Modules);
                    }}
                    onCancel={() => setActiveScreen(AdminScreen.Modules)}
                />;
      default:
        return <DashboardAdminScreen setActiveScreen={setActiveScreen} />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 p-4 flex justify-between items-center flex-shrink-0">
          <h1 className="text-xl font-bold text-slate-800">{getScreenTitle()}</h1>
          <div className="flex items-center space-x-3">
              <span className="text-sm font-semibold text-slate-600 hidden sm:block">{user.name}</span>
              <img src={user.imageUrl} alt={user.name} className="w-9 h-9 rounded-full object-cover" />
          </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-grow overflow-y-auto p-4 md:p-6 pb-32">
          {renderContent()}
      </main>

      {/* Bottom Navigation */}
      <AdminBottomNav activeScreen={activeScreen} setActiveScreen={setActiveScreen} onLogout={onLogout} />
    </div>
  );
};

export default AdminDashboard;