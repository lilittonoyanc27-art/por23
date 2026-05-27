import React, { useEffect, useRef, useState } from 'react';
import { VerbQuestion, SportType, Player } from './types';
import { Trophy, Zap, AlertTriangle, Play, HelpCircle, CheckCircle, RotateCcw } from 'lucide-react';

// Web Audio API Sound Synthesizer for high-fidelity game feel without external media files
class SoundEffects {
  private ctx: AudioContext | null = null;

  private init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  playWhistle() {
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1000, this.ctx.currentTime + 0.15);
    osc.frequency.setValueAtTime(1000, this.ctx.currentTime + 0.2);
    osc.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.35);

    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.4);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.4);
  }

  playSuccess() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    
    // Nice major chord chime (C5 -> E5 -> G5)
    const notes = [523.25, 659.25, 783.99];
    notes.forEach((freq, i) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + i * 0.08);
      
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.1, now + i * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.3);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 0.3);
    });
  }

  playFailure() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.linearRampToValueAtTime(90, now + 0.4);
    
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(now + 0.45);
  }

  playKick() {
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.12);
    
    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.15);
  }

  playCheer() {
    this.init();
    if (!this.ctx) return;
    const bufferSize = this.ctx.sampleRate * 1.5; // 1.5 seconds
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    
    // Generate white noise for crowd wash
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    const noiseNode = this.ctx.createBufferSource();
    noiseNode.buffer = buffer;
    
    // Lowpass filter to make noise sound more like a distant crowd cheering
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, this.ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(1400, this.ctx.currentTime + 0.3);
    filter.frequency.exponentialRampToValueAtTime(500, this.ctx.currentTime + 1.5);
    
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.12, this.ctx.currentTime + 0.25);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.5);
    
    noiseNode.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    
    noiseNode.start();
    noiseNode.stop(this.ctx.currentTime + 1.5);
  }
}

const sounds = new SoundEffects();

interface SportsArenaProps {
  sport: SportType;
  player: Player;
  question: VerbQuestion;
  onCompleted: (isCorrect: boolean, scoreGained: number, responseTimeMs: number) => void;
  onPreAnswerEffect?: () => void;
}

