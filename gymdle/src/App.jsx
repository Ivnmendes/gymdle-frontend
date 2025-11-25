import { useState, useEffect } from "react";

import { HandRaisedIcon, ListBulletIcon, CameraIcon, StarIcon } from '@heroicons/react/24/outline';

import SearchBar from "./components/SearchBar";
import GuessRow from "./components/GuessRow";
import VictoryModal from "./components/VictoryModal";
import HintButton from "./components/HintButton";
import FormattedHintContent from "./components/FormattedHintContent";

import { fetchExercisesNames } from "./services/fetchExercisesNames";
import { fetchGuess } from "./services/fetchGuess";
import { fetchBodyPartHint, fetchInstructionsHint, fetchGifHint } from "./services/fetchHints";

import bgImage from './assets/background.png';

const STORAGE_KEY = 'gymdleGuesses';
const MIN_GUESSES_FOR_HINT = 3;

const getTodayString = () => new Date().toLocaleDateString('pt-BR');

function App() {
  const [exercises, setExercises] = useState([]);
  const [showVictory, setShowVictory] = useState(false);
  const [isWin, setIsWin] = useState(false);
  const [guessCount, setGuessCount] = useState(0);
  const [hintBodyPart, setHintBodyPart] = useState(false);
  const [hintInstructions, setHintInstructions] = useState(false);
  const [hintGif, setHintGif] = useState(false);
  const [bodyPartHintData, setBodyPartHintData] = useState(null);
  const [instructionsHintData, setInstructionsHintData] = useState(null);
  const [gifHintData, setGifHintData] = useState(null);
  const [activeHint, setActiveHint] = useState(null);
  const [latestGuessId, setLatestGuessId] = useState(null);
  const [guesses, setGuesses] = useState(() => {
    const storedData = localStorage.getItem(STORAGE_KEY);
    const today = getTodayString();

    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        
        if (parsedData.date === today && Array.isArray(parsedData.guesses)) {
          return parsedData.guesses;
        }
      } catch (e) {
        console.error("Erro ao fazer parse do storage:", e);
      }
    }

    return [];
  });

  const handleHintToggle = (hintType) => {
      setActiveHint(prev => (prev === hintType ? null : hintType));
  };

  const handleOpenVictory = () => {
    if (isWin) {
      setShowVictory(true);
    }
  };

  const removeExerciseFromOptions = (exerciseId) => {
    setExercises((prevExercises) => 
      prevExercises.filter((exercise) => exercise.exerciseId !== exerciseId)
    );
  };

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const allExercises = await fetchExercisesNames(); 
        
        if (guesses.length > 0) {
          const guessedIds = new Set(guesses.map(g => g.exerciseId));
          const filtered = allExercises.filter(
            (exercise) => !guessedIds.has(exercise.exerciseId) 
          );
          setExercises(filtered);
        } else {
          setExercises(allExercises);
        }

      } catch (error) {
        console.error("Failed to fetch exercises:", error);
      }
    };

    fetchExercises();
  }, []);

  useEffect(() => {
    const payload = {
      date: getTodayString(),
      guesses: guesses
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [guesses]);

  useEffect(() => {
    if (guesses.length > 0) {
      setGuessCount(guesses.length);
      const latestGuess = guesses[0];
      
      const requiredKeys = ['name', 'targetMuscles', 'bodyParts', 'equipments', 'secondaryMuscles', 'type', 'grip'];
      const currentWinState = requiredKeys.every(
        key => latestGuess[key] && latestGuess[key].status === 'right'
      );

      if (currentWinState) {
        const timer = setTimeout(() => {
          setShowVictory(true); 
        }, 2000);
        setIsWin(true);

        return () => clearTimeout(timer);
      }
    } else {
        setGuessCount(0);
    }
  }, [guesses]);

  const handleGuess = async (exerciseId) => {
    try {
      const result = await fetchGuess(exerciseId); 

      setGuesses((prevGuesses) => [result, ...prevGuesses]); 
      
      setLatestGuessId(result.exerciseId);

      removeExerciseFromOptions(exerciseId);
    } catch (error) {
      console.error("Erro no processamento do chute:", error);
    }
  };

const handleHintClick = async (hintType) => {
    const isUnlocked = 
      (hintType === 'body' && hintBodyPart) || 
      (hintType === 'instructions' && hintInstructions) || 
      (hintType === 'gif' && hintGif);

    if (isUnlocked) {
        handleHintToggle(hintType);
        return;
    }

    if (!isWin && guessCount < MIN_GUESSES_FOR_HINT) {
        return; 
    }
    
    let success = false;

    try {
        if (hintType === 'body') {
            const hintData = await fetchBodyPartHint();
            
            let normalizedValue = hintData.bodyParts;
            try {
                const parsedArray = JSON.parse(normalizedValue.replace(/'/g, '"'));
                normalizedValue = parsedArray.join(', ');
            } catch (e) {
                normalizedValue = hintData.bodyParts;
            }

            setBodyPartHintData(normalizedValue);
            setHintBodyPart(true);
            success = true;
            
        } else if (hintType === 'instructions') {
            const hintData = await fetchInstructionsHint();
            setInstructionsHintData(hintData.instructions.join('\n'));
            setHintInstructions(true);
            success = true;
            
        } else if (hintType === 'gif') {
            const hintData = await fetchGifHint();
            setGifHintData(hintData.gifUrl);
            setHintGif(true);
            success = true;
        }

        if (success) {
            setActiveHint(hintType);
        }

    } catch (error) {
        console.error(`Falha ao buscar a dica de ${hintType}:`, error);
    }
  };

  const getActiveHintContent = () => {
    switch (activeHint) {
        case 'body':
            return bodyPartHintData || 'Dica de Parte do Corpo não carregada.'; 
        case 'instructions':
            return instructionsHintData || 'Dica de Instruções não carregada.';
        case 'gif':
            return ' '
        default:
            return null;
    }
  };

  return (
    <div 
      className="min-h-screen flex flex-col items-center pt-12 px-4 pb-20 font-sans"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.75), rgba(0,0,0,0.90)), url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="mb-8 text-center">
        <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500 drop-shadow-lg tracking-tighter">
          GYMDLE
        </h1>
        <p className="text-gray-400 mt-2 text-sm tracking-widest uppercase">Adivinhe o exercício do dia</p>
      </div>
      
      <div className="w-full max-w-lg mb-6 flex justify-center space-x-4">
        <HintButton 
          icon={HandRaisedIcon} 
          label="Parte do Corpo" 
          isAvailable={(guessCount >= MIN_GUESSES_FOR_HINT || isWin) && !hintBodyPart}
          isUsed={hintBodyPart}
          isActive={activeHint === 'body'}
          onClick={() => handleHintClick('body')}
        />
        <HintButton 
          icon={ListBulletIcon} 
          label="Instruções" 
          isAvailable={(guessCount >= MIN_GUESSES_FOR_HINT * 2 || isWin) && !hintInstructions}
          isUsed={hintInstructions}
          isActive={activeHint === 'instructions'}
          onClick={() => handleHintClick('instructions')}
        />
        <HintButton 
          icon={CameraIcon} 
          label="GIF" 
          isAvailable={(guessCount >= MIN_GUESSES_FOR_HINT * 3 || isWin) && !hintGif}
          isUsed={hintGif}
          isActive={activeHint === 'gif'}
          onClick={() => handleHintClick('gif')}
        />
      </div>

      {activeHint && (
        <div className="w-full max-w-lg mb-6 transition-all duration-300 ease-in-out" 
           style={{
               maxHeight: activeHint ? '18rem' : '0rem',
           }}>
          <div className={`flex items-center justify-center w-full p-4 bg-gray-900 border-l-4 border-yellow-500 rounded-lg shadow-xl 
                           min-h-[18rem] h-full overflow-y-auto 
                           ${activeHint ? 'opacity-100' : 'opacity-0'} `}>
              <FormattedHintContent 
                  activeHint={activeHint} 
                  content={getActiveHintContent()}
              />
              {activeHint === 'gif' && (isWin || hintGif) && (
                  <div className="border-2 border-gray-700 rounded-lg overflow-hidden mx-auto max-w-[200px]">
                      <img 
                          src={gifHintData || guesses[0]?.gifUrl}
                          alt="Dica de GIF" 
                          className="w-full h-auto object-cover" 
                      />
                  </div>
              )}
          </div>
        </div>
      )}

      <SearchBar 
        allExercises={exercises} 
        onGuess={handleGuess} 
        isDisabled={isWin}
      />

      {isWin && !showVictory && (
        <button
          onClick={handleOpenVictory}
          className="fixed bottom-6 right-6 p-3 bg-yellow-500 rounded-full shadow-2xl shadow-yellow-500/50 
                     hover:bg-yellow-400 transition-all transform hover:scale-110 z-40"
          aria-label="Reabrir Modal de Vitória"
        >
          <StarIcon className="h-6 w-6 text-black" />
        </button>
      )}

      {showVictory && (
        <VictoryModal 
          data={guesses[0]}
          onClose={() => setShowVictory(false)}
        />
      )}

      <div className="w-full max-w-[1200px] mt-10 flex flex-col">
        
        <div className="w-full overflow-x-auto pb-4 px-2">
          {guesses.length > 0 && (
            <div className="grid grid-cols-7 gap-2 min-w-[900px] mb-3 text-gray-400 text-center text-[10px] md:text-xs uppercase font-bold tracking-wider">
              <span>Exercício</span>
              <span>Músculo Alvo</span>
              <span>Parte do Corpo</span>
              <span>Equipamento</span>
              <span>Secundários</span>
              <span>Tipo</span>
              <span>Pegada</span>
            </div>
          )}

          <div className="flex flex-col w-full">
            {guesses.map((guess) => (
              <GuessRow 
                key={guess.exerciseId} 
                data={guess}
                shouldAnimate={guess.exerciseId === latestGuessId}  
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;