import React from 'react';
import { AppModule, Screen, TeacherScreen, UserRole, CustomModule, AdminScreen } from '../../types';

// Define all available modules in the application
const ALL_MODULES: AppModule[] = [
    // Student Modules
    { id: Screen.Profile, name: 'Perfil de Estudiante', description: 'Pantalla principal del estudiante con logros y cartas.', role: UserRole.Student },
    { id: Screen.JoinBattle, name: 'Batallas', description: 'Permite a los estudiantes unirse a salas de batalla.', role: UserRole.Student },
    { id: Screen.Achievements, name: 'Logros', description: 'Muestra la lista completa de logros obtenidos.', role: UserRole.Student },
    { id: Screen.Questions, name: 'Preguntas Rápidas', description: 'Un mini-juego de preguntas para practicar.', role: UserRole.Student },
    // Teacher Modules
    { id: TeacherScreen.Dashboard, name: 'Panel de Docente', description: 'Pantalla de inicio para docentes.', role: UserRole.Teacher },
    { id: TeacherScreen.BattleManager, name: 'Gestor de Batallas', description: 'Permite a los docentes crear y gestionar batallas.', role: UserRole.Teacher },
    { id: TeacherScreen.QuestionBank, name: 'Banco de Preguntas', description: 'Permite a los docentes gestionar sus preguntas.', role: UserRole.Teacher },
    { id: TeacherScreen.StudentList, name: 'Lista de Estudiantes', description: 'Muestra la lista de estudiantes de la clase.', role: UserRole.Teacher },
    { id: TeacherScreen.Profile, name: 'Perfil de Docente', description: 'Muestra el perfil y la información del docente.', role: UserRole.Teacher },
];

interface ModuleManagementScreenProps {
    enabledModules: Set<Screen | TeacherScreen | string>;
    setEnabledModules: React.Dispatch<React.SetStateAction<Set<Screen | TeacherScreen | string>>>;
    customModules: CustomModule[];
    setActiveScreen: (screen: AdminScreen) => void;
}

const ToggleSwitch: React.FC<{ enabled: boolean, onChange: () => void }> = ({ enabled, onChange }) => (
    <button onClick={onChange} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${enabled ? 'bg-sky-500' : 'bg-slate-300'}`}>
        <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`}/>
    </button>
);


const ModuleManagementScreen: React.FC<ModuleManagementScreenProps> = ({ enabledModules, setEnabledModules, customModules, setActiveScreen }) => {
    
    const handleToggleModule = (moduleId: Screen | TeacherScreen | string) => {
        setEnabledModules(prev => {
            const newSet = new Set(prev);
            if (newSet.has(moduleId)) {
                newSet.delete(moduleId);
            } else {
                newSet.add(moduleId);
            }
            return newSet;
        });
    };

    const studentModules = ALL_MODULES.filter(m => m.role === UserRole.Student);
    const teacherModules = ALL_MODULES.filter(m => m.role === UserRole.Teacher);
    const customStudentModules = customModules.filter(m => m.role === UserRole.Student);
    const customTeacherModules = customModules.filter(m => m.role === UserRole.Teacher);

    const renderCustomModuleDetails = (module: CustomModule) => (
        <>
            <p className="text-xs text-slate-500">Modo: {module.gameMode}</p>
            <p className="text-xs text-slate-500">Acceso: {module.accessMethod}</p>
        </>
    );

    return (
        <div className="space-y-8">
             <button 
                onClick={() => setActiveScreen(AdminScreen.ModuleCreator)}
                className="w-full py-3 bg-indigo-500 text-white font-bold rounded-lg shadow-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75 transition transform hover:scale-105 flex items-center justify-center"
            >
                <ion-icon name="add-circle-outline" class="mr-2 text-xl"></ion-icon>
                Crear Nuevo Módulo
            </button>
            <div>
                <div className="bg-white p-6 rounded-t-2xl shadow-sm border-x border-t border-slate-200">
                    <h2 className="text-xl font-bold text-slate-800">Módulos de Estudiantes</h2>
                    <p className="text-slate-500 mt-1">Activa o desactiva las funcionalidades para los estudiantes.</p>
                </div>
                <div className="space-y-3 p-4 bg-white rounded-b-2xl border-x border-b border-slate-200 shadow-sm">
                    {studentModules.map(module => (
                        <div key={module.id} className="bg-slate-50/70 p-4 rounded-xl flex justify-between items-center">
                            <div>
                                <p className="font-semibold text-slate-700">{module.name}</p>
                                <p className="text-xs text-slate-500">{module.description}</p>
                            </div>
                            <ToggleSwitch enabled={enabledModules.has(module.id)} onChange={() => handleToggleModule(module.id)} />
                        </div>
                    ))}
                    {customStudentModules.map(module => (
                        <div key={module.id} className="bg-indigo-50/70 p-4 rounded-xl flex justify-between items-center border border-indigo-200">
                            <div>
                                <p className="font-semibold text-indigo-800 flex items-center gap-2"><ion-icon name={module.icon}></ion-icon> {module.name} (Custom)</p>
                                {renderCustomModuleDetails(module)}
                            </div>
                            <ToggleSwitch enabled={enabledModules.has(module.id)} onChange={() => handleToggleModule(module.id)} />
                        </div>
                    ))}
                </div>
            </div>
             <div>
                <div className="bg-white p-6 rounded-t-2xl shadow-sm border-x border-t border-slate-200">
                    <h2 className="text-xl font-bold text-slate-800">Módulos de Docentes</h2>
                    <p className="text-slate-500 mt-1">Activa o desactiva las herramientas para los docentes.</p>
                </div>
                 <div className="space-y-3 p-4 bg-white rounded-b-2xl border-x border-b border-slate-200 shadow-sm">
                    {teacherModules.map(module => (
                        <div key={module.id} className="bg-slate-50/70 p-4 rounded-xl flex justify-between items-center">
                            <div>
                                <p className="font-semibold text-slate-700">{module.name}</p>
                                <p className="text-xs text-slate-500">{module.description}</p>
                            </div>
                            <ToggleSwitch enabled={enabledModules.has(module.id)} onChange={() => handleToggleModule(module.id)} />
                        </div>
                    ))}
                     {customTeacherModules.map(module => (
                        <div key={module.id} className="bg-indigo-50/70 p-4 rounded-xl flex justify-between items-center border border-indigo-200">
                            <div>
                                <p className="font-semibold text-indigo-800 flex items-center gap-2"><ion-icon name={module.icon}></ion-icon> {module.name} (Custom)</p>
                                {renderCustomModuleDetails(module)}
                            </div>
                            <ToggleSwitch enabled={enabledModules.has(module.id)} onChange={() => handleToggleModule(module.id)} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ModuleManagementScreen;