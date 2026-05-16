import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, 
  MapPin, 
  Trophy, 
  Users, 
  Search, 
  Flag,
  RotateCcw,
  Info,
  ChevronRight,
  Globe,
  Share2
} from 'lucide-react';

// --- TYPES ---

interface VotesBreakdown {
  [tribeName: string]: number;
}

interface Venue {
  id: string;
  name: string;
  city: string;
  votes_breakdown: VotesBreakdown;
  leading_tribe: string;
  total_votes: number;
}

interface Nation {
  name: string;
  color: string;
  code: string;
}

// --- MOCK DATA ---

const NATIONS: Nation[] = [
  { name: 'England', color: '#CE1126', code: 'gb-eng' },
  { name: 'France', color: '#002395', code: 'fr' },
  { name: 'Germany', color: '#000000', code: 'de' },
  { name: 'Spain', color: '#AA151B', code: 'es' },
  { name: 'USA', color: '#B22234', code: 'us' },
  { name: 'Brazil', color: '#FFDF00', code: 'br' },
  { name: 'Portugal', color: '#006600', code: 'pt' },
  { name: 'Netherlands', color: '#FF4F00', code: 'nl' },
  { name: 'Italy', color: '#008C45', code: 'it' },
  { name: 'Argentina', color: '#75AADB', code: 'ar' },
];

const INITIAL_VENUES: Venue[] = [
  {
    id: 'v1',
    name: 'The Red Lion',
    city: 'London',
    votes_breakdown: { 'England': 850, 'Portugal': 420, 'USA': 120 },
    leading_tribe: 'England',
    total_votes: 1390
  },
  {
    id: 'v2',
    name: 'Stretford End Pub',
    city: 'Manchester',
    votes_breakdown: { 'Germany': 600, 'England': 580, 'France': 100 },
    leading_tribe: 'Germany',
    total_votes: 1280
  },
  {
    id: 'v3',
    name: 'The Gallowgate',
    city: 'Newcastle',
    votes_breakdown: { 'England': 1200, 'USA': 50 },
    leading_tribe: 'England',
    total_votes: 1250
  },
  {
    id: 'v4',
    name: 'The Kop Bar',
    city: 'Liverpool',
    votes_breakdown: { 'Brazil': 900, 'England': 880, 'Spain': 400 },
    leading_tribe: 'Brazil',
    total_votes: 2180
  },
];

// --- COMPONENTS ---

