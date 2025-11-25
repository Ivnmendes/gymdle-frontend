import React from 'react';

const getStatusClass = (status) => {
  switch (status) {
    case 'right':
      return 'bg-green-500 border-green-400 shadow-[0_0_10px_rgba(34,197,94,0.5)]';
    case 'wrong':
      return 'bg-red-600 border-red-600 shadow-[0_0_10px_rgba(220,38,38,0.5)]';
    case 'partial':
      return 'bg-yellow-500 border-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]';
    default:
      return 'bg-gray-800/70 border-gray-700';
  }
};

const renderContent = (detail) => {
  if (Array.isArray(detail)) return detail.join(', ');
  return detail;
};

const FlipCard = ({ children, status, delayIndex, shouldAnimate, isImageCard = false, gifUrl = null }) => {
  return (
    <div className="h-20 w-full perspective-1000">
      
      <div 
        style={{ animationDelay: shouldAnimate ? `${delayIndex * 300}ms` : '0ms' }} 
        className={`
          relative w-full h-full preserve-3d
          ${shouldAnimate ? 'animate-flip' : 'rotate-y-180'} 
        `}
      >
        <div className="absolute inset-0 w-full h-full backface-hidden">
          <div className="w-full h-full bg-gray-900 border-2 border-yellow-600/40 rounded-lg flex items-center justify-center shadow-lg">
             <div className="w-1.5 h-1.5 bg-yellow-600/50 rounded-full"></div>
          </div>
        </div>

        <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
          <div className={`
             w-full h-full flex flex-col items-center justify-center p-1 
             border-2 rounded-lg shadow-md overflow-hidden relative
             ${getStatusClass(status)}
          `}>
             
             {isImageCard && gifUrl && (
                <>
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] z-0" />
                  <img src={gifUrl} alt="background" className="absolute w-full h-full object-cover opacity-30 z-0" />
                </>
             )}
             
             <div className="z-10 relative text-center w-full flex items-center justify-center h-full">
                <span className={`
                  break-words capitalize font-medium leading-tight select-none
                  ${isImageCard ? 'text-sm font-extrabold text-shadow' : 'text-xs sm:text-sm'}
                `}
                style={isImageCard ? { textShadow: '0 0 5px #000, 0 0 10px #000' } : {}}
                >
                  {children}
                </span>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};

const GuessRow = ({ data, shouldAnimate }) => {
  return (
    <div className="grid grid-cols-7 gap-2 w-full min-w-[900px] mb-3 p-0.5">
      <FlipCard 
        status={data.name.status} 
        delayIndex={0} 
        isImageCard={true} 
        gifUrl={data.gifUrl} 
        shouldAnimate={shouldAnimate}
      >
        {data.name.detail}
      </FlipCard>

      <FlipCard 
        status={data.targetMuscles.status} 
        delayIndex={1} 
        shouldAnimate={shouldAnimate}
      >
        {renderContent(data.targetMuscles.detail)}
      </FlipCard>

      <FlipCard 
        status={data.bodyParts.status} 
        delayIndex={2} 
        shouldAnimate={shouldAnimate}
      >
        {renderContent(data.bodyParts.detail)}
      </FlipCard>

      <FlipCard 
        status={data.equipments.status} 
        delayIndex={3} 
        shouldAnimate={shouldAnimate}
      >
        {renderContent(data.equipments.detail)}
      </FlipCard>

      <FlipCard 
        status={data.secondaryMuscles.status} 
        delayIndex={4} 
        shouldAnimate={shouldAnimate}
      >
        {renderContent(data.secondaryMuscles.detail)}
      </FlipCard>

      <FlipCard 
        status={data.type.status} 
        delayIndex={5} 
        shouldAnimate={shouldAnimate}
      >
        {renderContent(data.type.detail)}
      </FlipCard>

      <FlipCard 
        status={data.grip.status} 
        delayIndex={6} 
        shouldAnimate={shouldAnimate}
      >
        {renderContent(data.grip.detail)}
      </FlipCard>
    </div>
  );
};

export default GuessRow;