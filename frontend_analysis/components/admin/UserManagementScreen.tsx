import React from 'react';
import { User, UserRole } from '../../types';

const MOCK_USERS: User[] = [
    { name: 'Alex Innovator', level: 12, imageUrl: 'https://picsum.photos/seed/user123/200/200', achievements: [], role: UserRole.Student },
    { name: 'Prof. Diana Salas', level: 99, imageUrl: 'https://picsum.photos/seed/teacher123/200/200', achievements: [], role: UserRole.Teacher },
    { name: 'Ana García', level: 14, imageUrl: 'https://picsum.photos/seed/student1/100/100', achievements: [], role: UserRole.Student },
    { name: 'Luis Pérez', level: 11, imageUrl: 'https://picsum.photos/seed/student2/100/100', achievements: [], role: UserRole.Student },
];

const UserCard: React.FC<{ user: User }> = ({ user }) => {
    const handleRoleChange = (userName: string) => {
        alert(`Cambiar rol para ${userName}`);
    };

    const handleDeleteUser = (userName: string) => {
        if (confirm(`¿Estás seguro de que quieres eliminar a ${userName}?`)) {
            alert(`${userName} ha sido eliminado.`);
        }
    };

    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center space-x-4">
                <img className="h-12 w-12 rounded-full object-cover" src={user.imageUrl} alt={user.name} />
                <div className="flex-grow">
                    <p className="text-sm font-bold text-slate-900">{user.name}</p>
                    <span className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === UserRole.Teacher ? 'bg-indigo-100 text-indigo-800' : 'bg-sky-100 text-sky-800'}`}>
                        {user.role}
                    </span>
                </div>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100 flex justify-end space-x-3">
                <button onClick={() => handleRoleChange(user.name)} className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1">
                    <ion-icon name="create-outline"></ion-icon>
                    <span>Editar Rol</span>
                </button>
                <button onClick={() => handleDeleteUser(user.name)} className="text-xs font-semibold text-red-600 hover:text-red-800 flex items-center space-x-1">
                    <ion-icon name="trash-outline"></ion-icon>
                    <span>Eliminar</span>
                </button>
            </div>
        </div>
    );
};


const UserManagementScreen: React.FC = () => {
    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h2 className="text-xl font-bold text-slate-800">Gestión de Usuarios</h2>
                <p className="text-slate-500 mt-1">Administra los roles y el acceso de los usuarios.</p>
            </div>
            
            <div className="space-y-4">
                {MOCK_USERS.map((user) => (
                    <UserCard key={user.name} user={user} />
                ))}
            </div>
        </div>
    );
};

export default UserManagementScreen;