const FanMixBar = ({ breakdown, total }: { breakdown: VotesBreakdown, total: number }) => {
  const sortedEntries = Object.entries(breakdown).sort((a, b) => b[1] - a[1]);
  
  return (
    <div className="w-full h-5 bg-gray-100 flex rounded-sm overflow-hidden border-2 border-obsidian">
      {sortedEntries.map(([tribe, votes]) => {
        const nation = NATIONS.find(n => n.name === tribe);
        const width = (votes / total) * 100;
        if (width < 3) return null;
        
        return (
          <motion.div
            key={tribe}
            initial={{ width: 0 }}
            animate={{ width: `${width}%` }}
            className="h-full relative group"
            style={{ backgroundColor: nation?.color || '#ccc' }}
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-white/30 transition-opacity flex items-center justify-center">
              <span className="text-[9px] font-black text-white drop-shadow-md">{Math.round(width)}%</span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

interface VenueWarCardProps {
  venue: Venue;
  selectedTribe: string | null;
  onClaim: (vid: string) => void;
}

const VenueWarCard: React.FC<VenueWarCardProps> = ({ 
  venue, 
  selectedTribe, 
  onClaim 
}) => {
  const leadingNation = NATIONS.find(n => n.name === venue.leading_tribe);
  
  return (
    <motion.div 
      layout
      className="bg-white border-4 border-obsidian p-4 md:p-6 space-y-4 md:space-y-6 shadow-[6px_6px_0px_0px_#111] md:shadow-[8px_8px_0px_0px_#111] hover:shadow-[10px_10px_0px_0px_#111] md:hover:shadow-[12px_12px_0px_0px_#111] transition-all"
    >
      <div className="flex justify-between items-start gap-3 md:gap-4">
        <div>
          <h3 className="text-xl md:text-3xl font-display font-black uppercase leading-none mb-1 md:mb-2 italic tracking-tighter">{venue.name}</h3>
          <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
            <MapPin size={12} className="text-pitch" /> {venue.city}
          </div>
        </div>
        <div className="relative w-14 h-9 md:w-20 md:h-12 border-2 md:border-4 border-obsidian bg-gray-50 flex items-center justify-center overflow-hidden shrink-0">
          <AnimatePresence mode="wait">
            <motion.img 
              key={venue.leading_tribe}
              initial={{ rotateY: 90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: -90, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              src={`https://flagcdn.com/w80/${leadingNation?.code || 'unk'}.png`}
              alt={venue.leading_tribe}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </AnimatePresence>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-end">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-pitch italic">Territory Mix</span>
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{venue.total_votes} CLAIMS</span>
        </div>
        <FanMixBar breakdown={venue.votes_breakdown} total={venue.total_votes} />
        
        <div className="flex flex-wrap gap-2 pt-1">
          {Object.entries(venue.votes_breakdown).sort((a,b) => (b[1] as number) - (a[1] as number)).slice(0, 4).map(([tribe, votes]) => {
            const nation = NATIONS.find(n => n.name === tribe);
            return (
              <div key={tribe} className="flex items-center gap-2 bg-gray-50 px-2 py-1 border-2 border-obsidian rounded-sm">
                <div className="w-3 h-2 shadow-sm border border-black/10">
                   <img src={`https://flagcdn.com/w20/${nation?.code}.png`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <span className="text-[10px] font-black text-obsidian uppercase tracking-wider">{Math.round(((votes as number) / (venue.total_votes as number)) * 100)}%</span>
              </div>
            );
          })}
        </div>
      </div>

      <button 
        onClick={() => onClaim(venue.id)}
        className={`
          w-full py-5 text-sm font-display font-black tracking-[0.2em] uppercase border-4 border-obsidian transition-all
          ${selectedTribe 
            ? 'bg-pitch text-white hover:bg-gold hover:text-obsidian active:translate-x-1 active:translate-y-1' 
            : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'}
        `}
      >
        {selectedTribe ? `CLAIM FOR ${selectedTribe.toUpperCase()}` : 'SELECT YOUR TRIBE'}
      </button>
    </motion.div>
  );
};

export default function App() {
  const [venues, setVenues] = useState<Venue[]>(INITIAL_VENUES);
  const [selectedTribe, setSelectedTribe] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredNATIONS = NATIONS.filter(n => 
    n.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleClaim = (venueId: string) => {
    if (!selectedTribe) return;

    setVenues(prev => prev.map(v => {
      if (v.id !== venueId) return v;

      const newBreakdown: VotesBreakdown = { ...v.votes_breakdown };
      newBreakdown[selectedTribe] = (newBreakdown[selectedTribe] || 0) + 120;

      const newTotal = Object.values(newBreakdown).reduce((a: number, b: number) => a + b, 0);
      
      const sorted = Object.entries(newBreakdown).sort((a, b) => (b[1] as number) - (a[1] as number));
      const newLeader = sorted[0][0];

      return {
        ...v,
        votes_breakdown: newBreakdown,
        total_votes: newTotal,
        leading_tribe: newLeader
      };
    }));
  };

  const cityStats = useMemo(() => {
    const cities: { [key: string]: { [tribe: string]: number } } = {};
    venues.forEach(v => {
      if (!cities[v.city]) cities[v.city] = {};
      Object.entries(v.votes_breakdown).forEach(([tribe, votes]) => {
        cities[v.city][tribe] = (cities[v.city][tribe] || 0) + (votes as number);
      });
    });

    return Object.entries(cities).map(([name, breakdown]) => {
      const total = Object.values(breakdown).reduce((a: number, b: number) => a + b, 0);
      return { name, breakdown, total };
    });
  }, [venues]);

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-obsidian font-outfit selection:bg-pitch selection:text-white pb-20">
      
      {/* STADIUM HUD */}
      <header className="sticky top-0 z-50 bg-white border-b-4 md:border-b-8 border-obsidian">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-20 md:h-24 flex items-center justify-between">
          <div className="flex items-center gap-3 md:gap-5">
            <div className="w-10 h-10 md:w-14 md:h-14 bg-obsidian flex items-center justify-center rounded-sm rotate-[-3deg] shadow-[3px_3px_0px_0px_#128c4b] md:shadow-[4px_4px_0px_0px_#128c4b]">
              <Zap className="text-pitch fill-pitch" size={20} />
            </div>
            <div>
              <h1 className="text-2xl md:text-4xl font-display font-black tracking-tighter leading-none italic uppercase">FanPulse</h1>
              <span className="text-[8px] md:text-[10px] font-black tracking-[0.3em] md:tracking-[0.5em] text-pitch uppercase block mt-1">Territory War Control</span>
            </div>
          </div>

          <div className="flex items-center gap-4 md:gap-10 bg-gray-50 px-4 md:px-8 py-2 md:py-4 border-2 md:border-4 border-obsidian rounded-sm">
            <div className="hidden sm:flex items-center gap-3">
              <div className="w-2 h-2 md:w-3 md:h-3 bg-red-600 rounded-full animate-pulse shadow-[0_0_10px_rgba(220,38,38,0.5)]" />
              <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.1em] md:tracking-[0.2em] italic">Live War</span>
            </div>
            <div className="hidden sm:block h-6 md:h-8 w-[1px] md:w-[2px] bg-obsidian/10" />
            <div className="flex items-center gap-3 md:gap-4">
              <Users size={16} className="text-pitch" />
              <div className="text-right sm:text-left">
                <div className="hidden xs:block text-[8px] md:text-[10px] font-black uppercase text-gray-400 tracking-widest">Claims</div>
                <div className="text-sm md:text-xl font-display font-black leading-none">{venues.reduce((a: number, b: Venue) => a + b.total_votes, 0).toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-6 mt-6 md:mt-12 grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-12">
        
        {/* LEFT PANEL: TRIBE SELECTOR & CITY INTEL */}
        <aside className="lg:col-span-4 xl:col-span-3 space-y-6 md:space-y-8 order-2 lg:order-1">
          <div className="bg-white border-2 md:border-4 border-obsidian p-4 md:p-6 space-y-6 md:space-y-8 shadow-[4px_4px_0px_0px_#111] md:shadow-[8px_8px_0px_0px_#111]">
            <div className="flex items-center justify-between border-b-2 md:border-b-4 border-obsidian pb-3 md:pb-4">
              <h2 className="text-xl md:text-2xl font-display font-black uppercase italic tracking-tighter">Your Firm</h2>
              <Flag size={18} className="text-pitch md:size-5" />
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text"
                placeholder="Find Nation..."
                className="w-full pl-10 pr-4 py-3 md:py-4 bg-gray-50 border-2 md:border-4 border-obsidian text-xs md:text-sm font-black outline-none focus:bg-white transition-all uppercase placeholder:text-gray-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-2 gap-2 md:gap-3 max-h-[300px] md:max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {filteredNATIONS.map(nation => (
                <button
                  key={nation.name}
                  onClick={() => setSelectedTribe(nation.name)}
                  className={`
                    p-2 md:p-4 border-2 md:border-4 transition-all flex flex-col items-center gap-1 md:gap-3 relative overflow-hidden group
                    ${selectedTribe === nation.name 
                      ? 'border-pitch bg-pitch/5' 
                      : 'border-gray-100 hover:border-obsidian'}
                  `}
                >
                  <img 
                    src={`https://flagcdn.com/w80/${nation.code}.png`} 
                    alt={nation.name}
                    className="w-full aspect-[3/2] object-cover border-1 md:border-2 border-obsidian shadow-sm grayscale group-hover:grayscale-0 transition-all"
                    referrerPolicy="no-referrer"
                  />
                  <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-center truncate w-full">
                    {nation.name}
                  </span>
                  {selectedTribe === nation.name && (
                    <div className="absolute top-0 right-0 p-0.5 md:p-1 bg-pitch text-white">
                      <Zap size={8} md:size={10} fill="currentColor" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* CITY ANALYTICS SIDEBAR */}
          <div className="bg-obsidian text-white p-4 md:p-6 space-y-6 md:space-y-8 border-2 md:border-4 border-obsidian shadow-[4px_4px_0px_0px_#128c4b] md:shadow-[6px_6px_0px_0px_#128c4b]">
            <div className="flex items-center gap-2 md:gap-3 border-b-2 border-white/20 pb-3 md:pb-4">
               <Trophy size={18} className="text-pitch md:size-5" />
               <h3 className="text-lg md:text-xl font-display font-black uppercase italic tracking-tighter">City Intel</h3>
            </div>
            <div className="space-y-8 md:space-y-10">
              {cityStats.map(city => (
                <div key={city.name} className="space-y-3 md:space-y-4">
                  <div className="flex justify-between items-end">
                    <span className="text-sm md:text-md font-black uppercase italic text-pitch tracking-tighter">{city.name}</span>
                    <span className="text-[9px] md:text-[10px] font-bold text-gray-500 uppercase tracking-widest">{Math.round(city.total).toLocaleString()} PTS</span>
                  </div>
                  <FanMixBar breakdown={city.breakdown} total={city.total} />
                  <div className="flex flex-col gap-1.5 md:gap-2">
                    {Object.entries(city.breakdown).sort((a,b) => (b[1] as number) - (a[1] as number)).slice(0, 3).map(([tribe, val]) => (
                      <div key={tribe} className="flex items-center justify-between text-[9px] md:text-[10px] font-black uppercase opacity-80">
                        <span>{tribe}</span>
                        <span className="text-pitch">{Math.round(((val as number)/(city.total as number))*100)}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* MAIN DASHBOARD PANEL */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-6 md:space-y-10 order-1 lg:order-2">
          
          {/* THE WAR MAP VIEW */}
          <section className="bg-white border-4 md:border-8 border-obsidian p-4 md:p-10 relative min-h-[400px] md:min-h-[500px] overflow-hidden">
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6 mb-8 md:mb-12 relative z-10">
              <div>
                <h2 className="text-4xl md:text-6xl font-display font-black tracking-tightest uppercase italic leading-none border-b-4 md:border-b-8 border-pitch inline-block mb-3">WAR ROOM</h2>
                <p className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-[0.2em] md:tracking-[0.4em]">Global Atmosphere Deployment Radar</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-3 md:p-4 bg-gray-50 border-2 md:border-4 border-obsidian cursor-pointer hover:bg-white transition-colors group">
                   <RotateCcw size={20} className="text-gray-400 group-hover:text-obsidian group-hover:rotate-180 transition-transform duration-500" />
                </div>
                <div className="px-4 md:px-8 py-2 md:py-4 bg-obsidian text-white text-[10px] md:text-sm font-black uppercase tracking-[0.1em] md:tracking-[0.2em] italic shadow-[3px_3px_0px_0px_#128c4b] md:shadow-[4px_4px_0px_0px_#128c4b]">
                  Live Feed [Active]
                </div>
              </div>
            </div>

            {/* RADAR FIELD */}
            <div className="relative w-full aspect-[4/3] md:aspect-[21/9] bg-gray-50 border-2 md:border-4 border-obsidian overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                <Globe className="w-1/2 h-1/2" strokeWidth={0.5} />
              </div>

              {/* Dynamic Radar Sweeper */}
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute top-1/2 left-1/2 w-full h-[2px] bg-pitch/20 origin-left -translate-y-1/2 pointer-events-none"
              />

              {venues.map((v, idx) => {
                const nation = NATIONS.find(n => n.name === v.leading_tribe);
                const positions = [
                   { top: '25%', left: '35%' },
                   { top: '55%', left: '20%' },
                   { top: '20%', left: '75%' },
                   { top: '65%', left: '65%' },
                ];
                const pos = positions[idx % positions.length];

                return (
                  <motion.div 
                    key={v.id}
                    layoutId={`radar-point-${v.id}`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute z-20 group"
                    style={{ top: pos.top, left: pos.left }}
                  >
                    <div className="relative cursor-pointer">
                      <motion.div 
                        animate={{ 
                          scale: [1, 1.15, 1],
                          rotate: [0, -2, 2, 0]
                        }}
                        transition={{ 
                          duration: 4,
                          repeat: Infinity,
                          delay: idx * 0.3
                        }}
                        className="w-16 h-10 bg-white border-4 border-obsidian flex items-center justify-center p-1 shadow-2xl ring-8 ring-pitch/5"
                      >
                         <AnimatePresence mode="wait">
                          <motion.img 
                            key={v.leading_tribe}
                            initial={{ scale: 0, rotateY: 90 }}
                            animate={{ scale: 1, rotateY: 0 }}
                            exit={{ scale: 0, rotateY: -90 }}
                            src={`https://flagcdn.com/w80/${nation?.code}.png`}
                            className="w-full h-full object-cover border border-black/5"
                            referrerPolicy="no-referrer"
                          />
                        </AnimatePresence>
                      </motion.div>
                      
                      {/* Name Tag */}
                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1 bg-obsidian text-white text-[9px] font-black uppercase whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 border-2 border-pitch pointer-events-none z-50">
                        {v.name} &bull; {v.leading_tribe} Lead
                      </div>

                      {/* Distance Rings */}
                      <div className="absolute inset-0 -m-8 border-2 border-dashed border-pitch/20 rounded-full animate-ping opacity-20 pointer-events-none" />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>

          {/* TERRITORY CARDS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
            {venues.map(v => (
              <VenueWarCard 
                key={v.id} 
                venue={v} 
                selectedTribe={selectedTribe}
                onClaim={handleClaim}
              />
            ))}
          </div>

          {/* SYSTEM COMMANDS / REWARDS */}
          <section className="bg-pitch p-6 md:p-12 text-white border-4 md:border-8 border-obsidian relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 md:opacity-10 rotate-12 group-hover:rotate-0 transition-transform duration-700">
               <Trophy className="w-32 h-32 md:w-40 md:h-40" />
            </div>
            
            <div className="relative z-10 grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
              <div className="space-y-6 md:space-y-8">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="p-2 md:p-3 bg-white text-pitch rounded-sm border-2 border-obsidian">
                    <Zap size={24} md:size={32} fill="currentColor" />
                  </div>
                  <h2 className="text-3xl md:text-5xl font-display font-black tracking-tightest uppercase italic leading-none">CONQUER <br/>THE PITCH</h2>
                </div>
                <p className="text-lg md:text-xl font-bold opacity-90 leading-tight border-l-4 md:border-l-8 border-white pl-4 md:pl-6 italic">
                  Leading tribes at the end of each session unlock VIP lounge access and official team-branded beer taps.
                </p>
                <div className="flex gap-4">
                  <button className="flex-1 bg-obsidian text-white border-2 md:border-4 border-white py-4 md:py-5 px-4 md:px-8 text-[10px] md:text-xs font-black uppercase tracking-[0.2em] md:tracking-[0.3em] hover:bg-white hover:text-obsidian transition-colors italic">
                    Claim Status Check
                  </button>
                </div>
              </div>
              
              <div className="bg-white/10 p-6 md:p-10 border-2 md:border-4 border-white/40 backdrop-blur-md rounded-sm space-y-4 md:space-y-6">
                <div className="flex items-center gap-3 border-b-2 border-white/20 pb-4">
                  <Info className="text-gold" size={20} />
                  <span className="text-[10px] md:text-sm font-black uppercase tracking-[0.2em] md:tracking-[0.4em] italic">Intelligence Briefing</span>
                </div>
                <div className="space-y-3 md:space-y-4">
                   {[
                     "Identify your national firm in the left console.",
                     "Navigate the Radar to locate contested venues.",
                     "Execute CLAIMS to shift the power balance.",
                     "Elite firms control the city pulse for 2026."
                   ].map((text, i) => (
                     <div key={i} className="flex items-start gap-3 md:gap-4 text-[10px] md:text-xs font-black uppercase tracking-tight">
                        <span className="text-gold font-display text-base md:text-lg leading-none">0{i+1}</span>
                        <p className="opacity-80 pt-0.5">{text}</p>
                     </div>
                   ))}
                </div>
              </div>
            </div>
          </section>

        </div>
      </main>

      <footer className="mt-20 md:mt-32 border-t-4 md:border-t-8 border-obsidian bg-white py-12 md:py-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 md:gap-12">
           <div className="flex items-center gap-4 md:gap-5">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-obsidian flex items-center justify-center rounded-sm">
              <Zap className="text-pitch" size={32} md:size={40} />
            </div>
            <div>
              <h1 className="text-2xl md:text-4xl font-display font-black uppercase italic tracking-tighter leading-none">FanPulse</h1>
              <div className="text-[8px] md:text-[9px] font-bold text-gray-400 uppercase tracking-[0.3em] md:tracking-[0.5em] mt-1">Global Infrastructure Command</div>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-6 md:gap-12 text-[8px] md:text-xs font-black uppercase tracking-[0.2em] md:tracking-[0.4em] text-gray-500">
            <a href="#" className="hover:text-pitch transition-colors border-b-2 border-transparent hover:border-pitch pb-1">Privacy Protocol</a>
            <a href="#" className="hover:text-pitch transition-colors border-b-2 border-transparent hover:border-pitch pb-1">War Rules</a>
            <a href="#" className="hover:text-pitch transition-colors border-b-2 border-transparent hover:border-pitch pb-1">Asset Control</a>
          </div>
          <div className="text-[8px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest text-center md:text-right">
            EST. 2026 &bull; FIFA WORLD CUP <br/>TERRITORY MANAGEMENT SYSTEM
          </div>
        </div>
      </footer>

      {/* Global CSS for custom scrollbar */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #111;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #128c4b;
        }
      `}</style>
    </div>
  );
}
