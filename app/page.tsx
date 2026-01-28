'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Github, Linkedin, Mail, ExternalLink, Menu, X } from 'lucide-react';
import './portfolio.css';

// Tetris pieces and their rotations
const TETRIS_PIECES = [
  { shape: [[1,1,1,1]], color: 1, name: 'I' }, // Cyan
  { shape: [[1,1],[1,1]], color: 2, name: 'O' }, // Yellow
  { shape: [[0,1,0],[1,1,1]], color: 3, name: 'T' }, // Purple
  { shape: [[1,0,0],[1,1,1]], color: 4, name: 'L' }, // Orange
  { shape: [[0,0,1],[1,1,1]], color: 5, name: 'J' }, // Blue
  { shape: [[0,1,1],[1,1,0]], color: 6, name: 'S' }, // Green
  { shape: [[1,1,0],[0,1,1]], color: 7, name: 'Z' } // Red
];

const TETRIS_COLORS = [
  'transparent',
  '#00f0f0', // Cyan
  '#f0f000', // Yellow
  '#a000f0', // Purple
  '#f0a000', // Orange
  '#0000f0', // Blue
  '#00f000', // Green
  '#f00000'  // Red
];

// Transition Component
const SectionTransition = ({ variant = 'light' }: { variant?: 'light' | 'dark' }) => {
  const primaryColor = variant === 'light' ? '#7A1E35' : '#932841';
  const secondaryColor = variant === 'light' ? '#932841' : '#A86373';
  
  return (
    <div className="section-transition scroll-animate scroll-animate-fast">
      <div className="transition-wave-container">
        <svg className="transition-wave transition-wave-1" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,50 Q300,10 600,50 T1200,50 L1200,120 L0,120 Z" fill={primaryColor} />
        </svg>
        <svg className="transition-wave transition-wave-2" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,70 Q300,30 600,70 T1200,70 L1200,120 L0,120 Z" fill={secondaryColor} />
        </svg>
      </div>
      <div className="transition-particles">
        <div className="transition-particle" />
        <div className="transition-particle" />
        <div className="transition-particle" />
        <div className="transition-particle" />
        <div className="transition-particle" />
        <div className="transition-particle" />
      </div>
      <div className="transition-gradient-overlay" />
    </div>
  );
};


