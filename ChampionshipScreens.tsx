import React, { useState } from 'react';
import { Player, SportType } from './types';
import { Trophy, HelpCircle, User, Users, Play, Sparkles, Medal, Volume2, ArrowRight } from 'lucide-react';

interface LobbyScreenProps {
  onStartChampionship: (p1Name: string, p2Name: string, p1Country: 'ARM' | 'ESP', p2Country: 'ARM' | 'ESP') => void;
  leaderboard: { name: string; score: number; date: string }[];
}

export function LobbyScreen({ onStartChampionship, leaderboard }: LobbyScreenProps) {
  const [p1Name, setP1Name] = useState('Արամ');
  const [p2Name, setP2Name] = useState('Carlos');
  const [p1Country, setP1Country] = useState<'ARM' | 'ESP'>('ARM');
  const [p2Country, setP2Country] = useState<'ARM' | 'ESP'>('ESP');

  const avatars = ['⚽', '🏀', '🎾', '🏹', '🏋️', '🏃', '🏆', '⭐'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!p1Name.trim() || !p2Name.trim()) return;
    onStartChampionship(p1Name, p2Name, p1Country, p2Country);
  };

  return (
    <div id="lobby-screen-root" className="max-w-4xl mx-auto bg-[#0f0f12]/90 border border-white/5 p-6 md:p-10 rounded-3xl shadow-[0_30px_100px_rgba(0,0,0,0.8)] backdrop-blur-xl animate-fade-in text-slate-100">
      
      {/* Brilliant Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center space-x-2 bg-amber-500/10 border border-amber-500/20 px-4 py-1.5 rounded-full text-amber-400 mb-4 text-xs font-mono font-bold tracking-widest uppercase">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>ARM to ESP Past Tense Contest</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-bold text-white tracking-tight leading-none mb-3">
          Անցյալ Ժամանակների Օլիմպիադա
        </h1>
        <p className="text-zinc-400 text-sm md:text-base max-w-xl mx-auto font-medium leading-relaxed">
          Մարզական 2 խաղացողով 3D առաջնություն՝ հայերենից իսպաներեն անցյալ ժամանակների (Past Tenses) թարգմանության համար:
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        
        {/* PLAYER 1 BOX (ARMENIA DEFAULTS) */}
        <div className="bg-[#070709] p-6 rounded-2xl border border-white/5 relative overflow-hidden group hover:border-[#bf2626]/40 transition-all duration-300 shadow-[inset_0_1px_10px_rgba(255,255,255,0.02)]">
          <div className="absolute top-0 right-0 p-3 text-2xl filter drop-shadow">🇦🇲</div>
          <div className="flex items-center space-x-3 mb-5">
            <div className="w-10 h-10 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl flex items-center justify-center font-bold font-mono text-sm">
              P1
            </div>
            <div>
              <h3 className="font-display font-medium text-base text-slate-200">Խաղացող 1</h3>
              <p className="text-xs text-zinc-500">Ընտրեք անունը և դրոշը</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider block mb-1.5 font-bold">Անուն</label>
              <input
                type="text"
                id="p1-name-input"
                value={p1Name}
                onChange={(e) => setP1Name(e.target.value)}
                maxLength={16}
                className="w-full bg-[#0d0d10] border border-white/10 px-4 py-3 rounded-xl focus:border-amber-500 focus:outline-none font-medium text-slate-200 text-sm transition-all"
                placeholder="Արամ"
              />
            </div>

            <div>
              <label className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider block mb-1.5 font-bold">Թիմ / Դրոշ</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  id="p1-country-arm"
                  onClick={() => setP1Country('ARM')}
                  className={`py-3 rounded-xl border text-sm font-semibold flex items-center justify-center space-x-2 transition-all ${
                    p1Country === 'ARM' 
                      ? 'bg-red-500/10 border-red-500/40 text-red-200 shadow-lg shadow-red-950/20' 
                      : 'bg-[#101014] border-white/5 text-zinc-400 hover:border-white/10'
                  }`}
                >
                  <span className="text-lg">🇦🇲</span>
                  <span>Հայաստան</span>
                </button>
                <button
                  type="button"
                  id="p1-country-esp"
                  onClick={() => setP1Country('ESP')}
                  className={`py-3 rounded-xl border text-sm font-semibold flex items-center justify-center space-x-2 transition-all ${
                    p1Country === 'ESP' 
                      ? 'bg-amber-500/10 border-amber-500/40 text-amber-200 shadow-lg shadow-amber-950/20' 
                      : 'bg-[#101014] border-white/5 text-zinc-400 hover:border-white/10'
                  }`}
                >
                  <span className="text-lg">🇪🇸</span>
                  <span>Իսպանիա</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* PLAYER 2 BOX (SPAIN DEFAULTS) */}
        <div className="bg-[#070709] p-6 rounded-2xl border border-white/5 relative overflow-hidden group hover:border-[#cca53d]/40 transition-all duration-300 shadow-[inset_0_1px_10px_rgba(255,255,255,0.02)]">
          <div className="absolute top-0 right-0 p-3 text-2xl filter drop-shadow">🇪🇸</div>
          <div className="flex items-center space-x-3 mb-5">
            <div className="w-10 h-10 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl flex items-center justify-center font-bold font-mono text-sm">
              P2
            </div>
            <div>
              <h3 className="font-display font-medium text-base text-slate-200">Խաղացող 2</h3>
              <p className="text-xs text-zinc-500">Ընտրեք անունը և դրոշը</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider block mb-1.5 font-bold">Անուն</label>
              <input
                type="text"
                id="p2-name-input"
                value={p2Name}
                onChange={(e) => setP2Name(e.target.value)}
                maxLength={16}
                className="w-full bg-[#0d0d10] border border-white/10 px-4 py-3 rounded-xl focus:border-amber-500 focus:outline-none font-medium text-slate-200 text-sm transition-all"
                placeholder="Carlos"
              />
            </div>

            <div>
              <label className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider block mb-1.5 font-bold">Թիմ / Դրոշ</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  id="p2-country-arm"
                  onClick={() => setP2Country('ARM')}
                  className={`py-3 rounded-xl border text-sm font-semibold flex items-center justify-center space-x-2 transition-all ${
                    p2Country === 'ARM' 
                      ? 'bg-red-500/10 border-red-500/40 text-red-200 shadow-lg shadow-red-950/20' 
                      : 'bg-[#101014] border-white/5 text-zinc-400 hover:border-white/10'
                  }`}
                >
                  <span className="text-lg">🇦🇲</span>
                  <span>Հայաստան</span>
                </button>
                <button
                  type="button"
                  id="p2-country-esp"
                  onClick={() => setP2Country('ESP')}
                  className={`py-3 rounded-xl border text-sm font-semibold flex items-center justify-center space-x-2 transition-all ${
                    p2Country === 'ESP' 
                      ? 'bg-amber-500/10 border-amber-500/40 text-amber-200 shadow-lg shadow-amber-950/20' 
                      : 'bg-[#101014] border-white/5 text-zinc-400 hover:border-white/10'
                  }`}
                >
                  <span className="text-lg">🇪🇸</span>
                  <span>Իսպանիա</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Actions bar and explanation rules */}
        <div className="md:col-span-2 text-center pt-6">
          <button
            type="submit"
            id="start-championship-submit"
            className="px-10 py-4.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-display font-medium text-base tracking-wide shadow-lg shadow-amber-500/10 hover:shadow-amber-500/20 active:scale-98 transform transition-all duration-200 cursor-pointer inline-flex items-center space-x-3 mx-auto"
          >
            <span>ՍԿՍԵԼ ԱՌԱՋՆՈՒԹՅՈՒՆԸ</span>
            <ArrowRight className="w-5 h-5 text-black" />
          </button>
        </div>
      </form>

      {/* Grammar Help Panel */}
      <div className="mt-12 pt-8 border-t border-white/5 grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-[#070709] p-5 rounded-2xl border border-white/5">
          <h4 className="font-bold text-amber-400 text-xs uppercase tracking-wider font-mono">1. Pretérito Indefinido</h4>
          <p className="text-xs text-zinc-400 mt-2 leading-relaxed font-medium">
            Ավարտված գործողություն անցյալում: (e.g. <i>ես գրեցի</i> - escribí, <i>դու կերար</i> - comiste).
          </p>
        </div>
        <div className="bg-[#070709] p-5 rounded-2xl border border-white/5">
          <h4 className="font-bold text-sky-400 text-xs uppercase tracking-wider font-mono">2. Pretérito Imperfecto</h4>
          <p className="text-xs text-zinc-400 mt-2 leading-relaxed font-medium">
            Շարունակական կամ կրկնվող անցյալ: (e.g. <i>ես խոսում էի</i> - hablaba, <i>մենք ուտում էինք</i> - comíamos).
          </p>
        </div>
        <div className="bg-[#070709] p-5 rounded-2xl border border-white/5">
          <h4 className="font-bold text-emerald-400 text-xs uppercase tracking-wider font-mono">3. Pretérito Perfecto</h4>
          <p className="text-xs text-zinc-400 mt-2 leading-relaxed font-medium">
            Վերջերս կատարված անցյալ: (e.g. <i>ես ապրել եմ</i> - he vivido, <i>նա գրել է</i> - ha escrito).
          </p>
        </div>
      </div>

      {/* Leaderboard segment */}
      {leaderboard.length > 0 && (
        <div className="mt-10 pt-8 border-t border-white/5">
          <div className="flex items-center space-x-2 mb-4 justify-center">
            <Trophy className="w-4 h-4 text-amber-500" />
            <h3 className="font-display font-medium text-base text-zinc-200">Չեմպիոնների Պատվո Ցուցակ</h3>
          </div>
          <div className="max-w-md mx-auto bg-[#070709] rounded-2xl border border-white/5 overflow-hidden shadow-lg">
            <table className="w-full text-left text-xs text-zinc-400">
              <thead className="bg-[#0c0c0f] border-b border-white/5 text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                <tr>
                  <th className="px-6 py-3.5 font-bold">Խաղացող</th>
                  <th className="px-6 py-3.5 text-right font-bold">Միավորներ</th>
                  <th className="px-6 py-3.5 text-right font-bold">Ամսաթիվ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {leaderboard.slice(0, 5).map((entry, idx) => (
                  <tr key={idx} className="hover:bg-white/2 font-medium">
                    <td className="px-6 py-3.5 text-slate-100 flex items-center space-x-2">
                      <span className="text-[10px] font-bold text-zinc-600 font-mono w-4">{idx + 1}.</span>
                      <span className="text-zinc-200 font-bold">{entry.name}</span>
                    </td>
                    <td className="px-6 py-3.5 text-right text-amber-400 font-bold font-mono text-sm">{entry.score}</td>
                    <td className="px-6 py-3.5 text-right text-[10px] font-mono text-zinc-550">{new Date(entry.date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

interface TransitionScreenProps {
  sport: SportType;
  player: Player;
  round: number;
  onContinue: () => void;
}

export function TransitionScreen({ sport, player, round, onContinue }: TransitionScreenProps) {
  const getSportVisualNameAndIcon = (type: SportType) => {
    switch (type) {
      case 'football': return { name: 'Ֆուտբոլ (Penalty Shootout)', icon: '⚽' };
      case 'basketball': return { name: 'ԲԱՍԿԵՏԲՈԼ', icon: '🏀' };
      case 'archery': return { name: 'ԱՂԵՂՆԱՁԳՈՒԹՅՈՒՆ', icon: '🏹' };
      case 'tennis': return { name: 'ԹԵՆԻՍ', icon: '🎾' };
      case 'sprint': return { name: 'ԱԹԼԵՏԻԿԱ (ՎԱԶՔ)', icon: '🏃' };
      case 'weightlifting': return { name: 'ԾԱՆՐԱՄԱՐՏ (LIFTING)', icon: '🏋️' };
    }
  };

  const { name, icon } = getSportVisualNameAndIcon(sport);
  const countryFlag = player.country === 'ARM' ? '🇦🇲' : '🇪🇸';

  return (
    <div id="transition-screen-root" className="max-w-2xl mx-auto bg-[#0f0f12] border border-white/5 p-8 rounded-3xl text-center shadow-[0_30px_100px_rgba(0,0,0,0.8)] relative overflow-hidden backdrop-blur-xl animate-fade-in text-slate-100">
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-red-500 via-amber-500 to-indigo-500" />
      
      <span className="inline-block text-6xl my-6 transform hover:scale-105 transition duration-300 filter drop-shadow">
        {icon}
      </span>
      
      <div className="space-y-2">
        <p className="text-[10px] uppercase font-mono tracking-widest text-[#cca53d] font-bold">Մարզաձև {round} / 6</p>
        <h2 className="text-2xl font-display font-bold text-white uppercase tracking-tight">{name}</h2>
      </div>

      <div className="my-8 p-6 bg-[#070709] border border-white/5 rounded-2xl max-w-lg mx-auto">
        <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono font-bold">Հերթականություն՝</p>
        <div className="flex items-center justify-center space-x-3 mt-3">
          <span className="text-3xl filter drop-shadow">{countryFlag}</span>
          <span className="text-xl font-display text-amber-400 font-bold">{player.name}</span>
        </div>
        <p className="text-xs text-zinc-400 mt-4 leading-relaxed font-medium">
          Պատրաստե՛ք մկնիկը կամ սենսորը: Դուք ունեք 3 փորձառություն (trial): Յուրաքանչյուր ճիշտ պատասխան բերում է 100+ միավոր:
        </p>
      </div>

      <button
        id="continue-to-sport-button"
        onClick={onContinue}
        className="px-8 py-4 bg-amber-500 hover:bg-amber-400 text-black font-display font-medium text-base rounded-2xl tracking-wide shadow-lg shadow-amber-500/10 active:scale-98 transform transition-all duration-200 cursor-pointer flex items-center space-x-2 mx-auto"
      >
        <span>ՍԿՍԵԼ ՓՈՐՁԱՇՐՋԱՆԸ &rarr;</span>
      </button>
    </div>
  );
}

interface MedalCeremonyProps {
  players: [Player, Player];
  onReset: () => void;
}

export function MedalCeremony({ players, onReset }: MedalCeremonyProps) {
  const sorted = [...players].sort((a, b) => b.score - a.score);
  const winner = sorted[0];
  const runnerUp = sorted[1];
  const isDraw = winner.score === runnerUp.score;

  return (
    <div id="medal-ceremony-root" className="max-w-3xl mx-auto bg-[#0f0f12] border border-white/5 p-8 md:p-12 rounded-3xl text-center shadow-[0_30px_100px_rgba(0,0,0,0.8)] relative overflow-hidden backdrop-blur-xl animate-fade-in text-slate-100">
      
      {/* Visual podium celebrate */}
      <span className="inline-block text-7xl my-6 animate-bounce filter drop-shadow">🏆</span>

      <div className="space-y-2">
        <h1 className="text-3xl md:text-5xl font-display font-black text-white tracking-tight uppercase leading-none">
          {isDraw ? 'ՈՉ-ՈՔԻ!' : 'ՀԱՂԹԱՆԱԿ!'}
        </h1>
        <p className="text-zinc-500 text-xs md:text-sm font-medium tracking-wide">Առաջնության պաշտոնական արդյունքները և մեդալների հանձնում</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-10 max-w-xl mx-auto">
        
        {/* GOLD MEDALIST / WINNER */}
        <div className="bg-[#070709] p-6 rounded-2xl border border-amber-500/30 relative overflow-hidden flex flex-col items-center shadow-lg">
          <div className="absolute top-3 right-3 p-2 bg-amber-500/10 rounded-full">
            <Medal className="w-6 h-6 text-amber-500 fill-amber-500" />
          </div>
          <span className="text-[10px] font-mono tracking-widest text-[#cca53d] font-bold uppercase">1-ին Տեղ (ՈՍԿԻ)</span>
          <span className="text-4xl my-3 filter drop-shadow">{winner.country === 'ARM' ? '🇦🇲' : '🇪🇸'}</span>
          <h3 className="text-lg font-display font-bold text-slate-100 mt-1">{winner.name}</h3>
          <p className="text-2xl font-mono font-bold text-amber-400 mt-2">{winner.score} <span className="text-xs text-zinc-500 font-sans font-medium">միավոր</span></p>
        </div>

        {/* SILVER MEDALIST */}
        <div className="bg-[#070709] p-6 rounded-2xl border border-white/5 relative overflow-hidden flex flex-col items-center shadow-lg">
          <div className="absolute top-3 right-3 p-2 bg-white/5 rounded-full">
            <Medal className="w-6 h-6 text-zinc-400 fill-zinc-400" />
          </div>
          <span className="text-[10px] font-mono tracking-widest text-zinc-400 font-bold uppercase">{isDraw ? '1-ին Տեղ (ՈՍԿԻ)' : '2-րդ Տեղ (ԱՐԾԱԹ)'}</span>
          <span className="text-4xl my-3 filter drop-shadow">{runnerUp.country === 'ARM' ? '🇦🇲' : '🇪🇸'}</span>
          <h3 className="text-lg font-display font-bold text-slate-100 mt-1">{runnerUp.name}</h3>
          <p className="text-2xl font-mono font-bold text-zinc-300 mt-2">{runnerUp.score} <span className="text-xs text-zinc-500 font-sans font-medium">միավոր</span></p>
        </div>
      </div>

      {/* Breakdown per sport for competition audit */}
      <div className="bg-[#070709] border border-white/5 rounded-2xl p-6 text-left max-w-xl mx-auto my-8">
        <h4 className="font-display font-bold text-zinc-300 text-sm mb-4 border-b border-white/5 pb-2.5">Մարզաձևերի վիճակագրություն</h4>
        <div className="space-y-3 font-mono text-xs">
          {(['football', 'basketball', 'archery', 'tennis', 'sprint', 'weightlifting'] as SportType[]).map((sport) => {
            const getSportName = (s: SportType) => {
              if (s === 'football') return 'Ֆուտբոլ (Penalty)';
              if (s === 'basketball') return 'Բասկետբոլ';
              if (s === 'archery') return 'Աղեղնաձգություն';
              if (s === 'tennis') return 'Թենիս';
              if (s === 'sprint') return 'Վազք';
              return 'Ծանրամարտ';
            };

            return (
              <div key={sport} className="flex justify-between items-center border-b border-white/5 pb-1.5 font-medium flex-wrap">
                <span className="text-zinc-400 font-semibold">{getSportName(sport)}:</span>
                <div className="flex space-x-6 text-zinc-300">
                  <span>{players[0].name}: <strong className="text-amber-400 font-mono">{players[0].scoresBySport[sport] || 0}</strong></span>
                  <span>{players[1].name}: <strong className="text-amber-300 font-mono">{players[1].scoresBySport[sport] || 0}</strong></span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <button
        id="restart-championship-button"
        onClick={onReset}
        className="px-8 py-4 bg-[#141418] border border-white/10 hover:border-white/20 text-white font-display font-medium text-base rounded-2xl tracking-wide shadow-lg active:scale-98 transform transition-all duration-200 cursor-pointer flex items-center space-x-2.5 mx-auto"
      >
        <RotateCcw className="w-5 h-5 text-amber-500 animate-spin-slow" />
        <span>ԽԱՂԱԼ ՆՈՐԻՑ</span>
      </button>
    </div>
  );
}

const RotateCcw = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
  </svg>
);
