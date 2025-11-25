import React from 'react';
import { TrophyIcon, XMarkIcon } from '@heroicons/react/24/solid'; 

const VictoryModal = ({ data, onClose }) => {
  const exerciseName = data?.name?.detail || 'Exercício Secreto';
  const gifUrl = data?.gifUrl;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 transition-opacity duration-300"> 
      <div className="bg-gray-900 border-2 border-yellow-500 rounded-2xl shadow-2xl shadow-yellow-500/30 w-full max-w-md p-6 sm:p-8 text-center relative animate-fade-in">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-400 hover:text-yellow-500 transition-colors"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>

        <TrophyIcon className="h-16 w-16 mx-auto text-yellow-500 mb-4 animate-bounce-slow" />
        
        <h2 className="text-3xl font-extrabold text-yellow-400 mb-2">
          VITÓRIA!
        </h2>
        <p className="text-gray-300 mb-6 text-lg">
          Você acertou o exercício do dia!
        </p>

        <div className="mb-6">
          <p className="text-xl font-bold capitalize text-white">
            {exerciseName}
          </p>
          {gifUrl && (
            <div className="mt-4 border-2 border-gray-700 rounded-lg overflow-hidden mx-auto max-w-[200px]">
              <img 
                src={gifUrl} 
                alt={exerciseName} 
                className="w-full h-auto object-cover" 
              />
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          className="w-full bg-yellow-500 text-black font-bold py-3 rounded-lg hover:bg-yellow-400 transition-colors shadow-lg shadow-yellow-500/40"
        >
          Fechar
        </button>
      </div>
    </div>
  );
};

export default VictoryModal;