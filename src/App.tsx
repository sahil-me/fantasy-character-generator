/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Sparkles, 
  Wand2, 
  Sword, 
  Shield, 
  Crosshair, 
  Skull, 
  Dices, 
  Scroll, 
  RefreshCw, 
  Compass, 
  Feather, 
  BookOpen, 
  Heart, 
  Zap, 
  Layers, 
  BookmarkCheck, 
  BookmarkPlus, 
  Trash2, 
  CheckCircle2,
  ExternalLink,
  Search,
  Filter,
  ArrowUpDown,
  X,
  RotateCcw,
  ImageOff
} from 'lucide-react';

export type CharacterClass = 'Mage' | 'Rogue' | 'Warrior' | 'Ranger' | 'Paladin' | 'Necromancer';

export interface CharacterStats {
  health: number;
  mana: number;
  strength: number;
}

export interface Character {
  name: string;
  characterClass: CharacterClass;
  portraitSeed: number;
  stats: CharacterStats;
}

export interface SavedCharacter {
  id: string;
  name: string;
  characterClass: CharacterClass;
  portraitSeed: number;
  stats: CharacterStats;
  backstory: string | null;
  savedAt: number;
}

const CLASSES: CharacterClass[] = [
  'Mage',
  'Rogue',
  'Warrior',
  'Ranger',
  'Paladin',
  'Necromancer'
];

const FIRST_NAMES = [
  'Aeloria', 'Alastair', 'Astrid', 'Baelor', 'Branoc', 
  'Brynn', 'Caelum', 'Corvus', 'Daeron', 'Darian',
  'Elidyr', 'Elowen', 'Faeron', 'Gareth', 'Gwendolyn', 
  'Hadrian', 'Ignis', 'Isolde', 'Jareth', 'Kaelen',
  'Lyra', 'Malakor', 'Morwen', 'Niamh', 'Orion', 
  'Peregrine', 'Rhiannon', 'Rowan', 'Seraphina', 'Soren',
  'Tavish', 'Thalor', 'Thorgar', 'Vaelen', 'Valerius', 
  'Vespera', 'Wynne', 'Xanthos', 'Yvaine', 'Zephyra',
  'Aldous', 'Bastian', 'Cassian', 'Draven', 'Evander', 
  'Fenwick', 'Grimbald', 'Hespera', 'Ilyana', 'Jorund',
  'Kallisto', 'Lorcan', 'Miriel', 'Nereus', 'Padraic', 
  'Quillon', 'Roderick', 'Sylas', 'Theron', 'Vaughn'
];

const SURNAME_PREFIXES = [
  'Iron', 'Shadow', 'Storm', 'Frost', 'Dawn', 
  'Ember', 'Night', 'Sun', 'Deep', 'Raven', 
  'Silver', 'Oath', 'Wolf', 'Dread', 'Moon', 
  'Spell', 'Stone', 'Ash', 'Bright', 'Grave', 
  'Thunder', 'Star', 'Wild', 'Bramble', 'Rune'
];

const SURNAME_SUFFIXES = [
  'whisper', 'weaver', 'fall', 'strider', 'blade', 
  'walker', 'crest', 'bane', 'gard', 'forge', 
  'heart', 'caller', 'seeker', 'rider', 'vale', 
  'shroud', 'watcher', 'warden', 'brook', 'song', 
  'wind', 'caster', 'rend', 'borne', 'flame'
];

const TITLES = [
  'the Undaunted',
  'the Swift',
  'the Unbroken',
  'the Silent',
  'the Dawncaller',
  'the Spellbound',
  'the Valiant',
  'the Grim',
  'of the Silver Citadel',
  'of the Whispering Pines',
  'of Emberfall',
  'of the North Wind'
];

// Thematic Stat Ranges per Fantasy Class
const CLASS_STAT_RANGES: Record<CharacterClass, {
  health: [number, number];
  mana: [number, number];
  strength: [number, number];
}> = {
  Warrior: {
    health: [100, 135],
    mana: [20, 45],
    strength: [85, 100],
  },
  Mage: {
    health: [55, 75],
    mana: [110, 145],
    strength: [25, 48],
  },
  Paladin: {
    health: [90, 120],
    mana: [65, 95],
    strength: [75, 95],
  },
  Rogue: {
    health: [70, 92],
    mana: [45, 70],
    strength: [65, 88],
  },
  Ranger: {
    health: [75, 98],
    mana: [50, 75],
    strength: [62, 82],
  },
  Necromancer: {
    health: [60, 82],
    mana: [105, 140],
    strength: [30, 52],
  },
};

function generateStatsForClass(characterClass: CharacterClass): CharacterStats {
  const range = CLASS_STAT_RANGES[characterClass];
  const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
  return {
    health: rand(range.health[0], range.health[1]),
    mana: rand(range.mana[0], range.mana[1]),
    strength: rand(range.strength[0], range.strength[1]),
  };
}

function generateRandomName(): string {
  const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
  const nameStyle = Math.random();

  if (nameStyle < 0.65) {
    const prefix = SURNAME_PREFIXES[Math.floor(Math.random() * SURNAME_PREFIXES.length)];
    const suffix = SURNAME_SUFFIXES[Math.floor(Math.random() * SURNAME_SUFFIXES.length)];
    return `${firstName} ${prefix}${suffix}`;
  } else {
    const title = TITLES[Math.floor(Math.random() * TITLES.length)];
    return `${firstName} ${title}`;
  }
}

function getRandomClass(): CharacterClass {
  const index = Math.floor(Math.random() * CLASSES.length);
  return CLASSES[index];
}

const CLASS_CONFIG: Record<CharacterClass, {
  color: string;
  badgeBg: string;
  borderColor: string;
  glowColor: string;
  accentRune: string;
  element: string;
  icon: React.ComponentType<{ className?: string }>;
  tagline: string;
}> = {
  Mage: {
    color: 'text-indigo-300',
    badgeBg: 'bg-[#1e1730] text-[#c9bbf8] border-[#6b52a8]/60',
    borderColor: 'border-[#7559b5]/60',
    glowColor: 'shadow-[#6a4ea8]/20',
    accentRune: '🜁',
    element: 'Aether & Mercury',
    icon: Wand2,
    tagline: 'Master of arcane mysteries & celestial weave'
  },
  Rogue: {
    color: 'text-emerald-300',
    badgeBg: 'bg-[#12231c] text-[#a4e2c8] border-[#3a755d]/60',
    borderColor: 'border-[#3a7c61]/60',
    glowColor: 'shadow-[#2a684f]/20',
    accentRune: '🜃',
    element: 'Vitriol & Shadow',
    icon: Crosshair,
    tagline: 'Unseen blade in the midnight corridors'
  },
  Warrior: {
    color: 'text-rose-300',
    badgeBg: 'bg-[#291417] text-[#f4b6be] border-[#8a424e]/60',
    borderColor: 'border-[#8f3f4c]/60',
    glowColor: 'shadow-[#822f3d]/20',
    accentRune: '🜂',
    element: 'Martial Iron & Brimstone',
    icon: Sword,
    tagline: 'Stalwart champion of iron and valor'
  },
  Ranger: {
    color: 'text-amber-300',
    badgeBg: 'bg-[#241a10] text-[#f0cf8f] border-[#8a682f]/60',
    borderColor: 'border-[#916927]/60',
    glowColor: 'shadow-[#8a601f]/20',
    accentRune: '🜔',
    element: 'Flora & Wild Salt',
    icon: Crosshair,
    tagline: 'Warden of untamed wilds and keen horizons'
  },
  Paladin: {
    color: 'text-yellow-200',
    badgeBg: 'bg-[#28210f] text-[#fae498] border-[#9c8028]/60',
    borderColor: 'border-[#aa8822]/60',
    glowColor: 'shadow-[#b59223]/25',
    accentRune: '🜍',
    element: 'Solar Gold & Pure Sulfur',
    icon: Shield,
    tagline: 'Sacred bulwark sworn to righteous radiance'
  },
  Necromancer: {
    color: 'text-teal-200',
    badgeBg: 'bg-[#112423] text-[#9ce2de] border-[#3c7875]/60',
    borderColor: 'border-[#3c7c79]/60',
    glowColor: 'shadow-[#2a6966]/20',
    accentRune: '☿',
    element: 'Spirit Ash & Quicksilver',
    icon: Skull,
    tagline: 'Ruler of forbidden shadows and eternal spirits'
  }
};

