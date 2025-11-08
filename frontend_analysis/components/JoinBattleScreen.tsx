import React, { useState } from 'react';
import { Screen } from '../types';

interface JoinBattleScreenProps {
    onJoinSuccess: () => void;
}

const JoinBattleScreen: React.FC<JoinBattleScreenProps> = ({ onJoinSuccess }) => {
    const [roomCode, setRoomCode] = useState('');
    const [isScanning, setIsScanning] = useState(false);

    const handleJoinWithCode = (e: React.FormEvent) => {
        e.preventDefault();
        if (roomCode.trim().length > 0) {
            console.log(`Joining with code: ${roomCode}`);
            // Simulate success and navigate to lobby
            onJoinSuccess();
        } else {
            alert('Por favor, ingresa un código válido.');
        }
    };

    const handleScanQR = () => {
        setIsScanning(true);
        // In a real app, you would initialize the camera here.
        // For simulation, we'll just show the UI and simulate a successful scan after a delay.
        setTimeout(() => {
            console.log('QR code scanned successfully (simulated).');
            setIsScanning(false);
            onJoinSuccess();
        }, 3000);
    };

    if (isScanning) {
        return (
            <div className="relative flex flex-col items-center justify-center h-full bg-black text-white">
                <div className="absolute top-0 left-0 w-full h-full bg-slate-900 flex flex-col items-center justify-center p-4 z-20">
                    <p className="text-xl font-bold mb-4">Escaneando Código QR</p>
                    <div className="w-64 h-64 bg-gray-700 rounded-lg flex items-center justify-center relative overflow-hidden">
                        <p className="text-sm text-gray-400">Vista de cámara</p>
                        {/* Simulating scan line */}
                        <div className="absolute top-0 w-full h-1 bg-green-400 animate-[scan_2s_ease-in-out_infinite]"></div>
                        <style>{`
                            @keyframes scan {
                                0% { transform: translateY(0); }
                                100% { transform: translateY(256px); }
                            }
                        `}</style>
                    </div>
                    <p className="mt-4 text-slate-300 text-center">Apunta la cámara al código QR proporcionado por tu profesor.</p>
                    <button 
                        onClick={() => setIsScanning(false)}
                        className="mt-8 px-6 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full p-6 bg-slate-50 text-center">
            <h1 className="text-3xl font-bold text-slate-800 mb-4">Unirse a una Batalla</h1>
            <p className="text-slate-500 mb-10">Ingresa el código de la sala o escanea el código QR para comenzar.</p>

            <div className="w-full max-w-sm mx-auto flex-grow flex flex-col justify-center">
                <form onSubmit={handleJoinWithCode} className="space-y-4">
                    <input 
                        type="text"
                        value={roomCode}
                        onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                        placeholder="CÓDIGO DE SALA"
                        className="w-full text-center px-4 py-4 text-2xl font-bold tracking-[.25em] bg-white rounded-lg border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-400 transition"
                        maxLength={8}
                    />
                    <button
                        type="submit"
                        className="w-full py-3 bg-sky-500 text-white font-bold rounded-lg shadow-md hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-opacity-75 transition transform hover:scale-105"
                    >
                        Unirse con Código
                    </button>
                </form>

                <div className="my-8 flex items-center">
                    <div className="flex-grow border-t border-slate-300"></div>
                    <span className="flex-shrink mx-4 text-slate-400 font-semibold">O</span>
                    <div className="flex-grow border-t border-slate-300"></div>
                </div>

                <button
                    onClick={handleScanQR}
                    className="w-full py-3 bg-slate-700 text-white font-bold rounded-lg shadow-md hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-opacity-75 transition transform hover:scale-105 flex items-center justify-center space-x-2"
                >
                    <ion-icon name="qr-code-outline" class="text-2xl"></ion-icon>
                    <span>Escanear Código QR</span>
                </button>
            </div>
        </div>
    );
};

export default JoinBattleScreen;
