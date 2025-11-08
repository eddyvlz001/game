import React, { useState } from 'react';
import { UserRole } from '../types';

interface LoginScreenProps {
  onLoginSuccess: (role: UserRole) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [view, setView] = useState<'login' | 'register' | 'forgotPassword'>('login');
  const [role, setRole] = useState<UserRole>(UserRole.Student);
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleAdminLoginToggle = () => {
    setIsAdminLogin(!isAdminLogin);
    setView('login');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAdminLogin) {
        if (email === 'eddmi@gmail.com' && password === 'app2025*') {
            onLoginSuccess(UserRole.Admin);
        } else {
            alert('Credenciales de administrador incorrectas.');
        }
        return;
    }

    if (view === 'login' || view === 'register') {
      onLoginSuccess(role);
    } else {
       alert('Se ha enviado un enlace para restablecer la contraseña a tu correo electrónico.');
       setView('login');
    }
  };
  
  const getTitle = () => {
    if (isAdminLogin) return 'Acceso de Administrador';
    switch (view) {
      case 'login': return 'Bienvenido de Nuevo';
      case 'register': return 'Crea tu Cuenta';
      case 'forgotPassword': return 'Recuperar Contraseña';
    }
  };

  const getSubtitle = () => {
    if (isAdminLogin) return 'Ingresa tus credenciales para gestionar la aplicación.';
    switch (view) {
      case 'login': return 'Inicia sesión para continuar tu aventura.';
      case 'register': return `Únete como ${role === UserRole.Student ? 'Estudiante' : 'Docente'}.`;
      case 'forgotPassword': return 'Ingresa tu correo para recibir un enlace de recuperación.';
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center h-full p-8 bg-gradient-to-br from-slate-100 to-gray-200 text-slate-800">
      <div className="text-center mb-10">
        <h1 className={`text-4xl font-bold mb-2 ${isAdminLogin ? 'text-indigo-700' : 'text-sky-600'}`}>{getTitle()}</h1>
        <p className="text-slate-500">{getSubtitle()}</p>
      </div>

       {view === 'register' && !isAdminLogin && (
        <div className="mb-6 w-full max-w-sm">
            <div className="relative flex p-1 bg-slate-200 rounded-full">
                <button
                    onClick={() => setRole(UserRole.Student)}
                    className={`w-1/2 rounded-full py-2 text-sm font-bold transition-colors ${role === UserRole.Student ? 'bg-white text-sky-600 shadow' : 'text-slate-500'}`}>
                    Estudiante
                </button>
                <button
                    onClick={() => setRole(UserRole.Teacher)}
                    className={`w-1/2 rounded-full py-2 text-sm font-bold transition-colors ${role === UserRole.Teacher ? 'bg-white text-sky-600 shadow' : 'text-slate-500'}`}>
                    Docente
                </button>
            </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="w-full max-w-sm">
        <div className="space-y-4">
          {view === 'register' && !isAdminLogin && (
            <>
              <input
                type="text"
                placeholder="Nombre Completo"
                className="w-full px-4 py-3 bg-white rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-400 transition"
                required
              />
               <input
                type="file"
                aria-label="Foto de Perfil"
                className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100"
              />
            </>
          )}
          
          <input
            type="email"
            placeholder="Correo Electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-white rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-400 transition"
            required
          />

          {((view === 'login' || view === 'register') || isAdminLogin) && (
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-400 transition"
              required
            />
          )}
          
           {view === 'register' && !isAdminLogin && role === UserRole.Student && (
             <input
              type="text"
              placeholder="Código de Sala"
              className="w-full px-4 py-3 bg-white rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-400 transition"
            />
          )}

            {view === 'register' && !isAdminLogin && role === UserRole.Teacher && (
             <input
              type="text"
              placeholder="Áreas de Expertise (ej. Frontend, React)"
              className="w-full px-4 py-3 bg-white rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-400 transition"
            />
          )}

        </div>

        {view === 'login' && !isAdminLogin && (
           <div className="text-right mt-4">
            <button
              type="button"
              onClick={() => setView('forgotPassword')}
              className="text-sm font-semibold text-sky-600 hover:underline focus:outline-none"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>
        )}

        <button
          type="submit"
          className={`w-full mt-8 py-3 text-white font-bold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-opacity-75 transition transform hover:scale-105 ${isAdminLogin ? 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-400' : 'bg-sky-500 hover:bg-sky-600 focus:ring-sky-400'}`}
        >
          {isAdminLogin && 'Ingresar como Admin'}
          {!isAdminLogin && view === 'login' && 'Iniciar Sesión'}
          {!isAdminLogin && view === 'register' && 'Registrarse'}
          {!isAdminLogin && view === 'forgotPassword' && 'Enviar Enlace'}
        </button>
      </form>
      
      {!isAdminLogin && (
        <p className="mt-8 text-sm text-slate-500">
          {view === 'login' && '¿No tienes una cuenta?'}
          {view === 'register' && '¿Ya tienes una cuenta?'}
          {view === 'forgotPassword' && '¿Recordaste tu contraseña?'}
          <button
            onClick={() => setView(view === 'login' || view === 'forgotPassword' ? 'register' : 'login')}
            className="ml-2 font-semibold text-sky-600 hover:underline focus:outline-none"
          >
            {view === 'login' || view === 'forgotPassword' ? 'Regístrate' : 'Inicia Sesión'}
          </button>
        </p>
      )}

      <button 
        onClick={handleAdminLoginToggle} 
        className="absolute bottom-6 right-6 p-3 rounded-full bg-slate-200 text-slate-600 hover:bg-slate-300 hover:text-indigo-700 transition"
        aria-label="Acceso de Administrador"
      >
        <ion-icon name={isAdminLogin ? "person-circle-outline" : "shield-outline"} class="text-2xl"></ion-icon>
      </button>
    </div>
  );
};

export default LoginScreen;