const BACKSTORY_TEMPLATES: Record<CharacterClass, {
  origins: ((name: string) => string)[];
  conclusions: ((name: string) => string)[];
}> = {
  Paladin: {
    origins: [
      (name) => `${name} took solemn vows at the Sunfire Spire after surviving a dragon's cursed breath that consumed their ancestral abbey.`,
      (name) => `Orphaned during the Siege of Solas, ${name} was anointed by the Silver Templars to channel righteous dawn-flame through consecrated iron.`,
      (name) => `Once an errant knight in the Gilded Marches, ${name} witnessed the heavens part during the Battle of Red Ridge and pledged eternal fealty to the Dawnbringer.`,
      (name) => `Chosen by the Solar Archon to bear the Relic of Light, ${name} renounced all worldly titles to shield the defenseless across broken lands.`,
      (name) => `Born beneath a golden solar eclipse, ${name} discovered that mortal wounds would close beneath their touch whenever they invoked the sacred oath of the Paladin.`
    ],
    conclusions: [
      () => `Now, this unyielding Paladin wanders the perilous frontiers, shattering foul curses and standing firm as an unbreakable holy bastion.`,
      () => `Guided by celestial visions, this holy warrior marches into shadow-drenched crypts to banish the creeping dark.`,
      () => `With sacred scriptures inscribed upon their armor, this Paladin braves impossible odds to kindle hope in forsaken realms.`,
      () => `Now bound by divine decree, this champion seeks the lost Reliquary of Dawn to heal a fractured kingdom.`
    ]
  },
  Mage: {
    origins: [
      (name) => `${name} deciphered the seventh harmonic of astral weaving while studying in the crystal scriptoriums of Mount Vaelis.`,
      (name) => `Born under the conjunction of three celestial moons, ${name} involuntarily ignited enchanted frostfires long before speaking their first words.`,
      (name) => `Banished from the Grand Arcanum for communing with primordial chronomancers, ${name} unlocked volatile spell-formulas thought lost to antiquity.`,
      (name) => `After distilling raw aether inside an ancient alembic, ${name} bonded their own life essence to the tempestuous currents of the arcane weave.`,
      (name) => `Apprenticed to the reclusive archmage of the Whispering Spires, ${name} mastered the delicate equilibrium between burning brimstone and starlight.`
    ],
    conclusions: [
      () => `Now, this scholar of the impossible roams the wilderness seeking lost planar rifts to complete their legendary magnum opus.`,
      () => `Armed with crackling staves and cosmic equations, this prodigy bends ambient reality to defend the mortal sphere from planar horrors.`,
      () => `Ever curious and relentless, this Mage voyages to the world's edge to mend fractures in the cosmic tapestry.`,
      () => `Now traveling through forgotten ruins, this Mage commands devastating arcane torrents with effortless precision.`
    ]
  },
  Rogue: {
    origins: [
      (name) => `Raised amid the labyrinthine rooftop alleys and clandestine guilds of Oakhaven, ${name} learned early that silent footwork is worth more than gold.`,
      (name) => `Once an elite phantom-infiltrator for the Obsidian Syndicate, ${name} vanished into the midnight mist after purloining the emperor's secret codex.`,
      (name) => `${name} perfected the art of the garrote and poisoned blade within the forgotten catacombs beneath the imperial pleasure gardens.`,
      (name) => `After pulling off the legendary theft of the Starlight Opal from high Blackspire, ${name} became a phantom whose true name is only whispered in taverns.`,
      (name) => `Trained by blind knife-masters in the mist-shrouded Quarter of Shadows, ${name} can slip past armed sentries without disturbing a candle's flame.`
    ],
    conclusions: [
      () => `Operating solely from the fringes of civilization, this cunning Rogue turns deadly conspiracies into lucrative triumphs.`,
      () => `With twin quenched-steel daggers and an untraceable stride, this swift blade pursues a silent vendetta against those who betrayed them.`,
      () => `Now navigating perilous taverns and royal courts alike, this shadow-walker sells their lethal skills strictly on their own terms.`,
      () => `Ever unseen and unpredictable, this Rogue strikes from the dark before vanishing like smoke on the autumn wind.`
    ]
  },
  Warrior: {
    origins: [
      (name) => `${name} was tempered in the bloodstained blizzards of the Frostfang Peaks, surviving ten brutal winters against giant warbands.`,
      (name) => `A former vanguard champion of the Ironvale Legion, ${name} held the narrow gates of Wyrm-Pass against an overwhelming army of marauders.`,
      (name) => `Born into the brutal sand-pits of the Sunken Colosseum, ${name} claimed freedom by slaying the beast of Tartarus with a notched broadsword.`,
      (name) => `${name} took up their clan's ancestral greatblade after their fortress was burned, swearing never to sheath steel in cowardice.`,
      (name) => `Cast into exile following a bloody imperial coup, ${name} spent years training in remote crags to forge a body harder than dwarven steel.`
    ],
    conclusions: [
      () => `Now, this indomitable Warrior marches wherever war roars loudest, defending the helpless with bone-shattering force.`,
      () => `With battle-scars as their heraldry and iron in their blood, this Warrior cleaves a legendary path through every adversary.`,
      () => `Fearless in the clash of shields, this battle-hardened champion fights to carve their name into the immortal annals of glory.`,
      () => `Now traveling the treacherous trade roads, this veteran Warrior stands as an immovable bulwark against incoming chaos.`
    ]
  },
  Ranger: {
    origins: [
      (name) => `${name} was reared by timber-wolves and great horned owls within the heart of the Primeval Thicket, attuned to every rustle of the leaves.`,
      (name) => `The last surviving scout of the Emerald Vanguard, ${name} tracked shadow-drakes across treacherous swamps and jagged peaks.`,
      (name) => `Gifted with falcon-eyed vision and boundless patience, ${name} can split an arrow down the shaft in the midst of a howling gale.`,
      (name) => `${name} spent solitary decades guarding the sacred boundary stones between mortal villages and the untamed Feywild.`,
      (name) => `After an encroaching logging syndicate burned their ancestral redwood grove, ${name} became the vengeful wraith of the autumn canopy.`
    ],
    conclusions: [
      () => `Now stalking the frontier under moon and canopy, this watchful Ranger hunts apex predators and unnatural abominations before they strike.`,
      () => `Armed with a recurve bow carved from elder yew and a bond with wild beasts, this Ranger keeps the ancient peace of the forest.`,
      () => `Silent as falling mist, this lone marksman navigates uncharted wilds, guiding righteous travelers away from peril.`,
      () => `With unerring instincts, this Ranger enforces the primal laws of the wild upon all who dare defile nature.`
    ]
  },
  Necromancer: {
    origins: [
      (name) => `${name} unearthed a sentient bone-bound grimoire within the cursed mausoleums of the Forgotten Dynasty, learning to converse with the departed.`,
      (name) => `Once a brilliant physician searching for an end to mortal disease, ${name} pierced the Veil to master the cold, curative fires of soul-alchemy.`,
      (name) => `Exiled from the sunlit academies for studying preserved relics of ancient wraiths, ${name} embraced the lonely majesty of necromancy.`,
      (name) => `${name} was the sole survivor of the Ash Plague, having bound a guardian spirit into their own marrow to resist mortal decay.`,
      (name) => `Under the tutelage of an ancient lich bound beneath the Dread Morass, ${name} learned to direct spectral legions and weave emerald spirit-light.`
    ],
    conclusions: [
      () => `Now, this enigmatic Necromancer wanders between the lands of the living and the dead, ensuring restless souls find justice.`,
      () => `Walking the blurred line between mortality and eternity, this Necromancer commands the grave to thwart dark horrors worse than death.`,
      () => `With emerald soul-motes dancing at their fingertips, this master of the occult deciphers lost secrets buried in forgotten tombs.`,
      () => `Feared by the superstitious yet indispensable against fiends, this Necromancer commands the shadows to protect the living.`
    ]
  }
};

function generateBackstoryForCharacter(name: string, characterClass: CharacterClass, currentBackstory: string | null): string {
  const templateGroup = BACKSTORY_TEMPLATES[characterClass];
  let attempts = 0;
  let result = '';

  do {
    const originFn = templateGroup.origins[Math.floor(Math.random() * templateGroup.origins.length)];
    const conclusionFn = templateGroup.conclusions[Math.floor(Math.random() * templateGroup.conclusions.length)];
    result = `${originFn(name)} ${conclusionFn(name)}`;
    attempts++;
  } while (result === currentBackstory && attempts < 10);

  return result;
}

