import React, { useState, useEffect } from 'react';
import { Player, SportType, VerbQuestion } from './types';
import { generateQuestion } from './conjugator';
import { SportsArena } from './SportsArenas';
import { LobbyScreen, TransitionScreen, MedalCeremony } from './ChampionshipScreens';
import { Trophy, ShieldAlert, Award, RefreshCw, Star, Info, Volume2 } from 'lucide-react';

const SPORTS_LIST: SportType[] = ['football', 'basketball', 'archery', 'tennis', 'sprint', 'weightlifting'];

export default function App() {
  // Screens: 'lobby' | 'sport_transition' | 'sport_playing' | 'medal_ceremony'
  const [screen, setScreen] = useState<'lobby' | 'sport_transition' | 'sport_playing' | 'medal_ceremony'>('lobby');
  
  const [players, setPlayers] = useState<[Player, Player]>([
    { id: 1, name: 'Արամ', score: 0, avatar: '⚽', country: 'ARM', scoresBySport: {} as any },
    { id: 2, name: 'Carlos', score: 0, avatar: '🇪🇸', country: 'ESP', scoresBySport: {} as any }
  ]);

  const [currentSportIndex, setCurrentSportIndex] = useState<number>(0);
  const [activePlayerIndex, setActivePlayerIndex] = useState<number>(0); // 0 = Player 1, 1 = Player 2
  const [currentTrial, setCurrentTrial] = useState<number>(1); // 1, 2, or 3 trials per sport
  const [currentQuestion, setCurrentQuestion] = useState<VerbQuestion | null>(null);
  const [leaderboard, setLeaderboard] = useState<{ name: string; score: number; date: string }[]>([]);
  const [sportTrophyWinners, setSportTrophyWinners] = useState<Record<string, string>>({});

  // Load leaderboard from localStorage on startup safely
  useEffect(() => {
    try {
      const stored = localStorage.getItem('arm_esp_olympiads_leaderboard');
      if (stored) {
        setLeaderboard(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed reading leaderboard from local storage', e);
    }
  }, []);

  const saveToLeaderboard = (name: string, score: number) => {
    try {
      const newEntry = { name, score, date: new Date().toISOString() };
      const updated = [...leaderboard, newEntry]
        .sort((a, b) => b.score - a.score)
        .slice(0, 10); // keep top 10
      setLeaderboard(updated);
      localStorage.setItem('arm_esp_olympiads_leaderboard', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed saving to leaderboard', e);
    }
  };

  const handleStartChampionship = (p1Name: string, p2Name: string, p1Country: 'ARM' | 'ESP', p2Country: 'ARM' | 'ESP') => {
    const initializedPlayers: [Player, Player] = [
      {
        id: 1,
        name: p1Name,
        score: 0,
        avatar: p1Country === 'ARM' ? '🇦🇲' : '🇪🇸',
        country: p1Country,
        scoresBySport: {
          football: 0, basketball: 0, archery: 0, tennis: 0, sprint: 0, weightlifting: 0
        }
      },
      {
        id: 2,
        name: p2Name,
        score: 0,
        avatar: p2Country === 'ARM' ? '🇦🇲' : '🇪🇸',
        country: p2Country,
        scoresBySport: {
          football: 0, basketball: 0, archery: 0, tennis: 0, sprint: 0, weightlifting: 0
        }
      }
    ];

    setPlayers(initializedPlayers);
    setCurrentSportIndex(0);
    setActivePlayerIndex(0);
    setCurrentTrial(1);
    setSportTrophyWinners({});
    
    // Generate initial question for player 1, sport 1
    const initialQuestion = generateQuestion(SPORTS_LIST[0], 1)[0];
    setCurrentQuestion(initialQuestion);
    setScreen('sport_transition');
  };

  const handleTrialCompleted = (isCorrect: boolean, scoreGained: number, responseTimeMs: number) => {
    const sportKey = SPORTS_LIST[currentSportIndex];
    
    // Update active player's score
    setPlayers((prev) => {
      const updated = [...prev] as [Player, Player];
      const p = { ...updated[activePlayerIndex] };
      p.score += scoreGained;
      p.scoresBySport = {
        ...p.scoresBySport,
        [sportKey]: (p.scoresBySport[sportKey] || 0) + scoreGained
      };
      updated[activePlayerIndex] = p;
      return updated;
    });

    if (currentTrial < 3) {
      // Move to next trial for the SAME player
      const nextTrial = currentTrial + 1;
      setCurrentTrial(nextTrial);
      const nextQ = generateQuestion(sportKey, 1)[0];
      setCurrentQuestion(nextQ);
    } else {
      // Active player has completed their 3 trials
      if (activePlayerIndex === 0) {
        // Switch to Player 2 for the same sport
        setActivePlayerIndex(1);
        setCurrentTrial(1);
        const player2Q = generateQuestion(sportKey, 1)[0];
        setCurrentQuestion(player2Q);
        setScreen('sport_transition');
      } else {
        // Both players have completed this sport discipline
        // Calculate who won this sport's trophy medal
        const p1SportScore = players[0].scoresBySport[sportKey] || 0;
        const p2SportScore = (players[1].scoresBySport[sportKey] || 0) + (activePlayerIndex === 1 ? scoreGained : 0); // factor in current trial's score directly
        let winnerName = 'Ոչ-ոքի';
        if (p1SportScore > p2SportScore) {
          winnerName = players[0].name;
        } else if (p2SportScore > p1SportScore) {
          winnerName = players[1].name;
        }
        
        setSportTrophyWinners(prev => ({
          ...prev,
          [sportKey]: winnerName
        }));

        // Transition to next sport or finish championship
        if (currentSportIndex < SPORTS_LIST.length - 1) {
          const nextSportIdx = currentSportIndex + 1;
          setCurrentSportIndex(nextSportIdx);
          setActivePlayerIndex(0);
          setCurrentTrial(1);
          const nextSportQ = generateQuestion(SPORTS_LIST[nextSportIdx], 1)[0];
          setCurrentQuestion(nextSportQ);
          setScreen('sport_transition');
        } else {
          // Championship completed! Save scores to leaderboard and transition to ceremonies
          const finalP1 = players[0];
          const finalP2 = { ...players[1] };
          // Factor in the final trial score for P2 properly
          finalP2.score += scoreGained;

          saveToLeaderboard(finalP1.name, finalP1.score);
          saveToLeaderboard(finalP2.name, finalP2.score);
          setScreen('medal_ceremony');
        }
      }
    }
  };

  const handleStartActiveSport = () => {
    setScreen('sport_playing');
  };

  const handleReset = () => {
    setScreen('lobby');
  };

  const currentSportKey = SPORTS_LIST[currentSportIndex];

  return (
    <div className="min-h-screen bg-[#060608] text-slate-100 flex flex-col justify-between selection:bg-amber-500 selection:text-black font-sans antialiased">
      
      {/* Elegant Dark Navigation Header Frame */}
      <header className="border-b border-white/5 bg-black/40 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-tr from-amber-500 via-orange-505 to-yellow-400 rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.15)]">
              <Trophy className="w-5 h-5 text-black" />
            </div>
            <div>
              <span className="text-sm font-display font-bold uppercase tracking-wider text-white sm:block hidden">
                ARM-ESP 3D Sports Championship
              </span>
              <span className="text-xs text-slate-400 font-medium block">
                Անցյալ ժամանակներ • Pretérito Indefinido / Imperfecto / Perfecto
              </span>
            </div>
          </div>

          {/* Real-time cumulative scores during play */}
          {screen !== 'lobby' && (
            <div className="flex items-center space-x-2 md:space-x-4">
              <div className="flex items-center space-x-1.5 md:space-x-2 bg-[#0c0c0e] rounded-xl px-3 py-1.5 border border-white/10 shadow-lg">
                <span className="text-base filter drop-shadow">{players[0].avatar}</span>
                <span className="text-xs md:text-sm font-semibold text-slate-200 truncate max-w-[80px]">{players[0].name}</span>
                <span className="text-xs bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded font-mono font-bold">{players[0].score}</span>
              </div>
              <span className="text-xs font-mono text-zinc-650 font-medium">VS</span>
              <div className="flex items-center space-x-1.5 md:space-x-2 bg-[#0c0c0e] rounded-xl px-3 py-1.5 border border-white/10 shadow-lg">
                <span className="text-base filter drop-shadow">{players[1].avatar}</span>
                <span className="text-xs md:text-sm font-semibold text-slate-200 truncate max-w-[80px]">{players[1].name}</span>
                <span className="text-xs bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded font-mono font-bold">{players[1].score}</span>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main interactive application viewport */}
      <main className="flex-grow flex items-center justify-center p-4 md:p-8 animate-fade-in">
        <div className="w-full max-w-7xl">
          {screen === 'lobby' && (
            <LobbyScreen 
              onStartChampionship={handleStartChampionship} 
              leaderboard={leaderboard} 
            />
          )}

          {screen === 'sport_transition' && (
            <TransitionScreen
              sport={currentSportKey}
              player={players[activePlayerIndex]}
              round={currentSportIndex + 1}
              onContinue={handleStartActiveSport}
            />
          )}

          {screen === 'sport_playing' && currentQuestion && (
            <div className="space-y-6 animate-scale-up">
              {/* Olympic Discipline Tracker mini header */}
              <div className="flex items-center space-y-2 md:space-y-0 md:space-x-4 justify-between bg-[#0e0e11] p-4 rounded-2xl border border-white/5 flex-wrap">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">Առաջընթաց՝</span>
                  <div className="flex space-x-1">
                    {SPORTS_LIST.map((sport, idx) => {
                      const isCompleted = idx < currentSportIndex;
                      const isCurrent = idx === currentSportIndex;
                      
                      let circleClass = "bg-[#141418] border-white/5 text-zinc-500";
                      if (isCompleted) circleClass = "bg-emerald-500/10 border-emerald-500/30 text-emerald-400";
                      if (isCurrent) circleClass = "bg-amber-500/10 border-amber-500 text-amber-300 animate-pulse font-bold shadow-[0_0_10px_rgba(245,158,11,0.1)]";

                      return (
                        <div
                          key={sport}
                          className={`w-7 h-7 rounded-lg border text-[11px] font-mono font-semibold flex items-center justify-center ${circleClass}`}
                          title={`${sport} discipline`}
                        >
                          {idx + 1}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Sub info about trial status */}
                <div className="flex items-center space-x-3 text-xs md:text-sm text-zinc-400 font-medium">
                  <span>Փորձարկում՝ <strong className="text-amber-400 font-mono font-black">{currentTrial} / 3</strong></span>
                  <span className="text-zinc-800">•</span>
                  <span>Խաղացող՝ <strong className="text-white font-semibold">{players[activePlayerIndex].name}</strong></span>
                </div>
              </div>

              {/* Main Game Arena */}
              <SportsArena
                sport={currentSportKey}
                player={players[activePlayerIndex]}
                question={currentQuestion}
                onCompleted={handleTrialCompleted}
              />
            </div>
          )}

          {screen === 'medal_ceremony' && (
            <MedalCeremony players={players} onReset={handleReset} />
          )}
        </div>
      </main>

      {/* Elegant footer with instructional guidelines & developer signature */}
      <footer className="border-t border-white/5 bg-black/20 py-8 text-center text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 space-y-3">
          <p>© 2026 Armenian-Spanish Past Tense 3D Olympic Contest. Բոլոր իրավունքները պաշտպանված են:</p>
          <div className="flex justify-center space-x-4 text-[10px] font-mono tracking-wider font-semibold text-zinc-650">
            <span>PRETERITO INDEFINIDO</span>
            <span>•</span>
            <span>IMPERFECTO</span>
            <span>•</span>
            <span>PERFECTO</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