export function SportsArena({ sport, player, question, onCompleted, onPreAnswerEffect }: SportsArenaProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<'idle' | 'answering' | 'animating'>('answering');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(15);
  const [feedbackText, setFeedbackText] = useState<string>('');
  const [showHint, setShowHint] = useState<boolean>(false);
  
  const startTimeRef = useRef<number>(Date.now());
  const animationFrameRef = useRef<number | null>(null);
  const animationStartRef = useRef<number | null>(null);
  const animationDuration = 2500; // 2.5 seconds action sequencing

  // Track timer
  useEffect(() => {
    if (gameState !== 'answering') return;
    
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleAnswer(null, true); // Timed out
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState, question]);

  // Handle choice submission
  const handleAnswer = (option: string | null, isTimeout = false) => {
    if (gameState !== 'answering') return;
    
    const timeSpentMs = Date.now() - startTimeRef.current;
    const isAnsCorrect = option === question.correctAnswer;
    
    setSelectedOption(option);
    setIsCorrect(isAnsCorrect);
    setGameState('animating');
    animationStartRef.current = Date.now();

    if (onPreAnswerEffect) {
      onPreAnswerEffect();
    }

    if (isTimeout) {
      sounds.playFailure();
      setFeedbackText('Ժամանակն սպառվեց! (¡Tiempo agotado!)');
    } else if (isAnsCorrect) {
      sounds.playKick();
      setTimeout(() => {
        sounds.playSuccess();
        sounds.playCheer();
      }, 300);
      setFeedbackText('Ճիշտ է! (¡Correcto!): +100 միավոր');
    } else {
      sounds.playFailure();
      setFeedbackText(`Սխալ է! Ճիշտ պատասխանն էր՝ "${question.correctAnswer}"`);
    }

    // Dynamic points calculation with quick speed bonus
    const basePoints = isAnsCorrect ? 100 : 0;
    const speedBonus = isAnsCorrect ? Math.round((timeLeft / 15) * 50) : 0;
    const totalScore = basePoints + speedBonus;

    // Wait for the glorious 3D animation to complete before calling onCompleted
    setTimeout(() => {
      onCompleted(isAnsCorrect, totalScore, timeSpentMs);
      // Reset state for next round
      setSelectedOption(null);
      setIsCorrect(false);
      setTimeLeft(15);
      setFeedbackText('');
      setShowHint(false);
      setGameState('answering');
      startTimeRef.current = Date.now();
    }, animationDuration + 500);
  };

  // Play entry pitch whistle
  useEffect(() => {
    sounds.playWhistle();
    startTimeRef.current = Date.now();
  }, [question, sport]);

  // Main 3D Canvas Rendering Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = canvas.parentElement?.clientWidth || 640;
    let height = canvas.height = canvas.parentElement?.clientHeight || 400;

    // Handle Resize
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || 640;
      height = canvas.height = canvas.parentElement?.clientHeight || 400;
    };
    window.addEventListener('resize', handleResize);

    // Dynamic entities for the 6 sports
    let particles: {x: number, y: number, vx: number, vy: number, color: string, r: number, alpha: number}[] = [];
    const spawnConfetti = () => {
      for(let i=0; i<80; i++) {
        particles.push({
          x: width / 2,
          y: height / 2 - 50,
          vx: (Math.random() - 0.5) * 8,
          vy: (Math.random() - 0.8) * 8 - 2,
          color: `hsl(${Math.random() * 360}, 90%, 60%)`,
          r: Math.random() * 4 + 2,
          alpha: 1
        });
      }
    };

    // Keep animate loop running
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Track relative animation timestamp
      const now = Date.now();
      const t = animationStartRef.current ? Math.min(1, (now - animationStartRef.current) / animationDuration) : 0;
      const isAnim = gameState === 'animating';

      // Draw background sky & grass/court gradients
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height * 0.55);
      skyGrad.addColorStop(0, '#0f172a'); // deep dark slate
      skyGrad.addColorStop(1, '#1e293b');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height * 0.55);

      const fieldGrad = ctx.createLinearGradient(0, height * 0.55, 0, height);
      if (sport === 'tennis') {
        fieldGrad.addColorStop(0, '#0284c7'); // beautiful hardcourt blue
        fieldGrad.addColorStop(1, '#0c4a6e');
      } else if (sport === 'basketball') {
        fieldGrad.addColorStop(0, '#ea580c'); // wooden court orange
        fieldGrad.addColorStop(1, '#9a3412');
      } else {
        fieldGrad.addColorStop(0, '#166534'); // fresh stadium green
        fieldGrad.addColorStop(1, '#14532d');
      }
      ctx.fillStyle = fieldGrad;
      ctx.fillRect(0, height * 0.55, width, height * 0.45);

      // Add simple 3D grid/marker perspective lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 2;
      for (let i = -4; i <= 4; i++) {
        const xStart = width / 2 + (i * width * 0.08);
        const xEnd = width / 2 + (i * width * 0.3);
        ctx.beginPath();
        ctx.moveTo(xStart, height * 0.55);
        ctx.lineTo(xEnd, height);
        ctx.stroke();
      }

      // Track animations based on active sport
      if (sport === 'football') {
        // --- FOOTBALL (Penalty Shootout) ---
        // 3D Goal post
        const goalW = width * 0.4;
        const goalH = height * 0.3;
        const goalX = width / 2 - goalW / 2;
        const goalY = height * 0.25;

        // Draw Net
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.fillRect(goalX, goalY, goalW, goalH);
        
        ctx.beginPath();
        for (let gx = goalX; gx <= goalX + goalW; gx += 15) {
          ctx.moveTo(gx, goalY);
          ctx.lineTo(gx, goalY + goalH);
        }
        for (let gy = goalY; gy <= goalY + goalH; gy += 15) {
          ctx.moveTo(goalX, gy);
          ctx.lineTo(goalX + goalW, gy);
        }
        ctx.stroke();

        // Draw white frame posts
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 8;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(goalX, goalY + goalH);
        ctx.lineTo(goalX, goalY);
        ctx.lineTo(goalX + goalW, goalY);
        ctx.lineTo(goalX + goalW, goalY + goalH);
        ctx.stroke();

        // Goalkeeper movement
        let keeperX = width / 2;
        let keeperY = goalY + goalH - 30;
        let keeperDiveX = keeperX;
        let keeperDiveY = keeperY;

        if (isAnim) {
          if (isCorrect) {
            // Dive wrong direction
            const diveDir = selectedOption && selectedOption.length % 2 === 0 ? 1 : -1;
            keeperDiveX = keeperX - diveDir * (goalW * 0.35) * t;
            keeperDiveY = keeperY - 10 * Math.sin(t * Math.PI) + (goalH * 0.1) * t;
          } else {
            // Dive correct direction to save it!
            const diveDir = selectedOption && selectedOption.length % 2 === 0 ? -1 : 1;
            keeperDiveX = keeperX - diveDir * (goalW * 0.3) * t;
            keeperDiveY = keeperY - 25 * Math.sin(t * Math.PI) - (goalH * 0.1) * t;
          }
        } else {
          // Standing ready and oscillating gently
          keeperDiveX = keeperX + Math.sin(now * 0.005) * 15;
        }

        // Draw Goalkeeper (Armenian/Spanish styled Jersey)
        const jerseyColor = player.id === 1 ? '#d97706' : '#bfdbfe';
        ctx.fillStyle = jerseyColor;
        // Head
        ctx.beginPath();
        ctx.arc(keeperDiveX, keeperDiveY - 30, 10, 0, Math.PI * 2);
        ctx.fill();
        // Torso
        ctx.fillRect(keeperDiveX - 12, keeperDiveY - 20, 24, 25);
        // Arms
        ctx.strokeStyle = jerseyColor;
        ctx.lineWidth = 6;
        ctx.beginPath();
        if (isAnim) {
          ctx.moveTo(keeperDiveX - 12, keeperDiveY - 15);
          ctx.lineTo(keeperDiveX - 25, keeperDiveY - 30);
          ctx.moveTo(keeperDiveX + 12, keeperDiveY - 15);
          ctx.lineTo(keeperDiveX + 25, keeperDiveY - 30);
        } else {
          ctx.moveTo(keeperDiveX - 12, keeperDiveY - 10);
          ctx.lineTo(keeperDiveX - 25, keeperDiveY - 5);
          ctx.moveTo(keeperDiveX + 12, keeperDiveY - 10);
          ctx.lineTo(keeperDiveX + 25, keeperDiveY - 5);
        }
        ctx.stroke();
        // Shorts & Legs
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(keeperDiveX - 12, keeperDiveY + 5, 24, 8);
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(keeperDiveX - 10, keeperDiveY + 13, 6, 12);
        ctx.fillRect(keeperDiveX + 4, keeperDiveY + 13, 6, 12);

        // Ball movement
        let ballX = width / 2;
        let ballY = height * 0.85;
        let ballSize = 16;

        if (isAnim) {
          // Calculate destination target
          const targetX = width / 2 + (isCorrect ? (goalW * 0.35) * (selectedOption && selectedOption.length % 2 === 0 ? -1 : 1) : (goalW * 0.25) * (selectedOption && selectedOption.length % 2 === 0 ? -1 : 1));
          const targetY = goalY + goalH * (isCorrect ? 0.3 : 0.4);
          
          ballX = ballX + (targetX - ballX) * t;
          ballY = ballY + (targetY - ballY) * t;
          ballSize = 16 - (8 * t); // shrinks in distance
        }

        // Draw Football
        ctx.save();
        ctx.translate(ballX, ballY);
        if (isAnim) {
          ctx.rotate(t * Math.PI * 6);
        }
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(0, 0, ballSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = '#000000';
        ctx.stroke();
        // Inner pentagons/mesh pattern
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(0, 0, ballSize * 0.3, 0, Math.PI * 2);
        ctx.fill();
        for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 3) {
          ctx.beginPath();
          ctx.moveTo(Math.cos(angle) * ballSize * 0.3, Math.sin(angle) * ballSize * 0.3);
          ctx.lineTo(Math.cos(angle) * ballSize, Math.sin(angle) * ballSize);
          ctx.stroke();
        }
        ctx.restore();

        // 3D Shadow of the ball on pitch
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.ellipse(ballX, ballY + ballSize * 0.8, ballSize * 0.9, ballSize * 0.3, 0, 0, Math.PI * 2);
        ctx.fill();

      } else if (sport === 'basketball') {
        // --- BASKETBALL (3D Hoop Shot) ---
        // Draw Hoop frame at depth
        const backboardW = width * 0.25;
        const backboardH = height * 0.2;
        const bX = width / 2 - backboardW / 2;
        const bY = height * 0.15;

        // Draw Support Pole
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.moveTo(width / 2, bY + backboardH);
        ctx.lineTo(width / 2, height * 0.55);
        ctx.stroke();

        // Backboard
        ctx.strokeStyle = '#f97316';
        ctx.lineWidth = 4;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fillRect(bX, bY, backboardW, backboardH);
        ctx.strokeRect(bX, bY, backboardW, backboardH);
        
        // Inner shooter square
        ctx.strokeRect(bX + backboardW * 0.3, bY + backboardH * 0.4, backboardW * 0.4, backboardH * 0.5);

        // Orange rim (3D ellipse)
        const rimX = width / 2;
        const rimY = bY + backboardH * 0.82;
        const rimRX = 22;
        const rimRY = 7;

        ctx.strokeStyle = '#ea580c';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.ellipse(rimX, rimY, rimRX, rimRY, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Draw Net mesh hanging down
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 4) {
          const nx = rimX + Math.cos(angle) * rimRX;
          const ny = rimY + Math.sin(angle) * rimRY;
          ctx.moveTo(nx, ny);
          ctx.lineTo(rimX + Math.cos(angle) * rimRX * 0.7, rimY + 30);
        }
        ctx.stroke();

        let ballX = width / 2;
        let ballY = height * 0.85;
        let ballSize = 18;

        if (isAnim) {
          // Spline parabolic formula in pseudo-3D
          const peakY = height * 0.05; // peak of shot trajectory
          const targetX = rimX;
          const targetY = isCorrect ? rimY - 10 : rimY - 50; // missed goes wayward or hits backboard

          if (t < 0.7) {
            // First 70%: rising and traveling forward
            const subT = t / 0.7;
            ballX = ballX + (targetX - ballX) * subT;
            ballY = ballY + (peakY - ballY) * (1 - Math.pow(1 - subT, 2));
            ballSize = 18 - (8 * subT);
          } else {
            // Last 30%: falling into the net or bouncing off
            const subT = (t - 0.7) / 0.3;
            if (isCorrect) {
              ballX = targetX;
              ballY = peakY + (rimY - peakY) * (subT * subT);
              ballSize = 10;
            } else {
              // Bounce block off rim/board
              ballX = targetX + Math.sin(subT * Math.PI) * 40;
              ballY = peakY + (rimY + 50 - peakY) * subT;
              ballSize = 11;
            }
          }
        }

        // 3D ball shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.beginPath();
        ctx.ellipse(ballX, ballY + ballSize * 0.8, ballSize * 0.9, ballSize * 0.3, 0, 0, Math.PI * 2);
        ctx.fill();

        // Draw Basketball
        ctx.fillStyle = '#f97316';
        ctx.beginPath();
        ctx.arc(ballX, ballY, ballSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#431407';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        // Basketball lines
        ctx.beginPath();
        ctx.arc(ballX, ballY, ballSize, -Math.PI/3, Math.PI/3);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(ballX, ballY, ballSize, Math.PI * 2/3, Math.PI * 4/3);
        ctx.stroke();

      } else if (sport === 'archery') {
        // --- ARCHERY ---
        // Sway target continuously in idle mode
        const targetSpeed = 0.003;
        const swayWidth = width * 0.25;
        const targetX = width / 2 + Math.sin(now * targetSpeed) * swayWidth;
        const targetY = height * 0.28;
        const targetR = 45;

        // Draw target stand legs
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(targetX, targetY);
        ctx.lineTo(targetX - 25, height * 0.55);
        ctx.moveTo(targetX, targetY);
        ctx.lineTo(targetX + 25, height * 0.55);
        ctx.stroke();

        // Target Rings
        const colors = ['#f8fafc', '#0284c7', '#ef4444', '#facc15']; // outer white, blue, red, gold bullseye
        colors.forEach((col, idx) => {
          ctx.fillStyle = col;
          ctx.beginPath();
          ctx.arc(targetX, targetY, targetR * (1 - idx * 0.25), 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#000000';
          ctx.lineWidth = 0.7;
          ctx.stroke();
        });

        // Bow and Arrow at bottom
        let arrowX = width / 2;
        let arrowY = height * 0.8;
        let arrowLength = 70;
        let isShot = isAnim;

        if (isShot) {
          // Arrow travels towards target board
          const hitX = isCorrect ? targetX : targetX + 60; // Miss drifts
          const hitY = isCorrect ? targetY + (Math.random() - 0.5) * 15 : targetY + 45;
          
          arrowX = arrowX + (hitX - arrowX) * t;
          arrowY = arrowY + (hitY - arrowY) * t;
          arrowLength = 70 * (1 - 0.7 * t);
        }

        // Draw Bow (only when not animating/shot)
        if (!isShot) {
          ctx.strokeStyle = '#b45309';
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.arc(width / 2, height * 0.85, 50, 0.2, Math.PI - 0.2);
          ctx.stroke();

          // Bowstring
          ctx.strokeStyle = '#e2e8f0';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(width / 2 - 45, height * 0.85);
          ctx.lineTo(width / 2 + 45, height * 0.85);
          ctx.stroke();
        }

        // Draw Arrow
        ctx.save();
        ctx.translate(arrowX, arrowY);
        ctx.strokeStyle = '#f8fafc';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -arrowLength);
        ctx.stroke();
        
        // Arrow head (gold/red tip)
        ctx.fillStyle = '#ea580c';
        ctx.beginPath();
        ctx.moveTo(-4, -arrowLength);
        ctx.lineTo(4, -arrowLength);
        ctx.lineTo(0, -arrowLength - 8);
        ctx.closePath();
        ctx.fill();

        // Arrow Feathers
        ctx.strokeStyle = '#dc2626';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, -5);
        ctx.lineTo(-8, 5);
        ctx.moveTo(0, -5);
        ctx.lineTo(8, 5);
        ctx.stroke();
        ctx.restore();

      } else if (sport === 'tennis') {
        // --- TENNIS (3D Racket Strike) ---
        // Net
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        ctx.fillRect(width * 0.15, height * 0.55, width * 0.7, 8);
        
        ctx.strokeStyle = 'rgba(255,255,255,0.2)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let nx = width * 0.15; nx <= width * 0.85; nx += 10) {
          ctx.moveTo(nx, height * 0.55);
          ctx.lineTo(nx, height * 0.55 + 25);
        }
        ctx.stroke();

        // Opponent on other side
        const oppX = width / 2 + Math.sin(now * 0.003) * 60;
        const oppY = height * 0.48;
        ctx.fillStyle = '#ef4444';
        // head
        ctx.beginPath();
        ctx.arc(oppX, oppY - 15, 6, 0, Math.PI * 2);
        ctx.fill();
        // body
        ctx.fillRect(oppX - 8, oppY - 10, 16, 18);

        let ballX = width / 2 + Math.sin(now * 0.002) * 50;
        let ballY = height * 0.45;
        let ballRadius = 6;
        let scale = 1;

        if (isAnim) {
          // Ball travels forward to smash or miss
          if (t < 0.5) {
            // Ball comes high and deep from opponent
            const sT = t / 0.5;
            ballX = ballX + (width / 2 - 30 - ballX) * sT;
            ballY = ballY + (height * 0.75 - ballY) * sT;
            ballRadius = 6 + 18 * sT;
          } else {
            // Player smash returning ball back to court
            const sT = (t - 0.5) / 0.5;
            if (isCorrect) {
              const smashCornerX = width / 2 + (Math.random() > 0.5 ? 90 : -90);
              ballX = width / 2 - 30 + (smashCornerX - (width / 2 - 30)) * sT;
              ballY = height * 0.75 + (oppY - height * 0.75) * sT;
              ballRadius = 24 - 18 * sT;
            } else {
              // Ball rolls out behind player camera or hits net
              ballX = width / 2 - 30;
              ballY = height * 0.75 + 150 * sT;
              ballRadius = 24 + 10 * sT;
            }
          }
        }

        // 3D Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
        ctx.beginPath();
        ctx.ellipse(ballX, ballY + ballRadius * 0.9, ballRadius * 0.9, ballRadius * 0.3, 0, 0, Math.PI * 2);
        ctx.fill();

        // Yellow Tennis Ball
        ctx.fillStyle = '#ccff00';
        ctx.beginPath();
        ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#85cc00';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Racket visual overlay at smash point (t === 0.5)
        if (isAnim && t > 0.45 && t < 0.6) {
          ctx.strokeStyle = '#f43f5e';
          ctx.lineWidth = 12;
          ctx.beginPath();
          ctx.arc(width / 2 - 30, height * 0.72, 45, -0.5, Math.PI - 0.5);
          ctx.stroke();
        }

      } else if (sport === 'sprint') {
        // --- SPRINT (Running Track) ---
        // Athletics tracks lines
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.beginPath();
        // Lane dividing marker
        ctx.moveTo(width / 2, height * 0.55);
        ctx.lineTo(width / 2, height);
        ctx.stroke();

        let p1X = width * 0.35;
        let p2X = width * 0.65;
        
        let p1Y = height * 0.85;
        let p2Y = height * 0.85;

        // Animate running strides
        const stride1 = Math.sin(now * 0.02) * 12;
        const stride2 = Math.cos(now * 0.02) * 12;

        if (isAnim) {
          if (isCorrect) {
            p1Y = height * 0.85 - (height * 0.25) * t;
          } else {
            p2Y = height * 0.85 - (height * 0.25) * t;
          }
        }

        // Draw Player 1 Runner
        ctx.save();
        ctx.translate(p1X, p1Y);
        ctx.fillStyle = '#dc2626'; // Red Team
        ctx.beginPath();
        ctx.arc(0, -30, 8, 0, Math.PI*2);
        ctx.fill();
        ctx.fillRect(-8, -20, 16, 22);
        // Stride legs
        ctx.strokeStyle = '#dc2626';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(-4, 2);
        ctx.lineTo(-10 + stride1, 18);
        ctx.moveTo(4, 2);
        ctx.lineTo(10 + stride2, 18);
        ctx.stroke();
        ctx.restore();

        // Draw Player 2 Runner
        ctx.save();
        ctx.translate(p2X, p2Y);
        ctx.fillStyle = '#2563eb'; // Blue Team
        ctx.beginPath();
        ctx.arc(0, -30, 8, 0, Math.PI*2);
        ctx.fill();
        ctx.fillRect(-8, -20, 16, 22);
        // Stride legs
        ctx.strokeStyle = '#2563eb';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(-4, 2);
        ctx.lineTo(-10 + stride2, 18);
        ctx.moveTo(4, 2);
        ctx.lineTo(10 + stride1, 18);
        ctx.stroke();
        ctx.restore();

        // Finish line at top
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(width * 0.1, height * 0.6, width * 0.8, 4);

      } else if (sport === 'weightlifting') {
        // --- WEIGHTLIFTING (Power Clean) ---
        // Draw wood platform
        ctx.fillStyle = '#451a03';
        ctx.fillRect(width * 0.2, height * 0.8, width * 0.6, 20);

        let lifterY = height * 0.8;
        let barOffset = -20;

        if (isAnim) {
          if (isCorrect) {
            // Lift high is success
            lifterY = height * 0.8 - (height * 0.08) * t;
            barOffset = -20 - 45 * t;
          } else {
            // Fail and drop weights
            lifterY = height * 0.8;
            barOffset = -20 - 25 * Math.sin(t * Math.PI * 0.5) + (t > 0.6 ? 50 * (t - 0.6) : 0);
          }
        }

        const centerL = width / 2;

        // Draw Lifter character
        ctx.fillStyle = '#ea580c';
        ctx.beginPath();
        ctx.arc(centerL, lifterY - 45, 12, 0, Math.PI*2);
        ctx.fill();
        ctx.fillRect(centerL - 15, lifterY - 33, 30, 32);

        // Draw Barbell
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(centerL - 60, lifterY + barOffset);
        ctx.lineTo(centerL + 60, lifterY + barOffset);
        ctx.stroke();

        // Massive iron weight plates on edges
        const plateXLeft = centerL - 60;
        const plateXRight = centerL + 60;
        const plateY = lifterY + barOffset;

        ctx.fillStyle = '#1e293b';
        ctx.fillRect(plateXLeft - 10, plateY - 18, 10, 36);
        ctx.fillRect(plateXRight, plateY - 18, 10, 36);

        // Red collars
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(plateXLeft, plateY - 10, 3, 20);
        ctx.fillRect(plateXRight - 3, plateY - 10, 3, 20);

        // Success spotlights shining down
        if (isAnim && isCorrect) {
          ctx.fillStyle = 'rgba(250, 204, 21, 0.15)';
          ctx.beginPath();
          ctx.moveTo(width / 2, 0);
          ctx.lineTo(width / 2 - 120, height);
          ctx.lineTo(width / 2 + 120, height);
          ctx.closePath();
          ctx.fill();
        }
      }

      // Tick and draw general particles
      if (isCorrect && isAnim && particles.length === 0) {
        spawnConfetti();
      }

      particles.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.15; // gravity
        p.alpha -= 0.01;
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1.0; // reset
      particles = particles.filter(p => p.alpha > 0);

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [sport, gameState, isCorrect, selectedOption]);

  const getSportTitleArm = (s: SportType) => {
    switch (s) {
      case 'football': return 'Ֆուտբոլ (Penalty Shootout)';
      case 'basketball': return 'Բասկետբոլ';
      case 'archery': return 'Աղեղնաձգություն';
      case 'tennis': return 'Թենիս';
      case 'sprint': return 'Վազք (Sprint)';
      case 'weightlifting': return 'Ծանրամարտ (Weightlifting)';
    }
  };

  const currentCountryFlag = player.country === 'ARM' ? '🇦🇲' : '🇪🇸';

  return (
    <div id="sports-arena-main-box" className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-[#0f0f12]/90 text-white rounded-3xl p-6 border border-white/5 shadow-[0_30px_100px_rgba(0,0,0,0.8)] relative overflow-hidden backdrop-blur-xl">
      
      {/* Visual Arena Canvas column */}
      <div className="lg:col-span-8 flex flex-col space-y-3">
        <div className="flex justify-between items-center px-1">
          <div className="flex items-center space-x-3">
            <span className="text-3xl filter drop-shadow">{currentCountryFlag}</span>
            <div>
              <h2 className="text-base font-display font-bold tracking-tight text-white/95">{getSportTitleArm(sport)}</h2>
              <p className="text-xs text-zinc-500">Խաղացող՝ <strong className="text-amber-400 font-medium">{player.name}</strong></p>
            </div>
          </div>
          <div className="flex items-center space-x-4 bg-[#070709] px-4 py-2 rounded-xl border border-white/5 shadow-inner">
            <div className="flex items-center space-x-1.5">
              <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="text-xs font-mono text-amber-400 font-bold">{timeLeft}վ</span>
            </div>
            <div className="text-xs font-mono text-zinc-400">Միավորներ: <span className="text-white font-bold">{player.score}</span></div>
          </div>
        </div>

        {/* 3D Canvas wrapper */}
        <div className="relative w-full h-[320px] md:h-[400px] border border-white/5 rounded-2xl overflow-hidden bg-[#060608]">
          <canvas ref={canvasRef} className="w-full h-full block" />
          
          {/* Answer confirmation banners overlay */}
          {gameState === 'animating' && (
            <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center backdrop-blur-xs transition-all animate-fade-in">
              <div className={`p-6 rounded-2xl text-center max-w-sm border shadow-2xl scale-up-bounce ${
                isCorrect 
                  ? 'bg-emerald-500/90 border-emerald-400 text-white' 
                  : selectedOption === null 
                    ? 'bg-amber-500/90 border-amber-400 text-black'
                    : 'bg-red-500/95 border-red-400 text-white'
              }`}>
                <h3 className="text-xl font-display font-black tracking-wide uppercase mb-1">
                  {isCorrect ? 'ԳՈԼ / ՃԻՇՏ Է!' : 'ՍԽԱԼ Է'}
                </h3>
                <p className="text-xs md:text-sm font-medium">{feedbackText}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Grammar option selection & guidance panel */}
      <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
        <div className="bg-[#070709] p-5 rounded-2xl border border-white/5 h-full flex flex-col justify-between shadow-[inset_0_1px_10px_rgba(255,255,255,0.01)]">
          <div>
            <span className="text-[10px] font-mono px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 uppercase tracking-widest font-bold">
              {question.tenseNameArm}
            </span>
            
            {/* Main Verb translated clue */}
            <div className="mt-4 mb-2">
              <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono font-bold">Ինֆինիտիվ (Անորոշ դերբայ)</p>
              <div className="flex items-baseline space-x-2">
                <span className="text-xl font-display font-bold text-slate-200">{question.verbSpanish}</span>
                <span className="text-xs text-zinc-500">({question.verbArmenian})</span>
              </div>
            </div>

            {/* Armenian phrase to conjugate */}
            <div className="my-5 p-5 bg-[#0d0d10] border border-white/5 rounded-2xl relative overflow-hidden">
              <div className="absolute right-3 top-3 opacity-5">
                <HelpCircle className="w-12 h-12 text-zinc-400" />
              </div>
              <p className="text-[10px] text-amber-500/80 font-mono uppercase tracking-wider font-bold">Թարգմանիր անցյալ ձևը՝</p>
              <h1 className="text-2xl md:text-3xl font-display font-bold text-white tracking-tight mt-1">
                {question.armenianPhrase}
              </h1>
              <p className="text-xs text-zinc-400 mt-2">Դերանունը՝ <strong className="text-zinc-200">{question.pronounEsp}</strong> ({question.pronounArm})</p>
            </div>
          </div>

          {/* Core options box */}
          <div className="space-y-2 mt-2">
            {question.options.map((option, idx) => {
              const letter = ['A', 'B', 'C', 'D'][idx];
              const isChosen = selectedOption === option;
              
              let btnClass = "bg-[#101014] border-white/5 hover:border-amber-500/50 hover:bg-[#15151b] text-zinc-100 cursor-pointer shadow-sm";
              if (gameState === 'animating') {
                if (option === question.correctAnswer) {
                  btnClass = "bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-inner";
                } else if (isChosen) {
                  btnClass = "bg-red-500/20 border-red-500/40 text-red-300";
                } else {
                  btnClass = "bg-[#0d0d10]/50 border-white/5 text-zinc-650 cursor-not-allowed opacity-50";
                }
              }

              return (
                <button
                  key={option}
                  id={`option-btn-${letter}`}
                  disabled={gameState !== 'answering'}
                  onClick={() => handleAnswer(option)}
                  className={`w-full text-left py-3 px-4 rounded-xl border font-semibold text-xs md:text-sm flex items-center justify-between transition-all duration-200 transform active:scale-98 ${btnClass}`}
                >
                  <span className="flex items-center space-x-3">
                    <span className="text-[10px] font-mono bg-[#0c0c0f] px-2 py-0.5 rounded text-amber-400 border border-white/5">
                      {letter}
                    </span>
                    <span className="font-mono text-zinc-200">{option}</span>
                  </span>
                  {gameState === 'animating' && option === question.correctAnswer && (
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Bottom Hint section */}
          <div className="mt-5 pt-4 border-t border-white/5">
            <button
              id="hint-toggle-button"
              onClick={() => setShowHint(!showHint)}
              className="text-xs font-semibold text-amber-500/80 hover:text-amber-400 flex items-center space-x-1 focus:outline-none cursor-pointer"
            >
              <span>{showHint ? 'Թաքցնել հուշումը' : 'Ցուցադրել հուշումը (Mostrar pista)'}</span>
            </button>
            {showHint && (
              <p className="text-xs text-zinc-400 mt-2 leading-relaxed bg-[#0d0d10] p-3 rounded-xl border border-white/5">
                {question.hint}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