export default function Portfolio() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [scrollY, setScrollY] = useState(0);
  const [visibleSkills, setVisibleSkills] = useState<number[]>([]);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [showGame, setShowGame] = useState(false);
  const [showTetrisTag, setShowTetrisTag] = useState(false);
  
  // Tetris game state
  const BOARD_WIDTH = 10;
  const BOARD_HEIGHT = 20;
  const [tetrisBoard, setTetrisBoard] = useState<number[][]>([]);
  const [currentPiece, setCurrentPiece] = useState<{ shape: number[][]; x: number; y: number; color: number } | null>(null);
  const [nextPiece, setNextPiece] = useState<{ shape: number[][]; color: number } | null>(null);
  const [tetrisActive, setTetrisActive] = useState(false);
  const [tetrisScore, setTetrisScore] = useState(0);
  const [tetrisHighScore, setTetrisHighScore] = useState(0);
  const [tetrisLevel, setTetrisLevel] = useState(1);
  const [tetrisLines, setTetrisLines] = useState(0);
  const [tetrisGameOver, setTetrisGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [combo, setCombo] = useState(0);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; color: string }>>([]);
  const [showComboText, setShowComboText] = useState(false);
  const [celebrationLines, setCelebrationLines] = useState<number[]>([]);

  // Custom cursor movement
  useEffect(() => {
    // Force hide default cursor
    const hideCursor = () => {
      document.body.style.cursor = 'none';
      document.documentElement.style.cursor = 'none';
      // Force on all elements
      const allElements = document.querySelectorAll('*');
      allElements.forEach((el) => {
        if (el instanceof HTMLElement) {
          el.style.cursor = 'none';
        }
      });
    };
    
    hideCursor();
    
    // Continuously enforce cursor hiding
    const cursorInterval = setInterval(hideCursor, 100);
    
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
      // Re-hide cursor on every mouse move to prevent it from showing
      hideCursor();
    };

    const handleMouseOver = (e: MouseEvent) => {
      hideCursor();
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'BUTTON' || 
        target.tagName === 'A' || 
        target.closest('button') || 
        target.closest('a')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };
    
    const handleMouseEnter = () => {
      hideCursor();
    };
    
    const handleMouseLeave = () => {
      hideCursor();
    };

    // Hide cursor when mouse enters the window
    window.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.body.addEventListener('mouseenter', handleMouseEnter);
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      clearInterval(cursorInterval);
      window.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.body.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Show Tetris tag after 30 seconds
  useEffect(() => {
    const tagTimer = setTimeout(() => {
      setShowTetrisTag(true);
      // Auto-hide after 5 seconds
      setTimeout(() => {
        setShowTetrisTag(false);
      }, 5000);
    }, 30000); // 30 seconds

    return () => clearTimeout(tagTimer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      setScrolled(currentScrollY > 50);
      
      const sections = ['home', 'about', 'skills', 'projects'];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll animation effect - bidirectional
  useEffect(() => {
    const handleScrollAnimation = () => {
      const scrollElements = document.querySelectorAll('.scroll-animate');
      
      scrollElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        
        const scrolledToBottom = (window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 100;
        const isInViewport = (rect.top <= windowHeight * 0.9 && rect.bottom >= windowHeight * 0.1) || scrolledToBottom;
        
        if (isInViewport) {
          el.classList.add('scroll-visible');
        } else {
          el.classList.remove('scroll-visible');
        }
      });

      // Handle skill cards visibility
      const skillCards = document.querySelectorAll('.skill-card');
      const newVisibleSkills: number[] = [];
      
      skillCards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        
        if (rect.top <= windowHeight * 0.85) {
          newVisibleSkills.push(index);
        }
      });
      
      setVisibleSkills(newVisibleSkills);
    };

    
    handleScrollAnimation();
    window.addEventListener('scroll', handleScrollAnimation, { passive: true });
    const timer = setTimeout(handleScrollAnimation, 100);
    
    return () => {
      window.removeEventListener('scroll', handleScrollAnimation);
      clearTimeout(timer);
    };
  }, []);

  // Tetris helper functions
  const createEmptyBoard = useCallback(() => {
    return Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(0));
  }, [BOARD_WIDTH, BOARD_HEIGHT]);

  const getRandomPiece = useCallback(() => {
    const piece = TETRIS_PIECES[Math.floor(Math.random() * TETRIS_PIECES.length)];
    return {
      shape: piece.shape.map(row => [...row]),
      color: piece.color
    };
  }, []);

  const rotatePiece = (shape: number[][]) => {
    const rows = shape.length;
    const cols = shape[0].length;
    const rotated = Array(cols).fill(null).map(() => Array(rows).fill(0));
    
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        rotated[j][rows - 1 - i] = shape[i][j];
      }
    }
    return rotated;
  };

  const checkCollision = useCallback((piece: any, board: number[][], offsetX: number = 0, offsetY: number = 0) => {
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x]) {
          const newX = piece.x + x + offsetX;
          const newY = piece.y + y + offsetY;
          
          if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) {
            return true;
          }
          
          if (newY >= 0 && board[newY][newX]) {
            return true;
          }
        }
      }
    }
    return false;
  }, [BOARD_WIDTH, BOARD_HEIGHT]);

  const mergePieceToBoard = useCallback((piece: any, board: number[][]) => {
    const newBoard = board.map(row => [...row]);
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x]) {
          const boardY = piece.y + y;
          const boardX = piece.x + x;
          if (boardY >= 0) {
            newBoard[boardY][boardX] = piece.color;
          }
        }
      }
    }
    return newBoard;
  }, []);

  const clearLines = useCallback((board: number[][]) => {
    let linesCleared = 0;
    const newBoard = board.filter(row => {
      if (row.every(cell => cell !== 0)) {
        linesCleared++;
        return false;
      }
      return true;
    });
    
    while (newBoard.length < BOARD_HEIGHT) {
      newBoard.unshift(Array(BOARD_WIDTH).fill(0));
    }
    
    return { newBoard, linesCleared };
  }, [BOARD_HEIGHT, BOARD_WIDTH]);

  const createParticles = useCallback((y: number, count: number) => {
    const newParticles = Array.from({ length: count }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * BOARD_WIDTH,
      y: y,
      color: TETRIS_COLORS[Math.floor(Math.random() * (TETRIS_COLORS.length - 1)) + 1]
    }));
    setParticles(prev => [...prev, ...newParticles]);
    
    // Remove particles after animation
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
    }, 1000);
  }, [BOARD_WIDTH]);

  // Sound effect function
  const playSound = useCallback((type: 'clear' | 'combo' | 'tetris' | 'drop' | 'rotate') => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      switch(type) {
        case 'clear':
          oscillator.frequency.value = 440;
          gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.2);
          break;
        case 'combo':
          oscillator.frequency.value = 880;
          gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.3);
          break;
        case 'tetris':
          oscillator.frequency.value = 1200;
          gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.4);
          break;
        case 'drop':
          oscillator.type = 'square';
          oscillator.frequency.value = 100;
          gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.1);
          break;
        case 'rotate':
          oscillator.type = 'sine';
          oscillator.frequency.value = 300;
          gainNode.gain.setValueAtTime(0.03, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.05);
          break;
      }
    } catch (e) {
      // Silently fail if audio not supported
    }
  }, []);

  const startTetrisGame = useCallback(() => {
    const newBoard = createEmptyBoard();
    setTetrisBoard(newBoard);
    setTetrisScore(0);
    setTetrisLevel(1);
    setTetrisLines(0);
    setTetrisGameOver(false);
    setIsPaused(false);
    setCombo(0);
    setParticles([]);
    setShowComboText(false);
    setCelebrationLines([]);
    
    const firstPiece = getRandomPiece();
    const secondPiece = getRandomPiece();
    
    setCurrentPiece({
      ...firstPiece,
      x: Math.floor(BOARD_WIDTH / 2) - 1,
      y: 0
    });
    setNextPiece(secondPiece);
    setTetrisActive(true);
  }, [createEmptyBoard, getRandomPiece, BOARD_WIDTH]);

  const spawnNewPiece = useCallback(() => {
    if (!nextPiece) return;
    
    const newPiece = {
      ...nextPiece,
      x: Math.floor(BOARD_WIDTH / 2) - 1,
      y: 0
    };
    
    if (checkCollision(newPiece, tetrisBoard)) {
      setTetrisGameOver(true);
      setTetrisActive(false);
      if (tetrisScore > tetrisHighScore) {
        setTetrisHighScore(tetrisScore);
      }
      return;
    }
    
    setCurrentPiece(newPiece);
    setNextPiece(getRandomPiece());
  }, [nextPiece, tetrisBoard, tetrisScore, tetrisHighScore, checkCollision, getRandomPiece, BOARD_WIDTH]);

  // Game loop
  useEffect(() => {
    if (!tetrisActive || !currentPiece || tetrisGameOver || isPaused) return;

    const dropSpeed = Math.max(100, 1000 - (tetrisLevel - 1) * 100);
    const gameInterval = setInterval(() => {
      if (!checkCollision(currentPiece, tetrisBoard, 0, 1)) {
        setCurrentPiece(prev => prev ? { ...prev, y: prev.y + 1 } : null);
      } else {
        // Piece has landed
        const newBoard = mergePieceToBoard(currentPiece, tetrisBoard);
        const { newBoard: clearedBoard, linesCleared } = clearLines(newBoard);
        
        setTetrisBoard(clearedBoard);
        
        if (linesCleared > 0) {
          // Find which lines were cleared for celebration effect
          const clearedLineIndices: number[] = [];
          newBoard.forEach((row, i) => {
            if (row.every(cell => cell !== 0)) {
              clearedLineIndices.push(i);
            }
          });
          
          // Create particles at cleared lines
          clearedLineIndices.forEach(lineY => {
            createParticles(lineY, 15);
          });
          
          // Play sound effects based on lines cleared
          if (linesCleared === 4) {
            playSound('tetris');
          } else if (combo > 0) {
            playSound('combo');
          } else {
            playSound('clear');
          }
          
          // Update combo
          setCombo(prev => {
            const newCombo = prev + 1;
            if (newCombo > 1) {
              setShowComboText(true);
              setTimeout(() => setShowComboText(false), 1000);
            }
            return newCombo;
          });
          
          // Calculate score with combo multiplier
          const basePoints = [0, 100, 300, 500, 800][linesCleared];
          const comboBonus = combo > 0 ? combo * 50 : 0;
          const points = (basePoints + comboBonus) * tetrisLevel;
          
          setTetrisScore(prev => prev + points);
          setTetrisLines(prev => {
            const newLines = prev + linesCleared;
            setTetrisLevel(Math.floor(newLines / 10) + 1);
            return newLines;
          });
          
          // Show celebration lines briefly
          setCelebrationLines(clearedLineIndices);
          setTimeout(() => setCelebrationLines([]), 300);
        } else {
          // Reset combo if no lines cleared
          setCombo(0);
          playSound('drop');
        }
        
        spawnNewPiece();
      }
    }, dropSpeed);

    return () => clearInterval(gameInterval);
  }, [tetrisActive, currentPiece, tetrisBoard, tetrisGameOver, tetrisLevel, isPaused, combo, checkCollision, mergePieceToBoard, clearLines, spawnNewPiece, createParticles, playSound]);

  // Keyboard controls
  useEffect(() => {
    if (!tetrisActive || !currentPiece || tetrisGameOver) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'p' || e.key === 'P') {
        setIsPaused(prev => !prev);
        return;
      }
      
      if (isPaused) return;

      switch (e.key) {
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          if (!checkCollision(currentPiece, tetrisBoard, -1, 0)) {
            setCurrentPiece(prev => prev ? { ...prev, x: prev.x - 1 } : null);
          }
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          if (!checkCollision(currentPiece, tetrisBoard, 1, 0)) {
            setCurrentPiece(prev => prev ? { ...prev, x: prev.x + 1 } : null);
          }
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          if (!checkCollision(currentPiece, tetrisBoard, 0, 1)) {
            setCurrentPiece(prev => prev ? { ...prev, y: prev.y + 1 } : null);
            setTetrisScore(prev => prev + 1);
          }
          break;
        case 'ArrowUp':
        case 'w':
        case 'W':
        case ' ':
          e.preventDefault();
          const rotated = rotatePiece(currentPiece.shape);
          const rotatedPiece = { ...currentPiece, shape: rotated };
          if (!checkCollision(rotatedPiece, tetrisBoard, 0, 0)) {
            setCurrentPiece(rotatedPiece);
            playSound('rotate');
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [tetrisActive, currentPiece, tetrisBoard, tetrisGameOver, isPaused, checkCollision, playSound]);

  const closeGame = () => {
    setShowGame(false);
    setTetrisActive(false);
    setTetrisGameOver(false);
    setIsPaused(false);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  const handleExternalLink = (url: string, linkName: string) => {
    const confirmed = window.confirm(`You are about to leave this site and visit ${linkName}. Continue?`);
    if (confirmed) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  // Calculate individual transforms for staggered effect
  const getTransform = (delay: number) => {
    const adjustedScroll = Math.max(0, scrollY - delay);
    return Math.min(adjustedScroll * 1.5, 800);
  };
  
  const skills = [
    { category: 'Languages', items: ['JavaScript', 'TypeScript', 'Python', 'Java', 'C#', 'PHP', 'SQL'] },
    { category: 'Frontend', items: ['React', 'Next.js', 'Vue.js', 'Tailwind CSS', ] },
    { category: 'Backend', items: ['Node.js', 'PHP', 'PostgreSQL', 'REST APIs', 'ASP.NET'] },
    { category: 'Tools', items: ['Git', 'AWS', 'CI/CD', 'Agile', 'Junit', 'Playwright'] }
  ];

  const projects = [
    {
      title: 'TaskFlow – Personal Task Management App',
      description: 'TaskFlow is a responsive task management web application built with React.js, allowing users to organize tasks with color-coded labels and persistent local storage.',
      tech: ['React.js', 'JavaScript', 'CSS', 'Browser Local Storage', 'React Hooks'],
      link: 'https://taskflow2-taskmanager.netlify.app/'
    },
    /*{
      title: 'AI-Powered Analytics Dashboard',
      description: 'Data visualization platform utilizing machine learning for predictive analytics.',
      tech: ['React', 'Python', 'TensorFlow', 'D3.js'],
      link: '#'
    },
    {
      title: 'Real-Time Collaboration Tool',
      description: 'Web application enabling seamless team collaboration with WebSocket technology.',
      tech: ['Vue.js', 'Socket.io', 'Express', 'MongoDB'],
      link: '#'
    }*/
  ];

  // Render the Tetris board with current piece
  const renderTetrisBoard = () => {
    const displayBoard = tetrisBoard.map(row => [...row]);
    
    if (currentPiece && !tetrisGameOver) {
      for (let y = 0; y < currentPiece.shape.length; y++) {
        for (let x = 0; x < currentPiece.shape[y].length; x++) {
          if (currentPiece.shape[y][x]) {
            const boardY = currentPiece.y + y;
            const boardX = currentPiece.x + x;
            if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
              displayBoard[boardY][boardX] = currentPiece.color;
            }
          }
        }
      }
    }
    
    return displayBoard;
  };

  const renderNextPiece = () => {
    if (!nextPiece) return null;
    const maxSize = 4;
    const grid = Array(maxSize).fill(null).map(() => Array(maxSize).fill(0));
    
    const offsetY = Math.floor((maxSize - nextPiece.shape.length) / 2);
    const offsetX = Math.floor((maxSize - nextPiece.shape[0].length) / 2);
    
    for (let y = 0; y < nextPiece.shape.length; y++) {
      for (let x = 0; x < nextPiece.shape[y].length; x++) {
        if (nextPiece.shape[y][x]) {
          grid[y + offsetY][x + offsetX] = nextPiece.color;
        }
      }
    }
    
    return grid;
  };

  return (
    <>
      {/* Force hide cursor immediately */}
      <style dangerouslySetInnerHTML={{__html: `
        * { cursor: none !important; }
        html { cursor: none !important; }
        body { cursor: none !important; }
      `}} />
      
      {/* Custom Cursor */}
      <div 
        className="custom-cursor"
        style={{
          left: `${cursorPos.x}px`,
          top: `${cursorPos.y}px`,
          transform: isHovering ? 'translate(-50%, -50%) scale(1.2)' : 'translate(-50%, -50%) scale(1)',
          zIndex: 99999,
        }}
      >
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Prominent taupe border */}
          <path 
            d="M5 5L12.57 23.47L15.29 15.29L23.47 12.57L5 5Z" 
            fill="none"
            stroke="#A89F91"
            strokeWidth="4.5"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          {/* Inner cursor */}
          <path 
            d="M5 5L12.57 23.47L15.29 15.29L23.47 12.57L5 5Z" 
            fill="#7A1E35"
            stroke="#932841"
            strokeWidth="1.8"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Mini Game Floating Button */}
      <button
        onClick={() => {
          setShowGame(true);
          setShowTetrisTag(false);
        }}
        className="game-button"
        title="Play Tetris"
      >
        🎮
        {showTetrisTag && (
          <div className="tetris-tag">
            Play Tetris!
            <div className="tetris-tag-arrow"></div>
          </div>
        )}
      </button>

      {/* Tetris Game Modal */}
      {showGame && (
        <div className="game-modal-overlay" onClick={closeGame}>
          <div className="game-modal tetris-modal" onClick={(e) => e.stopPropagation()}>
            <button className="game-close" onClick={closeGame}>×</button>
            
            <h2 className="game-title">🎮 TETRIS 🎮</h2>
            
            {!tetrisActive && !tetrisGameOver ? (
              <div className="game-start-screen">
                <div className="game-instructions-detailed">
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--color-indigo-600)', fontWeight: 700 }}>
                    How to Play
                  </h3>
                  <div style={{ textAlign: 'left', maxWidth: '500px', margin: '0 auto', fontSize: '1rem' }}>
                    <p style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontSize: '1.75rem' }}>⬅️➡️</span>
                      <span><strong>Arrow Keys</strong> or <strong>A/D</strong> - Move left/right</span>
                    </p>
                    <p style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontSize: '1.75rem' }}>⬆️</span>
                      <span><strong>Arrow Up</strong>, <strong>W</strong>, or <strong>Space</strong> - Rotate piece</span>
                    </p>
                    <p style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontSize: '1.75rem' }}>⬇️</span>
                      <span><strong>Arrow Down</strong> or <strong>S</strong> - Soft drop (+1 point)</span>
                    </p>
                    <p style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontSize: '1.75rem' }}>⏸️</span>
                      <span><strong>P</strong> - Pause/Resume game</span>
                    </p>
                    <p style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontSize: '1.75rem' }}>✨</span>
                      <span>Clear lines to score points and level up!</span>
                    </p>
                    <p style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontSize: '1.75rem' }}>🔥</span>
                      <span><strong>COMBO SYSTEM:</strong> Clear lines consecutively for bonus points!</span>
                    </p>
                    <p style={{ marginBottom: '0', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--color-purple-600)', fontWeight: 600 }}>
                      <span style={{ fontSize: '1.75rem' }}>🎯</span>
                      <span>1 line = 100 pts | 2 = 300 | 3 = 500 | 4 = 800</span>
                    </p>
                  </div>
                </div>
                <button onClick={startTetrisGame} className="game-start-btn" style={{ marginTop: '2rem' }}>
                  Start Game
                </button>
              </div>
            ) : (
              <div className="tetris-game-container">
                <div className="tetris-side-panel">
                  <div className="tetris-info-box">
                    <h4 className="tetris-info-title">Score</h4>
                    <p className="tetris-info-value">{tetrisScore}</p>
                  </div>
                  
                  <div className="tetris-info-box">
                    <h4 className="tetris-info-title">Level</h4>
                    <p className="tetris-info-value">{tetrisLevel}</p>
                  </div>
                  
                  <div className="tetris-info-box">
                    <h4 className="tetris-info-title">Lines</h4>
                    <p className="tetris-info-value">{tetrisLines}</p>
                  </div>
                  
                  {combo > 0 && (
                    <div className="tetris-info-box tetris-combo-box">
                      <h4 className="tetris-info-title">Combo</h4>
                      <p className="tetris-info-value" style={{ color: '#f0a000' }}>
                        {combo}x 🔥
                      </p>
                    </div>
                  )}
                  
                  <div className="tetris-info-box">
                    <h4 className="tetris-info-title">High Score</h4>
                    <p className="tetris-info-value" style={{ color: 'var(--color-purple-600)' }}>
                      {tetrisHighScore}
                    </p>
                  </div>
                  
                  <div className="tetris-next-box">
                    <h4 className="tetris-info-title">Next</h4>
                    <div className="tetris-next-piece">
                      {renderNextPiece()?.map((row, y) => (
                        <div key={y} className="tetris-next-row">
                          {row.map((cell, x) => (
                            <div
                              key={`${x}-${y}`}
                              className="tetris-next-cell"
                              style={{
                                background: cell ? TETRIS_COLORS[cell] : 'transparent',
                                border: cell ? '2px solid rgba(0,0,0,0.3)' : 'none'
                              }}
                            />
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="tetris-board-container">
                  {showComboText && (
                    <div className="tetris-combo-popup">
                      <span className="tetris-combo-text">COMBO x{combo}!</span>
                      <span className="tetris-combo-bonus">+{combo * 50} BONUS</span>
                    </div>
                  )}
                  
                  {/* Particles */}
                  {particles.map(particle => (
                    <div
                      key={particle.id}
                      className="tetris-particle"
                      style={{
                        left: `${particle.x * 25 + 4}px`,
                        top: `${particle.y * 25 + 4}px`,
                        background: particle.color,
                        '--random-x': Math.random(),
                        '--random-y': Math.random(),
                      } as React.CSSProperties}
                    />
                  ))}
                  
                  <div className="tetris-board">
                    {renderTetrisBoard().map((row, y) => (
                      <div key={y} className="tetris-row">
                        {row.map((cell, x) => (
                          <div
                            key={`${x}-${y}`}
                            className={`tetris-cell ${celebrationLines.includes(y) ? 'tetris-cell-celebrating' : ''}`}
                            style={{
                              background: cell ? TETRIS_COLORS[cell] : 'rgba(30, 30, 50, 0.3)',
                              border: cell ? '2px solid rgba(0,0,0,0.3)' : '1px solid rgba(255,255,255,0.1)',
                              boxShadow: cell ? 'inset 2px 2px 4px rgba(255,255,255,0.3), inset -2px -2px 4px rgba(0,0,0,0.3)' : 'none'
                            }}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                  
                  {isPaused && (
                    <div className="tetris-pause-overlay">
                      <div className="tetris-pause-content">
                        <h3 className="tetris-pause-title">PAUSED</h3>
                        <p className="tetris-pause-text">Press P to resume</p>
                      </div>
                    </div>
                  )}
                  
                  {tetrisGameOver && (
                    <div className="game-over-overlay">
                      <div className="game-over-content">
                        <h3 className="game-over-title">Game Over!</h3>
                        <p className="game-over-score">Final Score: {tetrisScore}</p>
                        <p className="game-over-score">Level: {tetrisLevel}</p>
                        <p className="game-over-score">Lines: {tetrisLines}</p>
                        {tetrisScore === tetrisHighScore && tetrisScore > 0 && (
                          <p className="game-over-highscore">🎉 New High Score!</p>
                        )}
                        <button onClick={startTetrisGame} className="play-again-btn">
                          Play Again
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx global>{`
        *, *::before, *::after {
          cursor: none !important;
        }

        html {
          cursor: none !important;
        }

        body {
          cursor: none !important;
        }

        html *, body * {
          cursor: none !important;
        }

        a, button, input, select, textarea, label, 
        [role="button"], [tabindex], div, span, p, h1, h2, h3, h4, h5, h6,
        img, svg, canvas, video {
          cursor: none !important;
        }

        input:focus, textarea:focus, select:focus, button:focus {
          cursor: none !important;
        }

        a:hover, button:hover, [role="button"]:hover {
          cursor: none !important;
        }
      `}</style>

      <style jsx>{`
        body {
          cursor: none !important;
        }
        
        .custom-cursor {
          position: fixed;
          pointer-events: none;
          z-index: 99999;
          filter: drop-shadow(0 3px 6px rgba(168, 159, 145, 0.5)) drop-shadow(0 2px 4px rgba(122, 30, 53, 0.3));
          will-change: transform;
        }

        .custom-cursor svg {
          transition: transform 0.15s cubic-bezier(0.4, 0, 0.2, 1);
          filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
        }

        .custom-cursor svg path {
          stroke-linejoin: round;
          stroke-linecap: round;
        }

        .social-link {
          border-radius: 50% !important;
        }

        /* Mini Game Styles */
        .game-button {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--color-indigo-600), var(--color-purple-600));
          border: 3px solid var(--color-white);
          font-size: 1.5rem;
          cursor: pointer;
          z-index: 1000;
          box-shadow: 0 4px 12px rgba(122, 30, 53, 0.4);
          transition: all 0.3s ease;
          animation: pulse 2s ease-in-out infinite;
        }

        .game-button:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 20px rgba(147, 40, 65, 0.6);
        }

        .tetris-tag {
          position: absolute;
          bottom: 75px;
          right: 0;
          background: linear-gradient(135deg, var(--color-indigo-600), var(--color-purple-600));
          color: white;
          padding: 0.75rem 1.25rem;
          border-radius: 0.75rem;
          font-size: 1rem;
          font-weight: 700;
          white-space: nowrap;
          box-shadow: 0 4px 12px rgba(122, 30, 53, 0.4);
          animation: tetrisTagBounce 0.5s ease-out, tetrisTagFloat 2s ease-in-out infinite;
          z-index: 1001;
          letter-spacing: 0.05em;
          border: 2px solid rgba(255, 255, 255, 0.2);
        }

        .tetris-tag-arrow {
          position: absolute;
          bottom: -8px;
          right: 20px;
          width: 0;
          height: 0;
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          border-top: 8px solid var(--color-purple-600);
        }

        @keyframes tetrisTagBounce {
          0% {
            transform: translateY(20px);
            opacity: 0;
          }
          50% {
            transform: translateY(-10px);
            opacity: 1;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes tetrisTagFloat {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        .game-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.85);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          backdrop-filter: blur(4px);
        }

        .game-modal {
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          border-radius: 1.5rem;
          padding: 2rem;
          max-width: 900px;
          width: 95%;
          max-height: 95vh;
          overflow-y: auto;
          position: relative;
          box-shadow: 0 20px 60px rgba(122, 30, 53, 0.5), 0 0 0 1px rgba(168, 99, 115, 0.3);
          border: 3px solid var(--color-indigo-600);
        }

        .tetris-modal {
          max-width: 1000px;
        }

        .game-close {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: rgba(255, 255, 255, 0.1);
          border: 2px solid var(--color-indigo-400);
          border-radius: 50%;
          font-size: 2rem;
          color: var(--color-white);
          cursor: pointer;
          width: 45px;
          height: 45px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          z-index: 10;
        }

        .game-close:hover {
          background: var(--color-purple-600);
          transform: rotate(90deg);
          border-color: var(--color-purple-400);
        }

        .game-title {
          font-size: 2.5rem;
          font-weight: 700;
          text-align: center;
          margin-bottom: 2rem;
          background: linear-gradient(to right, #00f0f0, #f0f000, #a000f0, #f0a000);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          text-shadow: 0 0 30px rgba(0, 240, 240, 0.5);
          letter-spacing: 0.2em;
        }

        .game-start-screen {
          text-align: center;
          padding: 2rem 0;
        }

        .game-instructions-detailed {
          text-align: center;
          padding: 2rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 1rem;
          border: 2px solid rgba(168, 99, 115, 0.3);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(10px);
          color: white;
        }

        .game-start-btn {
          padding: 1rem 3rem;
          background: linear-gradient(to right, var(--color-indigo-600), var(--color-purple-600));
          color: white;
          border: none;
          border-radius: 0.75rem;
          font-size: 1.25rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 4px 12px rgba(122, 30, 53, 0.3);
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .game-start-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 24px rgba(147, 40, 65, 0.5);
        }

        /* Tetris Specific Styles */
        .tetris-game-container {
          display: flex;
          gap: 2rem;
          justify-content: center;
          align-items: flex-start;
        }

        .tetris-side-panel {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          min-width: 160px;
        }

        .tetris-info-box {
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid rgba(168, 99, 115, 0.3);
          border-radius: 0.5rem;
          padding: 0.5rem 0.75rem;
          text-align: center;
          backdrop-filter: blur(10px);
        }

        .tetris-info-title {
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.6);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.25rem;
          font-weight: 600;
        }

        .tetris-info-value {
          font-size: 1.5rem;
          color: var(--color-indigo-400);
          font-weight: 700;
          text-shadow: 0 0 20px rgba(99, 102, 241, 0.6);
        }

        .tetris-next-box {
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid rgba(168, 99, 115, 0.3);
          border-radius: 0.5rem;
          padding: 0.5rem 0.75rem;
          text-align: center;
          backdrop-filter: blur(10px);
        }

        .tetris-next-piece {
          margin-top: 0.5rem;
          display: inline-block;
        }

        .tetris-next-row {
          display: flex;
        }

        .tetris-next-cell {
          width: 18px;
          height: 18px;
          border-radius: 2px;
        }

        .tetris-board-container {
          position: relative;
          display: inline-block;
        }

        .tetris-board {
          background: linear-gradient(135deg, rgba(10, 10, 30, 0.9), rgba(20, 20, 40, 0.9));
          border: 4px solid var(--color-indigo-600);
          border-radius: 0.5rem;
          padding: 4px;
          box-shadow: 
            0 0 30px rgba(99, 102, 241, 0.3),
            inset 0 0 50px rgba(0, 0, 0, 0.5);
        }

        .tetris-row {
          display: flex;
        }

        .tetris-cell {
          width: 25px;
          height: 25px;
          border-radius: 2px;
          transition: all 0.1s ease;
        }

        .tetris-cell-celebrating {
          animation: cellFlash 0.3s ease-in-out;
        }

        @keyframes cellFlash {
          0%, 100% {
            filter: brightness(1);
          }
          50% {
            filter: brightness(2) saturate(1.5);
            transform: scale(1.05);
          }
        }

        .tetris-combo-box {
          background: linear-gradient(135deg, rgba(240, 160, 0, 0.2), rgba(240, 160, 0, 0.1));
          border-color: rgba(240, 160, 0, 0.5);
          animation: comboGlow 0.5s ease-in-out infinite alternate;
        }

        @keyframes comboGlow {
          from {
            box-shadow: 0 0 10px rgba(240, 160, 0, 0.3);
          }
          to {
            box-shadow: 0 0 20px rgba(240, 160, 0, 0.6);
          }
        }

        .tetris-combo-popup {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 100;
          text-align: center;
          animation: comboPopup 1s ease-out forwards;
          pointer-events: none;
        }

        .tetris-combo-text {
          display: block;
          font-size: 3rem;
          font-weight: 900;
          color: #f0a000;
          text-shadow: 
            0 0 10px rgba(240, 160, 0, 0.8),
            0 0 20px rgba(240, 160, 0, 0.6),
            0 0 30px rgba(240, 160, 0, 0.4),
            2px 2px 0 rgba(0, 0, 0, 0.5);
          letter-spacing: 0.1em;
        }

        .tetris-combo-bonus {
          display: block;
          font-size: 1.5rem;
          font-weight: 700;
          color: #00f0f0;
          text-shadow: 
            0 0 10px rgba(0, 240, 240, 0.8),
            0 0 20px rgba(0, 240, 240, 0.6);
          margin-top: 0.5rem;
        }

        @keyframes comboPopup {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.5);
          }
          20% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.2);
          }
          80% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -60%) scale(0.8);
          }
        }

        .tetris-particle {
          position: absolute;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          pointer-events: none;
          animation: particleFloat 1s ease-out forwards;
          z-index: 50;
          box-shadow: 0 0 10px currentColor;
        }

        @keyframes particleFloat {
          0% {
            opacity: 1;
            transform: translate(0, 0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(
              calc((var(--random-x, 0.5) - 0.5) * 200px),
              calc((var(--random-y, 0.5) - 0.5) * 200px)
            ) scale(0);
          }
        }

        .tetris-pause-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 0.5rem;
          backdrop-filter: blur(4px);
        }

        .tetris-pause-content {
          text-align: center;
        }

        .tetris-pause-title {
          font-size: 3rem;
          font-weight: 700;
          color: white;
          margin-bottom: 1rem;
          text-shadow: 0 0 20px rgba(99, 102, 241, 0.8);
          letter-spacing: 0.2em;
        }

        .tetris-pause-text {
          font-size: 1.25rem;
          color: rgba(255, 255, 255, 0.8);
        }

        .game-over-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 0.5rem;
          animation: fadeIn 0.3s ease;
          backdrop-filter: blur(8px);
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .game-over-content {
          text-align: center;
          padding: 2.5rem;
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(168, 85, 247, 0.2));
          border-radius: 1rem;
          border: 3px solid var(--color-indigo-500);
          box-shadow: 0 0 40px rgba(99, 102, 241, 0.4);
        }

        .game-over-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: white;
          margin-bottom: 1.5rem;
          text-shadow: 0 0 20px rgba(239, 68, 68, 0.8);
          letter-spacing: 0.1em;
        }

        .game-over-score {
          font-size: 1.25rem;
          color: white;
          margin-bottom: 0.75rem;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
        }

        .game-over-highscore {
          font-size: 1.25rem;
          color: var(--color-purple-400);
          font-weight: 600;
          margin-bottom: 2rem;
          text-shadow: 0 0 15px rgba(168, 85, 247, 0.8);
        }

        .play-again-btn {
          padding: 0.75rem 2.5rem;
          background: linear-gradient(to right, var(--color-indigo-600), var(--color-purple-600));
          color: white;
          border: 2px solid var(--color-indigo-400);
          border-radius: 0.75rem;
          font-size: 1.125rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 4px 12px rgba(122, 30, 53, 0.4);
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .play-again-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 24px rgba(147, 40, 65, 0.6);
        }

        @media (max-width: 768px) {
          .custom-cursor {
            display: none;
          }
          * {
            cursor: auto !important;
          }
          
          .tetris-game-container {
            flex-direction: column;
            align-items: center;
          }
          
          .tetris-side-panel {
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: center;
            width: 100%;
          }
          
          .tetris-info-box, .tetris-next-box {
            flex: 1;
            min-width: 120px;
          }
          
          .tetris-cell {
            width: 20px;
            height: 20px;
          }

          .game-title {
            font-size: 1.75rem;
          }
        }

        /* Orb Animations */
        .hero-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          opacity: 1;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
          animation-direction: alternate;
        }

        .hero-orb-1 {
          width: 612px;
          height: 612px;
          background: radial-gradient(circle, rgba(147, 40, 65, 0.873), rgba(168, 99, 115, 0.582), transparent);
          top: -300px;
          left: -300px;
          animation: float-orb-1 8s ease-in-out infinite;
        }

        .hero-orb-2 {
          width: 561px;
          height: 561px;
          background: radial-gradient(circle, rgba(168, 99, 115, 0.8245), rgba(147, 40, 65, 0.485), transparent);
          bottom: -275px;
          right: -275px;
          animation: float-orb-2 10s ease-in-out infinite;
        }

        @keyframes float-orb-1 {
          0% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(40px, 40px) scale(1.08);
          }
          100% {
            transform: translate(0, 0) scale(1);
          }
        }

        @keyframes float-orb-2 {
          0% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(-40px, -40px) scale(1.12);
          }
          100% {
            transform: translate(0, 0) scale(1);
          }
        }

        /* Footer Orbs */
        .footer {
          position: relative;
          overflow: hidden;
        }

        .footer-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          opacity: 1;
          pointer-events: none;
        }

        .footer-orb-1 {
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(147, 40, 65, 0.873), rgba(168, 99, 115, 0.582), transparent);
          top: -300px;
          left: -300px;
          animation: float-orb-footer-1 12s ease-in-out infinite;
        }

        .footer-orb-2 {
          width: 550px;
          height: 550px;
          background: radial-gradient(circle, rgba(168, 99, 115, 0.8245), rgba(147, 40, 65, 0.485), transparent);
          bottom: -275px;
          right: -275px;
          animation: float-orb-footer-2 14s ease-in-out infinite;
        }

        @keyframes float-orb-footer-1 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(40px, 40px) scale(1.08);
          }
        }

        @keyframes float-orb-footer-2 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(-40px, -40px) scale(1.12);
          }
        }
      `}</style>

      <div className="portfolio-container">
        <nav className={`portfolio-nav ${scrolled ? 'scrolled' : ''}`} role="navigation">
          <div className="nav-content">
            <div className="nav-inner">
              <button onClick={() => scrollToSection('home')} className="nav-logo">
                {scrolled ? 'MECHELLE JOE ANAND' : 'PORTFOLIO'}
              </button>
              
              <div className="nav-desktop">
                {['home', 'about', 'skills', 'projects', 'contact'].map((item) => (
                  <button key={item} onClick={() => scrollToSection(item)} className={`nav-link ${activeSection === item ? 'active' : ''}`}>
                    {item}<span className="nav-link-underline" />
                  </button>
                ))}
              </div>

              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="nav-mobile-toggle">
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

            {isMenuOpen && (
              <div className="nav-mobile">
                {['home', 'about', 'skills', 'projects'].map((item) => (
                  <button key={item} onClick={() => scrollToSection(item)} className="nav-mobile-link">{item}</button>
                ))}
              </div>
            )}
          </div>
        </nav>

        <section id="home" className="hero-section">
          <div className="hero-bg">
            <div className="hero-orb hero-orb-1"></div>
            <div className="hero-orb hero-orb-2"></div>
          </div>
          
          <div className="hero-content">
            <div 
              className="hero-text-wrapper"
              style={{ 
                transform: `translateY(-${getTransform(0)}px)`,
                transition: 'transform 0.05s ease-out'
              }}
            >
              <h1 className="hero-title">MECHELLE JOE ANAND</h1>
            </div>
            
            <div 
              className="hero-text-wrapper"
              style={{ 
                transform: `translateY(-${getTransform(50)}px)`,
                transition: 'transform 0.05s ease-out'
              }}
            >
              <p className="hero-subtitle">SOFTWARE DEVELOPER</p>
            </div>
            
            <div 
              className="hero-text-wrapper"
              style={{ 
                transform: `translateY(-${getTransform(100)}px)`,
                transition: 'transform 0.05s ease-out'
              }}
            >
              <p className="hero-description">Crafting clean solutions through modern technology and timeless design principles</p>
            </div>
            
            <div 
              className="hero-cta"
              style={{ 
                transform: `translateY(-${getTransform(150)}px)`,
                transition: 'transform 0.05s ease-out'
              }}
            >
              <button onClick={() => scrollToSection('projects')} className="hero-button">
                View My Implementations<span className="hero-button-arrow">→</span>
              </button>
            </div>
          </div>
        </section>

        <SectionTransition variant="light" />

        <section id="about" className="about-section scroll-animate">
          <div className="section-container">
            <h2 className="section-title scroll-animate">About Me</h2>

            <div className="about-grid">
              <div className="about-left-column">
                <div className="profile-image-container">
                  <div className="profile-image-wrapper scroll-animate">
                    <img src="/profile.jpg" alt="Mechelle Joe Anand" className="profile-image" />
                    <div className="profile-image-overlay"></div>
                  </div>
                </div>
                
                <p className="scroll-animate">As a Software Developer driven by curiosity and a relentless pursuit of excellence, I approach every project as both a craft and a challenge. I see software development as a disciplined art, where elegant architecture meets innovative solutions to solve real-world problems.</p>
                <p className="scroll-animate">I combine deep technical expertise with a keen sense of design, ensuring that every system I build is robust, maintainable, and straightforward. To me, great software is timeless: it is resilient, scalable, and thoughtfully constructed, yet adaptable to the ever-evolving demands of technology.</p>
                <p className="scroll-animate">I am passionate about creating solutions that are both powerful and meaningful, blending classical principles of structure and logic with the possibilities of modern innovation. <span className="deco">Every line of code I write reflects this vision — a commitment to quality, creativity, and enduring impact.</span></p>
              </div>

              <div className="education-card scroll-animate">
                <h3 className="education-title">Education</h3>
                <p className="education-degree">Diploma in Software Support</p>
                <p className="education-details">Mohawk College • Jan 2024 - Dec 2025</p>
                <p className="education-coursework">Software Development • IT Support • System Administration</p>

                <br />

                <h3 className="education-title">Certifications</h3>
                <p className="education-degree">Data Analysis with Python</p>
                <p className="education-details">IBM • 2024</p>
                <button onClick={() => handleExternalLink('https://courses.cognitiveclass.ai/certificates/7d8f399f612c44319827ac136953558e', 'IBM Credential')} className="education-link">
                  View Credential<span className="button-arrow">→</span>
                </button>

                <p className="education-degree">Applied Machine Learning</p>
                <p className="education-details">LinkedIn • 2025</p>
                <button onClick={() => handleExternalLink('https://www.linkedin.com/learning/certificates/d05d6ca5b54fe68a3747875fdafe48a0e32f0cadc0884060cdd439fca115eb83?trk=share_certificate', 'LinkedIn Credential')} className="education-link">
                  View Credential<span className="button-arrow">→</span>
                </button>

                <p className="education-degree">Node.js Essential Training</p>
                <p className="education-details">LinkedIn • 2026</p>
                <button onClick={() => handleExternalLink('https://www.linkedin.com/learning/certificates/32238d03e4671bd6cf1ed4d7ca0f30b9b0b495f01bfb486a20c6234c3c2ae545?u=56972321', 'LinkedIn Credential')} className="education-link">
                  View Credential<span className="button-arrow">→</span>
                </button>

                <p className="education-degree">Java: Testing with JUnit</p>
                <p className="education-details">LinkedIn • 2026</p>
                <button onClick={() => handleExternalLink('https://www.linkedin.com/learning/certificates/7344773a0767a04b5af51394dd71e77fc2353a10d92b81beae0113c414fe7f8a?u=56972321', 'LinkedIn Credential')} className="education-link">
                  View Credential<span className="button-arrow">→</span>
                </button>

                <br />
                <button onClick={() => handleExternalLink('https://www.linkedin.com/in/mechelle-joe-anand-5406722b3/details/certifications/', 'LinkedIn Certifications Page')} className="more-link">
                  View more certifications on LinkedIn
                </button>
              </div>
            </div>
          </div>
        </section>

        <SectionTransition variant="dark" />

        <section id="skills" className="skills-section scroll-animate">
          <div className="skills-bg">
            <div className="skills-wave skills-wave-1"></div>
            <div className="skills-wave skills-wave-2"></div>
            <div className="skills-wave skills-wave-3"></div>
          </div>
          <div className="section-container-wide">
            <h2 className="section-title scroll-animate">Technical Expertise</h2>
            <div className="skills-grid">
              {skills.map((skillSet, index) => (
                <div 
                  key={skillSet.category} 
                  className={`skill-card scroll-animate ${visibleSkills.includes(index) ? 'skill-visible' : ''}`}
                  style={{ 
                    animationDelay: `${index * 100}ms`,
                    opacity: visibleSkills.includes(index) ? 1 : 0,
                    transform: visibleSkills.includes(index) ? 'translateY(0)' : 'translateY(30px)',
                    transition: `opacity 0.6s ease ${index * 0.15}s, transform 0.6s ease ${index * 0.15}s`
                  }}
                >
                  <h3 className="skill-category">{skillSet.category}</h3>
                  <ul className="skill-list">
                    {skillSet.items.map((skill) => <li key={skill} className="skill-item">{skill}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        <SectionTransition variant="light" />

        <section id="projects" className="projects-section scroll-animate">
          <div className="section-container-wide">
            <h2 className="section-title scroll-animate">Technical Achievements</h2>
            <div className="projects-container">
              {projects.map((project) => (
                <article key={project.title} className="project-card scroll-animate">
                  <div className="project-header">
                    <h3 className="project-title">{project.title}</h3>
                    <button onClick={() => handleExternalLink(project.link, project.title)} className="project-link">
                      View Project<ExternalLink size={16} className="project-link-icon" />
                    </button>
                  </div>
                  <p className="project-description">{project.description}</p>
                  <div className="project-tech">
                    {project.tech.map((tech) => <span key={tech} className="tech-badge">{tech}</span>)}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <SectionTransition variant="dark" />

        <footer className="footer scroll-animate" id="contact">
          <div className="footer-orb footer-orb-1"></div>
          <div className="footer-orb footer-orb-2"></div>
          <div className="footer-content">
            <div className="footer-grid">
              <div className="scroll-animate">
                <h3 className="footer-heading">QUICK LINKS</h3>
                <nav>
                  <ul className="footer-links">
                    {['Home', 'About', 'Skills', 'Projects'].map((item) => (
                      <li key={item}>
                        <button onClick={() => scrollToSection(item.toLowerCase())} className="footer-link">{item}</button>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
              
              <div className="scroll-animate">
                <h3 className="footer-heading">CONTACT</h3>
                <nav>
                  <ul className="footer-links">
                    <li>
                      <button onClick={() => handleExternalLink('mailto:m.joeanand@gmail.com', 'your Email')} className="footer-link">
                        m.joeanand@gmail.com
                      </button>
                    </li>
                    <li>
                      <button onClick={() => handleExternalLink('tel:+19059619856', 'call')} className="footer-link">
                        +1 (905) 961 9856
                      </button>
                    </li>
                    <li>
                      <button className="footer-link" style={{ cursor: 'default' }}>
                        Hamilton, ON
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
              
              <div className="scroll-animate">
                <h3 className="footer-heading">CONNECT</h3>
                <div className="footer-social">
                  <button onClick={() => handleExternalLink('https://github.com/mcheljoe', 'GitHub')} className="social-link"><Github size={24} /></button>
                  <button onClick={() => handleExternalLink('https://www.linkedin.com/in/mechelle-joe-anand-5406722b3/', 'LinkedIn')} className="social-link"><Linkedin size={24} /></button>
                  <button onClick={() => handleExternalLink('mailto:m.joeanand@gmail.com', 'Email')} className="social-link"><Mail size={24} /></button>
                </div>
              </div>
            </div>
            
            <div className="footer-bottom">
              <p>© {new Date().getFullYear()} Mechelle Joe Anand. All rights reserved.</p>
              <p>Built with Next.js</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}