/**
 * Local Portrait Asset Registry
 * Maps each fantasy class to its available high-resolution local portrait artworks in public/portraits/
 */
export const CLASS_PORTRAIT_REGISTRY: Record<CharacterClass, string[]> = {
  Paladin: [
    '/portraits/paladin/variant-1.webp',
    '/portraits/paladin/variant-2.webp'
  ],
  Mage: [
    '/portraits/mage/variant-1.webp',
    '/portraits/mage/variant-2.webp'
  ],
  Rogue: [
    '/portraits/rogue/variant-1.webp',
    '/portraits/rogue/variant-2.webp'
  ],
  Warrior: [
    '/portraits/warrior/variant-1.webp',
    '/portraits/warrior/variant-2.webp'
  ],
  Ranger: [
    '/portraits/ranger/variant-1.webp',
    '/portraits/ranger/variant-2.webp'
  ],
  Necromancer: [
    '/portraits/necromancer/variant-1.webp',
    '/portraits/necromancer/variant-2.webp'
  ]
};

export function getPortraitSrc(characterClass: CharacterClass, seed: number): string {
  const variants = CLASS_PORTRAIT_REGISTRY[characterClass] || [];
  if (variants.length === 0) return '';
  const index = Math.abs(seed) % variants.length;
  return variants[index];
}

/**
 * High-Quality Fantasy Character Portrait Component
 * Displays genuine local portrait artwork from public/portraits/ assets.
 * Renders the image directly without SVG silhouettes or placeholders during normal operation.
 * Provides an accessible error state if an image asset fails to load.
 */
