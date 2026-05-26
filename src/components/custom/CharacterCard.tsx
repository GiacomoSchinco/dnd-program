// components/custom/CharacterCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import AncientCardContainer from './AncientCardContainer';
import { AntiqueButton } from './AntiqueButton';
import HpBar from './HpBar';
import CardBack from './CardBack';
import { cn } from '@/lib/utils';
import { type CardSize, CARD_SIZES } from '@/lib/utils/cardSizes';
import { getEnglishClass, getItalianClass, getItalianRace } from '@/lib/utils/nameMappers';
import { CharacterLevelBadge } from './CharacterLevelBadge';

interface CharacterCardProps {
  id: number;
  name: string;
  race: string;
  characterClass: string;
  level: number;
  background?: string;
  alignment?: string;
  currentHp?: number;
  maxHp?: number;
  tempHp?: number;
  isFlippable?: boolean;
  size?: CardSize;
  showDetailsButton?: boolean;
  showManagementActions?: boolean;
  onAddToCombat?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const CharacterCard: React.FC<CharacterCardProps> = ({
  id,
  name,
  race,
  characterClass,
  level,
  background,
  alignment,
  currentHp,
  maxHp,
  tempHp,
  isFlippable = false,
  size = 'md',
  showDetailsButton = true,
  showManagementActions = false,
  onAddToCombat,
  onEdit,
  onDelete,
}) => {
  const [isFlipped, setIsFlipped] = React.useState(false);
  const tokenClass = getEnglishClass(characterClass).toLowerCase();
  
  const renderFront = () => (
    <AncientCardContainer className="w-full h-full" padded={false}>
      <div className="relative h-full flex flex-col p-6">
        {/* Header: Nome e Livello */}
        <div className="flex items-center justify-between gap-2 pb-2 border-b-2 border-amber-700/30">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-amber-900 font-serif truncate">
              {name}
            </h2>
          </div>
          <CharacterLevelBadge level={level} size="sm" showLabel={false} />
        </div>

        {/* Razza e Allineamento (opzionale) */}
        <div className="flex items-center justify-between gap-2 mt-1 mb-1">
          <div className="flex items-center gap-1">
            <span className="text-xs text-amber-600">🧝</span>
            <span className="text-sm font-serif font-medium text-amber-800">
              {getItalianRace(race)}
            </span>
          </div>
          {alignment && (
            <div className="flex items-center gap-1">
              <span className="text-xs text-amber-600">⚖️</span>
              <span className="text-sm font-serif text-amber-700">
                {alignment}
              </span>
            </div>
          )}
        </div>

        {/* Barra HP */}
        {currentHp !== undefined && maxHp !== undefined && (
          <HpBar size='small' current={currentHp} max={maxHp} tempHp={tempHp} />
        )}

        {/* Immagine personaggio */}
        <div className="flex-1 flex items-center justify-center my-2">
          <div className="relative w-28 h-28 rounded-full border-2 border-amber-700/50 overflow-hidden bg-parchment-200/50 shadow-lg group">
            <img
              src={`/images/classes/token_${tokenClass}.png`}
              alt={getItalianClass(characterClass)}
              className="w-full h-full object-cover"
              loading="eager"
            />
            {/* Nome classe sovrapposto */}
            <div className="absolute inset-x-0 top-0 text-center py-1 bg-gradient-to-b from-black/80 to-transparent rounded-t-full">
              <span className="text-amber-200 text-[10px] font-serif tracking-wide font-semibold drop-shadow-md">
                {getItalianClass(characterClass).toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Background (opzionale) */}
        {background && (
          <div className="text-center mt-1">
            <span className="text-xs text-amber-600">📜</span>
            <span className="text-xs font-serif text-amber-700 ml-1">{background}</span>
          </div>
        )}

        {/* Pulsante Dettagli */}
        {showDetailsButton && (
          <div className="flex justify-center mt-3">
            <Link
              to={`/characters/${id}`}
              className={cn(
                "relative px-6 py-1.5",
                "bg-amber-700 text-amber-100 text-sm font-serif tracking-wide",
                "rounded-sm border-2 border-amber-900",
                "shadow-md hover:shadow-lg",
                "hover:bg-amber-800 hover:border-amber-950 hover:text-amber-50",
                "active:translate-y-0.5 transition-all duration-200",
                "before:content-[''] before:absolute before:inset-0",
                "before:border before:border-amber-500/30 before:rounded-sm before:pointer-events-none",
                "overflow-hidden"
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <span className="text-amber-300 text-xs">⚔️</span>
                Dettagli
                <span className="text-amber-300 text-xs">🛡️</span>
              </span>
            </Link>
          </div>
        )}

        {/* Azioni gestione (opzionali) */}
        {showManagementActions && (
          <div className="mt-3 rounded-lg border border-amber-700/25 bg-amber-100/35 p-2 space-y-2">
            <AntiqueButton
              variant="leather"
              size="sm"
              rounded="lg"
              shine
              className="w-full font-semibold tracking-wide"
              onClick={(e) => {
                e.stopPropagation()
                onAddToCombat?.()
              }}
            >
              ⚔️ Aggiungi al Combattimento
            </AntiqueButton>

            <div className="grid grid-cols-2 gap-2">
              <AntiqueButton
                size="sm"
                variant="parchment"
                rounded="lg"
                className="font-medium"
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit?.()
                }}
                title="Modifica"
              >
                ✏️ Modifica
              </AntiqueButton>
              <AntiqueButton
                size="sm"
                variant="danger"
                rounded="lg"
                className="font-medium"
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete?.()
                }}
                title="Elimina"
              >
                🗑 Elimina
              </AntiqueButton>
            </div>
          </div>
        )}
      </div>
    </AncientCardContainer>
  );

  return (
    <div 
      className={`relative cursor-pointer transition-all duration-700 transform-gpu preserve-3d ${
        isFlipped ? 'rotate-y-180' : ''
      } ${CARD_SIZES[size]}`}
      onClick={() => isFlippable && setIsFlipped(!isFlipped)}
      style={{ transformStyle: 'preserve-3d' }}
    >
      <div className="absolute w-full h-full backface-hidden">
        {renderFront()}
      </div>
      <div className="absolute w-full h-full backface-hidden rotate-y-180">
        <CardBack />
      </div>

      <style>{`
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
};

export default CharacterCard;