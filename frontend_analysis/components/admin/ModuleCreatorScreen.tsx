import React, { useState } from 'react';
import { CustomModule, UserRole } from '../../types';

interface ModuleCreatorScreenProps {
    onModuleCreate: (module: CustomModule) => void;
    onCancel: () => void;
}

const ICONS = ['rocket', 'game-controller', 'book', 'trophy', 'school', 'extension-puzzle', 'flask', 'star'];

const ModuleCreatorScreen: React.FC<ModuleCreatorScreenProps> = ({ onModuleCreate, onCancel }) => {
    const [name, setName] = useState('');
    const [icon, setIcon] = useState('rocket');
    const [role, setRole] = useState<UserRole.Student | UserRole.Teacher>(UserRole.Student);
    const [gameMode, setGameMode] = useState<'individual' | 'group'>('individual');
    const [accessMethod, setAccessMethod] = useState<'code' | 'qr' | 'both'>('code');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim() === '') {
            alert('El módulo debe tener un nombre.');
            return;
        }

        const newModule: CustomModule = {
            id: `custom_${Date.now()}`,
            name,
            icon: `${icon}-outline`,
            role,
            gameMode,
            accessMethod
        };

        onModuleCreate(newModule);
    };

    const FormSection: React.FC<{title: string; children: React.ReactNode}> = ({ title, children }) => (
        <div>
            <h3 className="text-md font-bold text-slate-700 mb-2">{title}</h3>
            {children}
        </div>
    );

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
            <FormSection title="Nombre del Módulo">
                <input 
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej: Desafío Semanal"
                    className="w-full px-4 py-2 bg-slate-100 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                />
            </FormSection>

            <FormSection title="Ícono">
                <div className="grid grid-cols-4 gap-2">
                    {ICONS.map(iconName => (
                        <button 
                            key={iconName}
                            type="button"
                            onClick={() => setIcon(iconName)}
                            className={`py-3 rounded-lg flex justify-center items-center text-3xl transition-colors ${icon === iconName ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                        >
                            <ion-icon name={`${iconName}-outline`}></ion-icon>
                        </button>
                    ))}
                </div>
            </FormSection>
            
            <FormSection title="Asignar a Rol">
                 <div className="relative flex p-1 bg-slate-200 rounded-full">
                    <button type="button" onClick={() => setRole(UserRole.Student)} className={`w-1/2 rounded-full py-2 text-sm font-bold transition-colors ${role === UserRole.Student ? 'bg-white text-sky-600 shadow' : 'text-slate-500'}`}>Estudiante</button>
                    <button type="button" onClick={() => setRole(UserRole.Teacher)} className={`w-1/2 rounded-full py-2 text-sm font-bold transition-colors ${role === UserRole.Teacher ? 'bg-white text-indigo-600 shadow' : 'text-slate-500'}`}>Docente</button>
                </div>
            </FormSection>

            <FormSection title="Modo de Juego">
                <div className="flex flex-col space-y-2">
                    <label className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg"><input type="radio" name="gameMode" value="individual" checked={gameMode === 'individual'} onChange={() => setGameMode('individual')} className="h-4 w-4 text-indigo-600 border-slate-300"/><span>Individual</span></label>
                    <label className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg"><input type="radio" name="gameMode" value="group" checked={gameMode === 'group'} onChange={() => setGameMode('group')} className="h-4 w-4 text-indigo-600 border-slate-300"/><span>Grupal</span></label>
                </div>
            </FormSection>
            
            <FormSection title="Método de Acceso">
                 <div className="flex flex-col space-y-2">
                    <label className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg"><input type="radio" name="accessMethod" value="code" checked={accessMethod === 'code'} onChange={() => setAccessMethod('code')} className="h-4 w-4 text-indigo-600 border-slate-300"/><span>Código Único</span></label>
                    <label className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg"><input type="radio" name="accessMethod" value="qr" checked={accessMethod === 'qr'} onChange={() => setAccessMethod('qr')} className="h-4 w-4 text-indigo-600 border-slate-300"/><span>Escáner QR</span></label>
                    <label className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg"><input type="radio" name="accessMethod" value="both" checked={accessMethod === 'both'} onChange={() => setAccessMethod('both')} className="h-4 w-4 text-indigo-600 border-slate-300"/><span>Ambos</span></label>
                </div>
            </FormSection>

            <div className="flex justify-end space-x-3 pt-4 border-t">
                <button type="button" onClick={onCancel} className="px-6 py-2 rounded-lg text-slate-600 bg-slate-100 hover:bg-slate-200 font-semibold transition">Cancelar</button>
                <button type="submit" className="px-6 py-2 rounded-lg bg-indigo-500 text-white font-bold shadow-md hover:bg-indigo-600 transition">Guardar Módulo</button>
            </div>
        </form>
    );
};

export default ModuleCreatorScreen;
