import React, { useState } from 'react';
import { TeacherScreen, User, Screen, CustomModule } from '../../types';
import TeacherBottomNav from './TeacherBottomNav';
import DashboardScreen from './DashboardScreen';
import TeacherProfileScreen from './TeacherProfileScreen';
import BattleManagerScreen from './BattleManagerScreen';
import QuestionBankScreen from './QuestionBankScreen';
import StudentListScreen from './StudentListScreen';
import BattleLobbyScreen from '../BattleLobbyScreen';

interface TeacherDashboardProps {
  user: User;
  onLogout: () => void;
  enabledModules: Set<Screen | TeacherScreen | string>;
  customModules: CustomModule[];
}

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ user, onLogout, enabledModules, customModules }) => {
  const [activeScreen, setActiveScreen] = useState<TeacherScreen | string>(TeacherScreen.Dashboard);
  
  const navigateTo = (screen: TeacherScreen) => setActiveScreen(screen);

  const renderContent = () => {
    switch (activeScreen) {
      case TeacherScreen.Dashboard:
        return <DashboardScreen navigateTo={navigateTo}/>;
      case TeacherScreen.BattleManager:
        return <BattleManagerScreen />;
      case TeacherScreen.QuestionBank:
        return <QuestionBankScreen />;
      case TeacherScreen.StudentList:
        return <StudentListScreen />;
      case TeacherScreen.Profile:
        return <TeacherProfileScreen user={user} onLogout={onLogout} />;
      default:
        const customModule = customModules.find(m => m.id === activeScreen);
        if (customModule) {
            return <BattleLobbyScreen />; // Placeholder for custom modules
        }
        return <DashboardScreen navigateTo={navigateTo} />;
    }
  };

  return (
    <>
      <main className="flex-grow overflow-y-auto p-4 md:p-6 pb-32">
        {renderContent()}
      </main>
      <TeacherBottomNav 
        activeScreen={activeScreen} 
        setActiveScreen={setActiveScreen} 
        enabledModules={enabledModules} 
        customModules={customModules} 
      />
    </>
  );
};

export default TeacherDashboard;