function CharacterPortrait({ 
  characterClass, 
  seed, 
  isRegenerating,
  size = 'normal'
}: { 
  characterClass: CharacterClass; 
  seed: number; 
  isRegenerating?: boolean;
  size?: 'normal' | 'compact';
}) {
  const [imageError, setImageError] = useState(false);

  const portraitSrc = getPortraitSrc(characterClass, seed);

  // Reset error state if the requested portrait source changes
  useEffect(() => {
    setImageError(false);
  }, [portraitSrc]);

  const runes = ['🜁', '🜂', '🜃', '🜄', '☿', '🜍', '🜔'];
  const leftRune = runes[(seed + 1) % runes.length];
  const rightRune = runes[(seed + 3) % runes.length];

  const sizeClass = size === 'compact' 
    ? 'w-16 h-16 p-0.5' 
    : 'w-36 h-36 sm:w-44 sm:h-44 p-1.5';

  return (
    <div className={`relative ${sizeClass} rounded-full mx-auto transition-all duration-300 ${isRegenerating ? 'scale-95 opacity-80' : 'scale-100 opacity-100'}`}>
      {/* Antique bronze & gold bezel */}
      <div className="absolute inset-0 rounded-full border-2 border-[#b8860b] shadow-[0_0_18px_rgba(184,134,11,0.3)] pointer-events-none z-20" />
      <div className="absolute inset-0.5 rounded-full border border-[#5c3818] pointer-events-none z-20" />
      
      {size !== 'compact' && (
        <div className="absolute inset-0 flex items-center justify-between px-1.5 text-[10px] text-[#aa8437]/80 font-mono select-none pointer-events-none z-20">
          <span>{leftRune}</span>
          <span>{rightRune}</span>
        </div>
      )}

      {/* Portrait Canvas / Frame */}
      <div className="w-full h-full rounded-full overflow-hidden bg-gradient-to-b from-[#241b12] via-[#1a130b] to-[#0f0b07] flex items-center justify-center relative shadow-inner border border-[#3b2815]">
        
        {/* Genuine Character Artwork Image */}
        {!imageError && portraitSrc ? (
          <img
            key={portraitSrc}
            src={portraitSrc}
            alt={`${characterClass} Portrait`}
            className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-300 z-10"
            loading="eager"
            decoding="async"
            onError={() => setImageError(true)}
          />
        ) : (
          /* Accessible Error Fallback if image asset fails to load */
          <div 
            role="status" 
            aria-label={`${characterClass} portrait unavailable`}
            className="w-full h-full flex flex-col items-center justify-center p-2 text-center bg-[#1c120a] z-10"
          >
            <ImageOff className="w-6 h-6 text-[#aa8437] mb-1" />
            <span className="text-[9px] sm:text-[10px] text-[#d8cbaf] font-mono uppercase tracking-wider">
              Portrait Offline
            </span>
          </div>
        )}

        {/* Subtle vintage glass sheen and ambient vignette overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-black/35 via-transparent to-amber-200/15 pointer-events-none rounded-full z-15" />
      </div>

      {size !== 'compact' && (
        <>
          <div className="absolute top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#d4af37] border border-[#5c3818] shadow-sm z-30" />
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#d4af37] border border-[#5c3818] shadow-sm z-30" />
        </>
      )}
    </div>
  );
}

/**
 * Stat Bar Component with Thematic Glow & Numerical Value
 */
function StatBar({ 
  label, 
  value, 
  maxValue = 150, 
  type 
}: { 
  label: string; 
  value: number; 
  maxValue?: number; 
  type: 'health' | 'mana' | 'strength' 
}) {
  const percentage = Math.min(100, Math.max(12, Math.round((value / maxValue) * 100)));

  const config = {
    health: {
      icon: Heart,
      textColor: 'text-rose-300',
      bgColor: 'bg-gradient-to-r from-red-800 via-rose-600 to-rose-500',
      borderColor: 'border-rose-900/60',
      glow: 'shadow-[0_0_10px_rgba(244,63,94,0.35)]',
      barTrack: 'bg-[#210f13]'
    },
    mana: {
      icon: Zap,
      textColor: 'text-cyan-300',
      bgColor: 'bg-gradient-to-r from-blue-800 via-cyan-600 to-cyan-400',
      borderColor: 'border-cyan-900/60',
      glow: 'shadow-[0_0_10px_rgba(6,182,212,0.35)]',
      barTrack: 'bg-[#0f1924]'
    },
    strength: {
      icon: Shield,
      textColor: 'text-amber-300',
      bgColor: 'bg-gradient-to-r from-amber-800 via-amber-600 to-yellow-500',
      borderColor: 'border-amber-900/60',
      glow: 'shadow-[0_0_10px_rgba(245,158,11,0.35)]',
      barTrack: 'bg-[#241a0d]'
    }
  }[type];

  const Icon = config.icon;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-1.5 font-semibold text-[#d4cbba]">
          <Icon className={`w-3.5 h-3.5 ${config.textColor}`} />
          <span>{label}</span>
        </div>
        <span className={`font-bold ${config.textColor} tracking-wider`}>
          {value}
        </span>
      </div>

      <div 
        role="meter"
        aria-label={`${label} attribute`}
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={maxValue}
        aria-valuetext={`${value} out of ${maxValue} ${label}`}
        className={`h-2.5 w-full rounded-full ${config.barTrack} border ${config.borderColor} overflow-hidden p-0.5 shadow-inner`}
      >
        <div 
          className={`h-full rounded-full ${config.bgColor} ${config.glow} transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function isValidCharacterClass(c: any): c is CharacterClass {
  return typeof c === 'string' && CLASSES.includes(c as CharacterClass);
}

function sanitizeSavedCharacter(item: any): SavedCharacter | null {
  if (!item || typeof item !== 'object') return null;
  if (typeof item.id !== 'string' || !item.id.trim()) return null;
  if (typeof item.name !== 'string' || !item.name.trim()) return null;
  if (!isValidCharacterClass(item.characterClass)) return null;
  
  const stats = item.stats;
  if (!stats || typeof stats !== 'object') return null;
  const health = typeof stats.health === 'number' && !isNaN(stats.health) ? stats.health : 100;
  const mana = typeof stats.mana === 'number' && !isNaN(stats.mana) ? stats.mana : 50;
  const strength = typeof stats.strength === 'number' && !isNaN(stats.strength) ? stats.strength : 50;

  return {
    id: String(item.id),
    name: String(item.name).slice(0, 80),
    characterClass: item.characterClass,
    portraitSeed: typeof item.portraitSeed === 'number' && !isNaN(item.portraitSeed) ? item.portraitSeed : 0,
    stats: { health, mana, strength },
    backstory: typeof item.backstory === 'string' ? item.backstory : null,
    savedAt: typeof item.savedAt === 'number' && !isNaN(item.savedAt) ? item.savedAt : Date.now()
  };
}

export default function App() {
  const [character, setCharacter] = useState<Character>(() => ({
    name: 'Valerius Ironwhisper',
    characterClass: 'Paladin',
    portraitSeed: 42,
    stats: generateStatsForClass('Paladin')
  }));
  const [backstory, setBackstory] = useState<string | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [isRegeneratingPortrait, setIsRegeneratingPortrait] = useState(false);
  const [isGeneratingBackstory, setIsGeneratingBackstory] = useState(false);
  const [generationCount, setGenerationCount] = useState(1);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState<'ANY' | CharacterClass>('ANY');

  // Deck Safety & Deletion Undo States
  const [deckStorageError, setDeckStorageError] = useState<string | null>(null);
  const [deletedCardUndo, setDeletedCardUndo] = useState<{ card: SavedCharacter; index: number } | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [inspectedCardId, setInspectedCardId] = useState<string | null>(null);
  const [expandedChronicles, setExpandedChronicles] = useState<Record<string, boolean>>({});
  const [liveAnnouncement, setLiveAnnouncement] = useState<string>('');
  const cardRef = React.useRef<HTMLDivElement>(null);
  const undoTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const isDeckLoadedRef = React.useRef<boolean>(false);

  // Persistent "My Deck" with defensive validation
  const [deck, setDeck] = useState<SavedCharacter[]>(() => {
    try {
      const stored = localStorage.getItem('alchemist_fantasy_deck');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          const sanitized = parsed.map(sanitizeSavedCharacter).filter((c): c is SavedCharacter => c !== null);
          isDeckLoadedRef.current = true;
          return sanitized;
        }
      }
    } catch (e) {
      console.warn('Failed to parse saved deck from localStorage:', e);
    }
    isDeckLoadedRef.current = true;
    return [];
  });

  // Sync deck to localStorage with defensive checks and quota management
  useEffect(() => {
    if (!isDeckLoadedRef.current) return;
    try {
      localStorage.setItem('alchemist_fantasy_deck', JSON.stringify(deck));
      setDeckStorageError(null);
    } catch (e: any) {
      console.error('Failed to save deck to storage:', e);
      if (e?.name === 'QuotaExceededError' || e?.code === 22) {
        setDeckStorageError('Grimoire storage quota exceeded. Please remove older cards to save new ones.');
      } else {
        setDeckStorageError('Unable to persist to storage. Your champions remain in memory.');
      }
    }
  }, [deck]);

  // Cleanup undo timer on unmount
  useEffect(() => {
    return () => {
      if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current);
    };
  }, []);

  // Preload all 12 portrait assets on initial load to ensure instant, zero-flicker switching
  useEffect(() => {
    Object.values(CLASS_PORTRAIT_REGISTRY).flat().forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // My Deck Search, Class Filter, and Sorting state
  const [searchQuery, setSearchQuery] = useState('');
  const [classFilter, setClassFilter] = useState<'ALL' | CharacterClass>('ALL');
  const [sortBy, setSortBy] = useState<'recent' | 'name' | 'health' | 'mana' | 'strength'>('recent');

  // Filtered and Sorted Deck View (Safe: purely derived, never modifies deck)
  const filteredAndSortedDeck = useMemo(() => {
    return deck
      .filter((card) => {
        const matchesSearch = 
          searchQuery.trim() === '' || 
          card.name.toLowerCase().includes(searchQuery.trim().toLowerCase());
        const matchesClass = 
          classFilter === 'ALL' || 
          card.characterClass === classFilter;
        return matchesSearch && matchesClass;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'name':
            return a.name.localeCompare(b.name);
          case 'health':
            return b.stats.health - a.stats.health;
          case 'mana':
            return b.stats.mana - a.stats.mana;
          case 'strength':
            return b.stats.strength - a.stats.strength;
          case 'recent':
          default:
            return b.savedAt - a.savedAt;
        }
      });
  }, [deck, searchQuery, classFilter, sortBy]);

  const hasActiveFilters = searchQuery.trim() !== '' || classFilter !== 'ALL' || sortBy !== 'recent';

  const handleResetFilters = () => {
    setSearchQuery('');
    setClassFilter('ALL');
    setSortBy('recent');
  };

  // Main generator: Generates brand new character (Name + Class + Portrait + Stats)
  // Requirement: Clear previous backstory when new character is generated
  const handleGenerate = (targetClassOverride?: 'ANY' | CharacterClass) => {
    setIsRolling(true);

    const activeFilter = targetClassOverride !== undefined ? targetClassOverride : selectedClass;
    const resolvedClass = activeFilter === 'ANY' ? getRandomClass() : activeFilter;

    let newName = generateRandomName();
    if (newName === character.name && resolvedClass === character.characterClass) {
      newName = generateRandomName();
    }

    const newSeed = Math.floor(Math.random() * 100000);
    const newStats = generateStatsForClass(resolvedClass);

    setCharacter({
      name: newName,
      characterClass: resolvedClass,
      portraitSeed: newSeed,
      stats: newStats
    });

    // Clear previous backstory and inspection state so it does not belong to the new character
    setBackstory(null);
    setInspectedCardId(null);
    setSaveSuccessMessage(null);
    setGenerationCount(prev => prev + 1);
    setLiveAnnouncement(`Forged new champion ${newName}, ${resolvedClass}.`);

    setTimeout(() => {
      setIsRolling(false);
    }, 280);
  };

  // Dedicated portrait regenerator - cycles only portrait variant, strictly preserving name, class, stats, backstory
  const handleRegeneratePortrait = () => {
    if (isRolling || isRegeneratingPortrait) return;
    setIsRegeneratingPortrait(true);
    
    // Select the next valid portrait variant for the current class, strictly avoiding consecutive duplicates
    const variants = CLASS_PORTRAIT_REGISTRY[character.characterClass] || [];
    const currentIndex = variants.length > 0 ? Math.abs(character.portraitSeed) % variants.length : 0;
    const nextIndex = variants.length > 1 ? (currentIndex + 1) % variants.length : 0;
    
    setCharacter(prev => ({
      ...prev,
      portraitSeed: nextIndex
    }));

    setLiveAnnouncement(`Regenerated portrait for ${character.name}. Displaying portrait variant ${nextIndex + 1} of ${variants.length}.`);

    setTimeout(() => {
      setIsRegeneratingPortrait(false);
    }, 200);
  };

  // Dedicated backstory generator
  const handleGenerateBackstory = () => {
    setIsGeneratingBackstory(true);
    
    const newStory = generateBackstoryForCharacter(
      character.name, 
      character.characterClass, 
      backstory
    );

    setBackstory(newStory);

    setTimeout(() => {
      setIsGeneratingBackstory(false);
    }, 200);
  };

  // Check if current character is already in deck to prevent duplicates
  const isAlreadyInDeck = deck.some(
    card => 
      card.name === character.name && 
      card.characterClass === character.characterClass &&
      card.stats.health === character.stats.health &&
      card.stats.mana === character.stats.mana &&
      card.stats.strength === character.stats.strength
  );

  // Save to Deck
  const handleSaveToDeck = () => {
    if (isAlreadyInDeck) {
      setSaveSuccessMessage('Already in your deck!');
      setTimeout(() => setSaveSuccessMessage(null), 2500);
      return;
    }

    const newCard: SavedCharacter = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: character.name,
      characterClass: character.characterClass,
      portraitSeed: character.portraitSeed,
      stats: { ...character.stats },
      backstory: backstory,
      savedAt: Date.now()
    };

    setDeck(prev => [newCard, ...prev]);
    setSaveSuccessMessage('Card inscribed into My Deck!');
    setTimeout(() => setSaveSuccessMessage(null), 3000);
  };

  // Safe Deletion Handlers with Confirmation & Undo
  const handleRequestDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setConfirmDeleteId(id);
  };

  const handleCancelDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setConfirmDeleteId(null);
  };

  const handleConfirmDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const index = deck.findIndex(c => c.id === id);
    const cardToDelete = deck[index];
    if (!cardToDelete) return;

    if (undoTimeoutRef.current) {
      clearTimeout(undoTimeoutRef.current);
    }

    setDeck(prev => prev.filter(c => c.id !== id));
    setConfirmDeleteId(null);
    setDeletedCardUndo({ card: cardToDelete, index });

    // Auto-dismiss undo notification after 6 seconds
    undoTimeoutRef.current = setTimeout(() => {
      setDeletedCardUndo(null);
    }, 6000);
  };

  const handleUndoDelete = () => {
    if (!deletedCardUndo) return;
    if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current);

    setDeck(prev => {
      const restored = [...prev];
      const targetIndex = Math.min(deletedCardUndo.index, restored.length);
      restored.splice(targetIndex, 0, deletedCardUndo.card);
      return restored;
    });

    setSaveSuccessMessage(`Restored "${deletedCardUndo.card.name}" to My Deck!`);
    setTimeout(() => setSaveSuccessMessage(null), 3000);
    setDeletedCardUndo(null);
  };

  // Inspect / Load saved card to main stage
  const handleLoadCard = (card: SavedCharacter) => {
    setCharacter({
      name: card.name,
      characterClass: card.characterClass,
      portraitSeed: card.portraitSeed,
      stats: { ...card.stats }
    });
    setBackstory(card.backstory);
    setInspectedCardId(card.id);
    setSelectedClass(card.characterClass);
    setLiveAnnouncement(`Inspecting saved champion: ${card.name}, ${card.characterClass}.`);

    if (cardRef.current) {
      cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      cardRef.current.focus();
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleReturnToNewRolls = () => {
    setInspectedCardId(null);
    setLiveAnnouncement('Returned to new character generation.');
    handleGenerate();
  };

  const toggleChronicle = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedChronicles(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const activeConfig = CLASS_CONFIG[character.characterClass];
  const ClassIcon = activeConfig.icon;

  return (
    <div className="min-h-screen workbench-bg text-[#e8dec5] flex flex-col justify-between selection:bg-[#b8860b]/40 relative overflow-x-hidden">
      {/* Ancient Workbench Texture Layers */}
      <div className="absolute inset-0 pointer-events-none opacity-25 bg-[radial-gradient(#b8860b_0.75px,transparent_0.75px)] [background-size:24px_24px]" />
      
      {/* Alchemical Workshop Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-amber-600/10 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-amber-800/10 blur-[90px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-orange-900/10 blur-[90px] pointer-events-none rounded-full" />

      {/* Antique Brass Ruler / Border Trim across header */}
      <div className="relative z-10 w-full border-b border-[#5c3e1c]/80 bg-[#140e08]/90 backdrop-blur-sm px-4 py-2 flex items-center justify-between text-[11px] text-[#aa8437] font-mono tracking-wider">
        <div className="flex items-center gap-2">
          <span>🜁 🜂 🜃 🜄</span>
          <span className="hidden sm:inline text-stone-500">|</span>
          <span className="hidden sm:inline text-[#c59b27]">TABULA ALCHEMICA</span>
        </div>
        <div className="flex items-center gap-4 text-xs font-serif text-[#d8cbaf]">
          <span>Opus Magnum &bull; Vol. VIII</span>
        </div>
        <div className="flex items-center gap-3">
          <a 
            href="#my-deck-section" 
            className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#24190e] border border-[#7a5522] text-[#f3cf65] hover:text-white transition-colors"
          >
            <Layers className="w-3 h-3 text-[#d4af37]" />
            <span>Deck ({deck.length})</span>
          </a>
          <span className="text-[#aa8437]">☿ 🜍 🜔</span>
        </div>
      </div>

      {/* Header */}
      <header className="relative z-10 pt-8 pb-4 px-4 text-center">
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-[#8c6b2d]/60 bg-[#21170d]/80 text-[#e5c158] text-xs tracking-widest uppercase mb-3 shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
          <Sparkles className="w-3.5 h-3.5 text-[#e5c158]" />
          <span className="font-fantasy tracking-widest">Alchemist&apos;s Workbench</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-wider font-fantasy gold-text-gradient drop-shadow-md">
          Fantasy Character Generator
        </h1>
        
        <p className="mt-2 text-[#c2b294] text-xs sm:text-sm max-w-lg mx-auto font-serif italic">
          Distill the elemental humors upon the ancient slate to forge and inscribe legendary champions into your grimoire.
        </p>
      </header>

      {/* Main Workbench Display Area */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-6">
        <div className="w-full max-w-xl">
          
          {/* Primary Action & Alchemical Vocation Filter Controls - Above the Player Card */}
          <div className="mb-6 space-y-3.5">
            {/* Primary Action Button */}
            <div className="flex justify-center">
              <button
                id="generate-button"
                type="button"
                onClick={() => handleGenerate()}
                disabled={isRolling}
                className="group relative inline-flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold tracking-wider uppercase text-base text-[#fff5db] bg-gradient-to-b from-[#8c591b] via-[#633a0e] to-[#3b2005] border-2 border-[#d4af37]/80 shadow-[0_8px_25px_rgba(0,0,0,0.8)] hover:from-[#a06822] hover:to-[#4a2907] hover:border-[#f3cf65] active:scale-[0.98] transition-all duration-150 cursor-pointer disabled:opacity-70 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0e0a07] font-fantasy"
              >
                <span className="absolute top-1.5 left-1.5 w-1 h-1 rounded-full bg-[#f3cf65] opacity-75" />
                <span className="absolute top-1.5 right-1.5 w-1 h-1 rounded-full bg-[#f3cf65] opacity-75" />
                <span className="absolute bottom-1.5 left-1.5 w-1 h-1 rounded-full bg-[#f3cf65] opacity-75" />
                <span className="absolute bottom-1.5 right-1.5 w-1 h-1 rounded-full bg-[#f3cf65] opacity-75" />

                <Dices className={`w-5 h-5 text-[#f3cf65] transition-transform duration-300 ${isRolling ? 'rotate-180' : 'group-hover:rotate-45'}`} />
                <span className="drop-shadow">
                  {selectedClass === 'ANY' ? 'Generate Random Character' : `Summon ${selectedClass}`}
                </span>
                <Sparkles className="w-4 h-4 text-[#f3cf65] group-hover:scale-125 transition-transform" />
              </button>
            </div>

            {/* Selectable Class Filters / Vocation Selector */}
            <div className="parchment-inset rounded-xl border border-[#543b18] p-2.5 sm:p-3 shadow-inner">
              <div className="flex items-center justify-between mb-2 px-1">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#aa8437] font-semibold">
                  Alchemical Vocation Filter
                </span>
                <span className="text-[10px] font-mono text-[#a8957c]">
                  {selectedClass === 'ANY' ? 'Rolling all classes' : `Target: ${selectedClass}`}
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
                <button
                  type="button"
                  id="class-filter-any"
                  onClick={() => {
                    setSelectedClass('ANY');
                    handleGenerate('ANY');
                  }}
                  className={`text-xs px-3 py-1.5 rounded-lg border font-fantasy font-medium transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37] ${
                    selectedClass === 'ANY'
                      ? 'border-[#d4af37] bg-gradient-to-r from-[#382613] to-[#24170a] text-[#fae498] font-bold shadow-[0_0_12px_rgba(212,175,55,0.35)]'
                      : 'border-[#42311f] bg-[#17110a]/80 text-[#a8957c] hover:border-[#7a5522] hover:text-[#d8cbaf]'
                  }`}
                >
                  ✨ Any Class
                </button>

                {CLASSES.map((cls) => {
                  const isSelected = selectedClass === cls;
                  const config = CLASS_CONFIG[cls];
                  const Icon = config.icon;
                  return (
                    <button
                      key={cls}
                      type="button"
                      id={`class-filter-${cls.toLowerCase()}`}
                      onClick={() => {
                        setSelectedClass(cls);
                        handleGenerate(cls);
                      }}
                      className={`text-xs px-2.5 sm:px-3 py-1.5 rounded-lg border font-fantasy inline-flex items-center gap-1.5 transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37] ${
                        isSelected
                          ? `border-[#d4af37] ${config.badgeBg} font-bold shadow-[0_0_12px_rgba(212,175,55,0.35)] ring-1 ring-[#d4af37]/60`
                          : 'border-[#42311f] bg-[#17110a]/80 text-[#a8957c] hover:border-[#7a5522] hover:text-[#d8cbaf]'
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${isSelected ? config.color : 'text-[#8a7253]'}`} />
                      <span>{cls}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Polished, Clearly Bordered Fantasy Player Card */}
          <div 
            id="player-card"
            ref={cardRef}
            tabIndex={-1}
            className={`relative parchment-panel rounded-2xl border-2 sm:border-[3px] border-[#8c6527]/80 p-6 sm:p-8 shadow-[0_16px_50px_rgba(0,0,0,0.9)] ${activeConfig.glowColor} transition-all duration-300 transform focus:outline-none focus:ring-2 focus:ring-[#d4af37]/60 ${
              isRolling ? 'scale-[0.985] opacity-90' : 'scale-100 opacity-100'
            }`}
          >
            {/* Multi-layered Antique Bronze & Gold Beveled Borders */}
            <div className="absolute inset-2 sm:inset-3 rounded-xl border border-[#543b18] pointer-events-none" />
            <div className="absolute inset-3 sm:inset-4 rounded-lg border border-[#3d2910]/70 pointer-events-none" />

            {/* Antique Brass Corner Filigree Clasps */}
            <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-[#d4af37] pointer-events-none flex items-start justify-start">
              <span className="w-1.5 h-1.5 bg-[#d4af37] block" />
            </div>
            <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-[#d4af37] pointer-events-none flex items-start justify-end">
              <span className="w-1.5 h-1.5 bg-[#d4af37] block" />
            </div>
            <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-[#d4af37] pointer-events-none flex items-end justify-start">
              <span className="w-1.5 h-1.5 bg-[#d4af37] block" />
            </div>
            <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-[#d4af37] pointer-events-none flex items-end justify-end">
              <span className="w-1.5 h-1.5 bg-[#d4af37] block" />
            </div>

            {/* Corner Decorative Brass Rivets */}
            <div className="absolute top-4 left-4 w-2 h-2 rounded-full bg-[#8a6828] border border-[#d4af37]/60 shadow-sm pointer-events-none" />
            <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-[#8a6828] border border-[#d4af37]/60 shadow-sm pointer-events-none" />
            <div className="absolute bottom-4 left-4 w-2 h-2 rounded-full bg-[#8a6828] border border-[#d4af37]/60 shadow-sm pointer-events-none" />
            <div className="absolute bottom-4 right-4 w-2 h-2 rounded-full bg-[#8a6828] border border-[#d4af37]/60 shadow-sm pointer-events-none" />

            <div className="relative text-center space-y-5">
              
              {/* Inspected Champion Banner */}
              {inspectedCardId && (
                <div className="mb-2 -mt-1 p-2.5 rounded-xl bg-gradient-to-r from-[#291b0c] via-[#3d2911] to-[#291b0c] border border-[#d4af37] flex items-center justify-between gap-2 shadow-lg animate-fade-in text-left">
                  <div className="flex items-center gap-2 text-xs font-fantasy text-[#fae498]">
                    <Layers className="w-4 h-4 text-[#d4af37] shrink-0" />
                    <span>Inspecting Champion from Deck</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleReturnToNewRolls}
                    className="px-2.5 py-1 rounded-lg bg-[#1c130b] border border-[#d4af37]/80 text-xs font-fantasy font-bold text-[#fae498] hover:text-white hover:bg-[#382515] transition-all cursor-pointer shadow-sm active:scale-95"
                  >
                    Roll Anew &rarr;
                  </button>
                </div>
              )}

              {/* Card Header Tag & Class Emblem */}
              <div className="flex items-center justify-between border-b border-[#4d3215] pb-3 px-1">
                <div className="flex items-center gap-1.5 text-xs tracking-widest text-[#aa8437] uppercase font-mono">
                  <span>{activeConfig.accentRune}</span>
                  <span className="font-fantasy text-[#d8cbaf]">{activeConfig.element}</span>
                </div>

                {/* Class Vocation Badge */}
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs sm:text-sm font-bold tracking-wider font-fantasy uppercase ${activeConfig.badgeBg} shadow-sm`}>
                  <ClassIcon className={`w-3.5 h-3.5 ${activeConfig.color}`} />
                  <span>{character.characterClass}</span>
                </div>
              </div>

              {/* Character Portrait with Regeneration Action */}
              <div className="flex flex-col items-center justify-center pt-1">
                <CharacterPortrait 
                  characterClass={character.characterClass} 
                  seed={character.portraitSeed}
                  isRegenerating={isRegeneratingPortrait || isRolling}
                />

                {/* Portrait Regeneration Button */}
                <button
                  type="button"
                  id="regenerate-portrait-button"
                  onClick={handleRegeneratePortrait}
                  disabled={isRolling || isRegeneratingPortrait}
                  title="Transmute Character Portrait"
                  className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-serif text-[#d8cbaf] bg-[#241a10] border border-[#6b4a1b] hover:bg-[#332415] hover:border-[#aa8437] hover:text-[#fae498] transition-all cursor-pointer shadow-sm group active:scale-95"
                >
                  <RefreshCw className={`w-3 h-3 text-[#aa8437] group-hover:text-[#fae498] transition-transform duration-300 ${isRegeneratingPortrait ? 'animate-spin' : 'group-hover:rotate-180'}`} />
                  <span>Regenerate Portrait</span>
                </button>
              </div>

              {/* Character Name Section on Aged Parchment Inset */}
              <div className="parchment-inset rounded-xl border border-[#52391b] p-4 my-2 relative shadow-inner">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Feather className="w-3 h-3 text-[#aa8437]" />
                  <span className="text-[10px] uppercase tracking-widest text-[#aa8437] font-semibold font-mono">
                    True Name
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold gold-text-gradient tracking-wide font-character-name drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] py-0.5 break-words max-w-full">
                  {character.name}
                </h2>

                <p className="text-xs text-[#c2b294] mt-1 italic font-serif">
                  &ldquo;{activeConfig.tagline}&rdquo;
                </p>
              </div>

              {/* Requirement 2: Randomized Character Stats (Health, Mana, Strength) */}
              <div className="parchment-inset rounded-xl border border-[#5c3e1c]/90 p-4 relative shadow-inner text-left">
                <div className="flex items-center justify-between mb-3 border-b border-[#4d3215] pb-2">
                  <div className="flex items-center gap-2 text-xs font-fantasy font-bold text-[#e5c158] uppercase tracking-wider">
                    <Compass className="w-4 h-4 text-[#d4af37]" />
                    <span>Alchemical Attributes</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#8a7253] uppercase">
                    Vocation Balanced
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  <StatBar 
                    label="Health" 
                    value={character.stats.health} 
                    maxValue={150} 
                    type="health" 
                  />
                  <StatBar 
                    label="Mana" 
                    value={character.stats.mana} 
                    maxValue={150} 
                    type="mana" 
                  />
                  <StatBar 
                    label="Strength" 
                    value={character.stats.strength} 
                    maxValue={120} 
                    type="strength" 
                  />
                </div>
              </div>

              {/* Dedicated Backstory Section on the Player Card */}
              <div className="parchment-inset rounded-xl border border-[#5c3e1c]/90 p-4 sm:p-5 relative shadow-inner text-left">
                <div className="flex items-center justify-between mb-3 border-b border-[#4d3215] pb-2">
                  <div className="flex items-center gap-2 text-xs font-fantasy font-bold text-[#e5c158] uppercase tracking-wider">
                    <BookOpen className="w-4 h-4 text-[#d4af37]" />
                    <span>Origin Chronicle</span>
                  </div>

                  {/* Button labeled "Generate Backstory" */}
                  <button
                    type="button"
                    id="generate-backstory-button"
                    onClick={handleGenerateBackstory}
                    disabled={isRolling || isGeneratingBackstory}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-fantasy font-bold tracking-wider uppercase text-[#fff2d1] bg-gradient-to-b from-[#8a5518] to-[#4e2b0a] border border-[#d4af37]/70 hover:from-[#a06822] hover:to-[#633a0e] hover:border-[#f3cf65] active:scale-95 transition-all shadow-md cursor-pointer disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37]"
                  >
                    <Scroll className={`w-3.5 h-3.5 text-[#f3cf65] transition-transform ${isGeneratingBackstory ? 'rotate-12 scale-110' : ''}`} />
                    <span>Generate Backstory</span>
                  </button>
                </div>

                {/* Backstory Content Display Area */}
                <div className="min-h-[58px] flex items-center">
                  {backstory ? (
                    <p 
                      id="character-backstory-text"
                      className={`text-sm sm:text-base leading-relaxed text-[#f3ebd7] font-serif transition-opacity duration-200 ${
                        isGeneratingBackstory ? 'opacity-60' : 'opacity-100'
                      }`}
                    >
                      {backstory}
                    </p>
                  ) : (
                    <p className="text-xs sm:text-sm text-[#c2ae91] italic font-serif text-center w-full py-1">
                      No origin chronicle has been inscribed for {character.name} yet. Click <span className="text-[#f3cf65] font-semibold">&ldquo;Generate Backstory&rdquo;</span> to unveil this {character.characterClass}&apos;s tale.
                    </p>
                  )}
                </div>
              </div>

              {/* Requirement 3: "Save to Deck" Button on Player Card */}
              <div className="pt-2">
                <button
                  type="button"
                  id="save-to-deck-button"
                  onClick={handleSaveToDeck}
                  disabled={isRolling || isAlreadyInDeck}
                  className={`w-full py-3 px-5 rounded-xl font-fantasy font-bold tracking-wider uppercase text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all duration-200 shadow-md ${
                    isAlreadyInDeck 
                      ? 'bg-[#22180f] text-[#a8957c] border border-[#52391e] cursor-not-allowed'
                      : 'bg-gradient-to-b from-[#2e4a32] via-[#1d3822] to-[#122416] text-[#c5f2cc] border-2 border-[#4da361]/70 hover:from-[#3a5d3f] hover:to-[#172c1c] hover:border-[#73cf87] active:scale-[0.99] cursor-pointer shadow-[0_4px_15px_rgba(20,60,30,0.4)]'
                  }`}
                >
                  {isAlreadyInDeck ? (
                    <>
                      <BookmarkCheck className="w-4 h-4 text-[#a8957c]" />
                      <span>{inspectedCardId ? 'Saved Champion (Inspecting)' : 'Saved to Deck'}</span>
                    </>
                  ) : (
                    <>
                      <BookmarkPlus className="w-4 h-4 text-[#8fe29e]" />
                      <span>Save to Deck</span>
                    </>
                  )}
                </button>

                {/* Feedback message */}
                {saveSuccessMessage && (
                  <div className="mt-2 text-xs text-[#a3e6b1] flex items-center justify-center gap-1.5 font-serif animate-fade-in">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{saveSuccessMessage}</span>
                  </div>
                )}
              </div>

              {/* Card Metadata / Generation Count */}
              <div className="flex items-center justify-between text-[#8a7558] text-[11px] font-mono pt-1 border-t border-[#442c14]">
                <span>Seed: #{character.portraitSeed.toString().padStart(6, '0')}</span>
                <span>Transmutation #{generationCount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Requirements 4 & 5: "My Deck" Section */}
        <section 
          id="my-deck-section" 
          className="w-full max-w-4xl mt-14 pt-8 border-t-2 border-[#543a1a]"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#26190e] border-2 border-[#aa8437] flex items-center justify-center shadow-md">
                <Layers className="w-5 h-5 text-[#f5d6a8]" />
              </div>
              <div>
                <h3 className="text-2xl font-bold font-fantasy gold-text-gradient tracking-wide">
                  My Deck
                </h3>
                <p className="text-xs text-[#a8957c] font-serif">
                  {deck.length === 0 
                    ? 'No champions inscribed yet.' 
                    : `${deck.length} ${deck.length === 1 ? 'champion' : 'champions'} preserved in your personal vault.`}
                </p>
                <p className="text-[11px] text-[#8a7255] font-serif italic mt-0.5">
                  Stored locally in this browser &bull; Not synced across devices
                </p>
              </div>
            </div>

            {deck.length > 0 && (
              <span className="px-3 py-1 rounded-full text-xs font-mono border border-[#8a652b] bg-[#21160c] text-[#e5c158]">
                {deck.length} Saved {deck.length === 1 ? 'Card' : 'Cards'}
              </span>
            )}
          </div>

          {/* Professional Deck Controls: Search, Class Filter, and Sort (Only shown when deck has cards) */}
          {deck.length > 0 && (
            <div className="parchment-inset rounded-xl border border-[#543b18] p-3 mb-6 shadow-inner">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                
                {/* 1. Search by Name Input */}
                <div className="sm:col-span-5 relative">
                  <Search className="w-4 h-4 text-[#aa8437] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="deck-search-input"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search champion by name..."
                    className="w-full bg-[#181109] border border-[#5c3e1c] focus:border-[#d4af37] text-xs text-[#fae498] placeholder-[#7d6547] rounded-lg pl-9 pr-8 py-2 font-serif transition-colors focus:outline-none"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      title="Clear search"
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8a7253] hover:text-[#fae498] p-0.5 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* 2. Class Filter Dropdown */}
                <div className="sm:col-span-4 relative flex items-center bg-[#181109] border border-[#5c3e1c] focus-within:border-[#d4af37] rounded-lg px-2.5 py-1.5 transition-colors">
                  <Filter className="w-3.5 h-3.5 text-[#aa8437] mr-2 flex-shrink-0" />
                  <label htmlFor="deck-class-filter" className="sr-only">Filter by Class</label>
                  <select
                    id="deck-class-filter"
                    value={classFilter}
                    onChange={(e) => setClassFilter(e.target.value as any)}
                    className="w-full bg-transparent text-xs text-[#fae498] font-fantasy focus:outline-none cursor-pointer"
                  >
                    <option value="ALL" className="bg-[#1c130b] text-[#e8dec5]">All Classes ({deck.length})</option>
                    {CLASSES.map((cls) => {
                      const count = deck.filter((c) => c.characterClass === cls).length;
                      return (
                        <option key={cls} value={cls} className="bg-[#1c130b] text-[#e8dec5]">
                          {cls} ({count})
                        </option>
                      );
                    })}
                  </select>
                </div>

                {/* 3. Sorting Dropdown */}
                <div className="sm:col-span-3 relative flex items-center bg-[#181109] border border-[#5c3e1c] focus-within:border-[#d4af37] rounded-lg px-2.5 py-1.5 transition-colors">
                  <ArrowUpDown className="w-3.5 h-3.5 text-[#aa8437] mr-2 flex-shrink-0" />
                  <label htmlFor="deck-sort-by" className="sr-only">Sort Champions</label>
                  <select
                    id="deck-sort-by"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="w-full bg-transparent text-xs text-[#fae498] font-fantasy focus:outline-none cursor-pointer"
                  >
                    <option value="recent" className="bg-[#1c130b] text-[#e8dec5]">Most Recent</option>
                    <option value="name" className="bg-[#1c130b] text-[#e8dec5]">Name (A-Z)</option>
                    <option value="health" className="bg-[#1c130b] text-[#e8dec5]">Highest Health</option>
                    <option value="mana" className="bg-[#1c130b] text-[#e8dec5]">Highest Mana</option>
                    <option value="strength" className="bg-[#1c130b] text-[#e8dec5]">Highest Strength</option>
                  </select>
                </div>
              </div>

              {/* Active Filter Bar and Reset Option */}
              {hasActiveFilters && (
                <div className="mt-2.5 pt-2 border-t border-[#3b2713] flex items-center justify-between text-xs font-serif text-[#aa8437]">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] text-[#7d6547]">Active Filters:</span>
                    {searchQuery.trim() && (
                      <span className="px-2 py-0.5 rounded bg-[#24170d] border border-[#6b4c1f] text-[#f5ebd7] text-[11px]">
                        Name: &ldquo;{searchQuery}&rdquo;
                      </span>
                    )}
                    {classFilter !== 'ALL' && (
                      <span className="px-2 py-0.5 rounded bg-[#24170d] border border-[#6b4c1f] text-[#f5ebd7] text-[11px]">
                        Class: {classFilter}
                      </span>
                    )}
                    {sortBy !== 'recent' && (
                      <span className="px-2 py-0.5 rounded bg-[#24170d] border border-[#6b4c1f] text-[#f5ebd7] text-[11px]">
                        Sort: {sortBy === 'name' ? 'Name (A-Z)' : `Highest ${sortBy.toUpperCase()}`}
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="inline-flex items-center gap-1 text-[11px] font-fantasy text-[#f3cf65] hover:text-white transition-colors cursor-pointer ml-auto"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* 4. Deck States: Empty Deck State vs No Search Results vs Card Grid */}
          {deck.length === 0 ? (
            <div className="parchment-inset rounded-2xl border-2 border-dashed border-[#543b18] p-8 text-center">
              <Scroll className="w-10 h-10 text-[#7a5c31] mx-auto mb-3" />
              <h4 className="text-lg font-fantasy text-[#dfd3b6] mb-1">Your Deck is Empty</h4>
              <p className="text-xs sm:text-sm text-[#9e8b72] max-w-md mx-auto font-serif">
                Forge heroic champions above and click <span className="text-[#f3cf65] font-semibold">&ldquo;Save to Deck&rdquo;</span> to preserve their names, classes, stats, portraits, and origin chronicles in your grimoire.
              </p>
            </div>
          ) : filteredAndSortedDeck.length === 0 ? (
            <div className="parchment-inset rounded-2xl border border-[#543b18] p-8 text-center my-2 shadow-inner">
              <Search className="w-9 h-9 text-[#8a6828] mx-auto mb-2 opacity-70" />
              <h4 className="text-base font-fantasy text-[#dfd3b6] mb-1">No Champions Match Criteria</h4>
              <p className="text-xs text-[#9e8b72] max-w-sm mx-auto font-serif mb-4">
                No saved champions match your current search query or class filter.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-fantasy font-semibold text-[#f3cf65] bg-[#291b0f] border border-[#7a5522] hover:bg-[#382515] transition-all cursor-pointer shadow-sm"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Clear Search & Filters</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredAndSortedDeck.map((card) => {
                const config = CLASS_CONFIG[card.characterClass];
                const Icon = config.icon;
                const isCurrent = card.name === character.name && card.characterClass === character.characterClass;

                return (
                  <div
                    key={card.id}
                    className={`relative parchment-panel rounded-xl border-2 ${
                      isCurrent ? 'border-[#d4af37] shadow-[0_0_20px_rgba(212,175,55,0.25)]' : 'border-[#543b18] hover:border-[#8c6527]'
                    } p-4 flex flex-col justify-between transition-all duration-200 group`}
                  >
                    {/* Corner Accent: Safe Deletion with Inline Confirmation */}
                    <div className="absolute top-2 right-2 flex items-center gap-1.5 z-20">
                      {confirmDeleteId === card.id ? (
                        <div className="flex items-center gap-1.5 bg-[#261010] border border-rose-800/90 rounded-lg px-2 py-1 shadow-lg text-[10px]">
                          <span className="text-rose-200 font-mono">Delete?</span>
                          <button
                            type="button"
                            onClick={(e) => handleConfirmDelete(card.id, e)}
                            title="Confirm Delete"
                            className="text-rose-300 hover:text-white font-bold px-1 rounded hover:bg-rose-900/60 transition-colors cursor-pointer"
                          >
                            ✓ Yes
                          </button>
                          <button
                            type="button"
                            onClick={handleCancelDelete}
                            title="Cancel"
                            className="text-[#a8957c] hover:text-white px-1 rounded hover:bg-[#3d2918] transition-colors cursor-pointer"
                          >
                            ✕ No
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => handleRequestDelete(card.id, e)}
                          title="Remove from Deck"
                          aria-label={`Remove ${card.name} from Deck`}
                          className="p-1 rounded text-[#8a7253] hover:text-rose-400 hover:bg-[#2b1414] transition-colors cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-rose-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <div>
                      {/* Top Row: Mini Portrait + Name + Class Badge */}
                      <div className="flex items-start gap-3 mb-3">
                        <div className="flex-shrink-0">
                          <CharacterPortrait 
                            characterClass={card.characterClass} 
                            seed={card.portraitSeed}
                            size="compact"
                          />
                        </div>

                        <div className="min-w-0 flex-1 pr-7">
                          <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-fantasy uppercase mb-1 font-bold ${config.badgeBg}`}>
                            <Icon className={`w-2.5 h-2.5 ${config.color}`} />
                            <span className={config.color}>{card.characterClass}</span>
                          </div>

                          <h4 
                            className="font-fantasy font-bold text-sm sm:text-base text-[#f5ebd7] break-words line-clamp-2 leading-tight group-hover:text-[#ffd978] transition-colors"
                            title={card.name}
                          >
                            {card.name}
                          </h4>

                          <p className="text-[10px] text-[#998263] font-mono mt-0.5">
                            {new Date(card.savedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {/* Compact Stats Badges */}
                      <div className="grid grid-cols-3 gap-1.5 py-2 px-2.5 rounded-lg bg-[#140e09] border border-[#3b2915] mb-3 text-center">
                        <div>
                          <div className="flex items-center justify-center gap-1 text-[10px] text-rose-300 font-mono">
                            <Heart className="w-2.5 h-2.5" />
                            <span>HP</span>
                          </div>
                          <span className="font-bold text-xs text-[#f5d6a8] font-mono">
                            {card.stats.health}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center justify-center gap-1 text-[10px] text-cyan-300 font-mono">
                            <Zap className="w-2.5 h-2.5" />
                            <span>MP</span>
                          </div>
                          <span className="font-bold text-xs text-[#f5d6a8] font-mono">
                            {card.stats.mana}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center justify-center gap-1 text-[10px] text-amber-300 font-mono">
                            <Shield className="w-2.5 h-2.5" />
                            <span>STR</span>
                          </div>
                          <span className="font-bold text-xs text-[#f5d6a8] font-mono">
                            {card.stats.strength}
                          </span>
                        </div>
                      </div>

                      {/* Backstory snippet with inline Read Chronicle expand/collapse toggle */}
                      {card.backstory && (
                        <div className="mb-3 px-1">
                          <p className={`text-xs text-[#c4b59b] font-serif italic ${expandedChronicles[card.id] ? '' : 'line-clamp-2'} transition-all`}>
                            &ldquo;{card.backstory}&rdquo;
                          </p>
                          <button
                            type="button"
                            onClick={(e) => toggleChronicle(card.id, e)}
                            className="mt-1.5 text-[11px] font-fantasy text-[#d4af37] hover:text-[#fae498] inline-flex items-center gap-1 transition-colors cursor-pointer focus:outline-none focus-visible:underline"
                          >
                            <Scroll className="w-3 h-3 text-[#d4af37]" />
                            <span>{expandedChronicles[card.id] ? 'Collapse Chronicle' : 'Read Full Chronicle'}</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Card Actions: Load to Workbench */}
                    <div className="pt-2 border-t border-[#3b2a18] flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => handleLoadCard(card)}
                        className="text-xs font-fantasy font-semibold text-[#d4af37] hover:text-[#fff0c2] inline-flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Inspect Champion</span>
                      </button>

                      {isCurrent && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#3b2a14] text-[#ffd978]">
                          Active on Slate
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {/* Deck Storage Quota / Error Banner */}
      {deckStorageError && (
        <div 
          role="alert"
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-md w-[92%] bg-[#2b1214] border-2 border-rose-700/80 text-rose-200 px-4 py-3 rounded-xl shadow-2xl flex items-center justify-between gap-3 text-xs font-serif animate-fade-in"
        >
          <div className="flex items-center gap-2">
            <Skull className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{deckStorageError}</span>
          </div>
          <button
            type="button"
            onClick={() => setDeckStorageError(null)}
            className="text-rose-400 hover:text-white text-xs font-mono px-1.5 py-0.5 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Deleted Card Undo Floating Toast */}
      {deletedCardUndo && (
        <div 
          role="status"
          aria-live="polite"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-md w-[92%] bg-[#1c140c] border-2 border-[#d4af37] text-[#fae498] px-4 py-3 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.85)] flex items-center justify-between gap-3 text-xs sm:text-sm font-fantasy animate-fade-in"
        >
          <div className="flex items-center gap-2 truncate">
            <RotateCcw className="w-4 h-4 text-[#d4af37] shrink-0" />
            <span className="truncate">&ldquo;{deletedCardUndo.card.name}&rdquo; removed from deck.</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleUndoDelete}
              className="px-3 py-1 rounded-lg bg-[#3b2713] border border-[#d4af37] hover:bg-[#52391b] text-white font-bold transition-all cursor-pointer shadow-sm active:scale-95"
            >
              ↺ Undo
            </button>
            <button
              type="button"
              onClick={() => {
                if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current);
                setDeletedCardUndo(null);
              }}
              title="Dismiss"
              className="text-[#aa8437] hover:text-white p-1 cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Screen reader live announcement region */}
      <div 
        role="status" 
        aria-live="polite" 
        aria-atomic="true" 
        className="sr-only"
      >
        {liveAnnouncement}
      </div>

      {/* Footer styled as workbench ledger margin */}
      <footer className="relative z-10 py-5 text-center text-xs text-[#8c775a] border-t border-[#3b2a17]/70 bg-[#120c07]/80 font-serif mt-10">
        <p className="flex items-center justify-center gap-2">
          <span>⚗️ Ancient Alchemist&apos;s Workbench</span>
          <span>&bull;</span>
          <span>Fantasy Player Card Grimoire</span>
        </p>
      </footer>
    </div>
  );
}
