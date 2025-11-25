import React from 'react';

const MIN_GUESSES_FOR_HINT = 3;

const HintButton = ({ icon: Icon, label, onClick, isAvailable, isUsed, isActive }) => {
  
  let baseClasses = "flex flex-col items-center p-2 rounded-lg transition-all duration-300 text-sm font-semibold w-1/3";
  let iconClasses = "h-6 w-6 mb-1";
  
  if (isUsed || isActive) {
    baseClasses += " bg-gray-800 text-gray-400 cursor-pointer";
    iconClasses += " text-gray-400";
    
    if (isActive) {
        baseClasses = baseClasses.replace('bg-gray-800', 'bg-yellow-800/50 border border-yellow-500 text-yellow-300 shadow-md shadow-yellow-500/10');
        iconClasses = iconClasses.replace('text-gray-400', 'text-yellow-300');
    }
  } else if (isAvailable) {
    baseClasses += " bg-yellow-500 text-black shadow-lg shadow-yellow-500/50 hover:bg-yellow-400 hover:scale-[1.03] cursor-pointer";
    iconClasses += " text-black";
  } else {
    baseClasses += " bg-gray-900 border border-gray-700 text-gray-600 cursor-not-allowed opacity-50";
    iconClasses += " text-gray-600";
  }

  return (
    <button
      onClick={onClick}
      disabled={!isAvailable || isUsed}
      className={baseClasses}
      title={isAvailable ? `Ativar dica: ${label}` : `Disponível após ${MIN_GUESSES_FOR_HINT} palpites.`}
    >
      <Icon className={iconClasses} />
      <span className="text-xs uppercase leading-none">{label}</span>
    </button>
  );
};

export default HintButton;