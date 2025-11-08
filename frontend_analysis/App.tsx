import React, { useState } from 'react';
import { Screen, User, UserRole, TeacherScreen, CustomModule } from './types';
import LoginScreen from './components/LoginScreen';
import ProfileScreen from './components/ProfileScreen';
import BottomNav from './components/BottomNav';
import AchievementsScreen from './components/AchievementsScreen';
import BattleLobbyScreen from './components/BattleLobbyScreen';
import QuestionScreen from './components/QuestionScreen';
import TriviaScreen from './components/TriviaScreen';
import WinnerScreen from './components/WinnerScreen';
import LoserScreen from './components/LoserScreen';
import TeacherDashboard from './components/teacher/TeacherDashboard';
import AdminDashboard from './components/admin/AdminDashboard';
import JoinBattleScreen from './components/JoinBattleScreen';


const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [activeScreen, setActiveScreen] = useState<Screen>(Screen.Profile);
  const [lastPointsWon, setLastPointsWon] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);

  // State for dynamic module management by the admin
  const [enabledModules, setEnabledModules] = useState<Set<Screen | TeacherScreen>>(
    new Set([
        // Student modules
        Screen.Profile,
        Screen.JoinBattle,
        Screen.Achievements,
        Screen.Questions,
        // Teacher modules
        TeacherScreen.Dashboard,
        TeacherScreen.BattleManager,
        TeacherScreen.QuestionBank,
        TeacherScreen.StudentList,
        TeacherScreen.Profile,
    ])
  );

  // State for modules created by the admin
  const [customModules, setCustomModules] = useState<CustomModule[]>([]);

  const handleLoginSuccess = async (role: UserRole) => {
    setIsLoading(true);
    // In a real app, you would fetch user data from your API here
    // For now, we'll simulate a fetch and set a user object
    try {
        // const response = await fetch('/api/user');
        // const userData = await response.json();
        // setUser(userData);
        
        // Simulating API response
        await new Promise(res => setTimeout(res, 500));
        let loggedInUser: User;
        if (role === UserRole.Student) {
            loggedInUser = { name: 'Alex Innovator', level: 12, imageUrl: 'https://picsum.photos/seed/user123/200/200', achievements: [{ id: 1, name: 'Primera Batalla', icon: 'flame-outline', description: 'Participa en tu primera batalla.' }], role: UserRole.Student };
            setActiveScreen(Screen.Profile);
        } else if (role === UserRole.Teacher) {
            loggedInUser = { name: 'Prof. Diana Salas', level: 99, imageUrl: 'https://picsum.photos/seed/teacher123/200/200', achievements: [], role: UserRole.Teacher, subjects: ['Frontend'], skills:['React'], cycles:['5to'] };
        } else {
            loggedInUser = { name: 'Admin', level: 999, imageUrl: 'https://ui-avatars.com/api/?name=A&background=1e293b&color=fff&bold=true', achievements: [], role: UserRole.Admin };
        }
        setUser(loggedInUser);
        setIsAuthenticated(true);
    } catch (error) {
        console.error("Failed to login", error);
        alert("Login failed.");
    } finally {
        setIsLoading(false);
    }
  };
  
  const handleLogout = () => {
      setIsAuthenticated(false);
      setUser(null);
  };

  const handleGameWin = (points: number) => {
    setLastPointsWon(points);
    // Here you would typically update the user's total points
    setActiveScreen(Screen.Winner);
  };

  const handleGameLose = () => {
    setLastPointsWon(0);
    setActiveScreen(Screen.Loser);
  };

  const handleReturnToProfile = () => {
    setActiveScreen(Screen.Profile);
    // After a delay, reset points so animation doesn't re-trigger on screen change
    setTimeout(() => setLastPointsWon(0), 2000);
  };

  const handleStartTrivia = () => {
    setActiveScreen(Screen.Trivia);
  };

  const renderStudentContent = () => {
    if (!user) return null;
    switch (activeScreen) {
      case Screen.Profile:
        return <ProfileScreen user={user} lastPointsWon={lastPointsWon} onLogout={handleLogout} />;
      case Screen.JoinBattle:
        return <JoinBattleScreen onJoinSuccess={() => setActiveScreen(Screen.BattleLobby)} />;
      case Screen.BattleLobby:
        return <BattleLobbyScreen />;
      case Screen.Achievements:
        return <AchievementsScreen achievements={user.achievements} />;
      case Screen.Questions:
        return <QuestionScreen onCorrect={handleStartTrivia} onIncorrect={handleGameLose} />;
      case Screen.Trivia:
        return <TriviaScreen onWin={handleGameWin} onLose={handleGameLose} />;
      case Screen.Winner:
        return <WinnerScreen points={lastPointsWon} onContinue={handleReturnToProfile} />;
      case Screen.Loser:
        return <LoserScreen onContinue={handleReturnToProfile} />;
      default:
        // Check if active screen is a custom module
        const customModule = customModules.find(m => m.id === activeScreen && m.role === UserRole.Student && enabledModules.has(m.id as any));
        if (customModule) {
             return <BattleLobbyScreen />; // Placeholder for custom modules
        }
        return <ProfileScreen user={user} onLogout={handleLogout}/>;
    }
  };

  const renderAuthenticatedContent = () => {
      if (!user) return null;

      switch(user.role) {
          case UserRole.Admin:
              return <AdminDashboard 
                user={user} 
                onLogout={handleLogout} 
                enabledModules={enabledModules} 
                setEnabledModules={setEnabledModules} 
                customModules={customModules}
                setCustomModules={setCustomModules}
              />;
          case UserRole.Teacher:
              return <TeacherDashboard user={user} onLogout={handleLogout} enabledModules={enabledModules} customModules={customModules} />;
          case UserRole.Student:
              return (
                <>
                    <main className="flex-grow overflow-y-auto p-4 md:p-6 pb-32">
                        {renderStudentContent()}
                    </main>
                    <BottomNav activeScreen={activeScreen} setActiveScreen={setActiveScreen} enabledModules={enabledModules} customModules={customModules} />
                </>
              );
          default:
            return null;
      }
  }
  
  const renderAppContent = () => {
      if (isLoading) {
          return (
              <div className="flex justify-center items-center h-full">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500"></div>
              </div>
          );
      }
      return isAuthenticated && user ? renderAuthenticatedContent() : <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="bg-slate-100 min-h-screen font-sans flex items-center justify-center">
      <div className="relative w-full max-w-md h-[800px] max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {renderAppContent()}
      </div>
    </div>
  );
};

export default App;