import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Chess } from 'chess.js';
import AdvancedFilter from './AdvancedFilter'; // Import the new component
import './styles.css';

/*
<div className="form-group">
<label htmlFor="precisionLevel">Min Flaw Frequency:</label>
<select
    id="precisionLevel"
    value={precisionLevel}
    onChange={(e) => setPrecisionLevel(e.target.value)}
>
    <option value="0.5% of Games">0.5% of Games (5s-30s)</option>
    <option value="0.3% of Games">0.3% of Games (5s-30s)</option>
    <option value="At Least 1 Game">At Least 1 Game (5s-30s)</option>
</select>
</div>

*/
// Import both logo images
import logo from './checkmatewizard_transparent.png'; // Adjust the path as needed
import logoWhite from './checkmatewizard_pure_white.png'; // Adjust the path as needed
import rightArrow from './rarrow_white.png'; // Adjust the path as needed


const STOCKFISH = window.STOCKFISH;

const defaultState = {
    importedGames: [],
    gamesCount: 0,
    gamesProcessed:0,
    commonLines: [],
    filteredData: [],
    thePgnList: [],
    previousOutput: "",
    gameURLs: [],  // Add this to track game URLs
    opponentName: '',
    opponentColor: 'White',
    precisionLevel: '0.5% of Games',
    processing: false,
    showTable:false,
    activeDropdown: null,
    inputMethod: 'chesscom',
    isLogoHovered: false,
    openingStats:{}
};

const WeaknessFinder = () => {
    const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
    const [filterParams, setFilterParams] = useState(null);
    const [isLogoHovered, setIsLogoHovered] = useState(defaultState.isLogoHovered);
    const [importedGames, setImportedGames] = useState(() => JSON.parse(localStorage.getItem('weaknessFinder_importedGames')) || defaultState.importedGames);
    const [gamesCount, setGamesCount] = useState(() => Number(localStorage.getItem('weaknessFinder_gamesCount')) || defaultState.gamesCount);
    const [commonLines, setCommonLines] = useState(() => JSON.parse(localStorage.getItem('weaknessFinder_commonLines')) || defaultState.commonLines);
    const [filteredData, setFilteredData] = useState(() => JSON.parse(localStorage.getItem('weaknessFinder_filteredData')) || defaultState.filteredData);
    const [thePgnList, setThePgnList] = useState(() => JSON.parse(localStorage.getItem('weaknessFinder_thePgnList')) || defaultState.thePgnList);
    const [gameURLs, setGameURLs] = useState(() => JSON.parse(localStorage.getItem('weaknessFinder_gameURLs')) || defaultState.gameURLs);
    const [previousOutput, setPreviousOutput] = useState(defaultState.previousOutput);
    const [opponentName, setOpponentName] = useState(() => localStorage.getItem('weaknessFinder_opponentName') || defaultState.opponentName);
    const [opponentColor, setOpponentColor] = useState(() => localStorage.getItem('weaknessFinder_opponentColor') || defaultState.opponentColor);
    const [precisionLevel, setPrecisionLevel] = useState(() => localStorage.getItem('weaknessFinder_precisionLevel') || defaultState.precisionLevel);
    const [openingStats, setOpeningStats] = useState(() => JSON.parse(localStorage.getItem('weaknessFinder_openingStats')) || defaultState.openingStats);  // Holds stats for each opening
    const [gamesProcessed, setGamesProcessed] = useState(() => Number(localStorage.getItem('weaknessFinder_gamesProcessed')) || defaultState.gamesProcessed);
  const [processing, setProcessing] = useState(() => localStorage.getItem('weaknessFinder_processing') || defaultState.processing);
  const [showTable, setShowTable] = useState(() => localStorage.getItem('weaknessFinder_showTable') || defaultState.showTable);
    const [activeDropdown, setActiveDropdown] = useState(defaultState.activeDropdown);
    const [inputMethod, setInputMethod] = useState(() => localStorage.getItem('weaknessFinder_inputMethod') || defaultState.inputMethod);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1200);
    // Event listener for window resize
    useEffect(() => {
                const handleResize = () => {
                    const isNowMobile = window.innerWidth < 1200;
                    setIsMobile(isNowMobile);
            
                    if (isNowMobile) {
                        console.log('Applying frozen class');
                        document.body.classList.add('frozen');
                    } else {
                        console.log('Removing frozen class');
                        document.body.classList.remove('frozen');
                    }
                };
            
                window.addEventListener('resize', handleResize);
            
                handleResize();
            
                return () => window.removeEventListener('resize', handleResize);
            }, []);
            
    useEffect(() => {
        localStorage.setItem('weaknessFinder_importedGames', JSON.stringify(importedGames));
    }, [importedGames]);

    useEffect(() => {
        localStorage.setItem('weaknessFinder_gamesCount', gamesCount);
    }, [gamesCount]);

    useEffect(() => {
        localStorage.setItem('weaknessFinder_commonLines', JSON.stringify(commonLines));
    }, [commonLines]);

    useEffect(() => {
        localStorage.setItem('weaknessFinder_filteredData', JSON.stringify(filteredData));
    }, [filteredData]);

    useEffect(() => {
        localStorage.setItem('weaknessFinder_thePgnList', JSON.stringify(thePgnList));
    }, [thePgnList]);

    useEffect(() => {
        localStorage.setItem('weaknessFinder_opponentName', opponentName);
    }, [opponentName]);

    useEffect(() => {
        localStorage.setItem('weaknessFinder_opponentColor', opponentColor);
    }, [opponentColor]);

    useEffect(() => {
        localStorage.setItem('weaknessFinder_precisionLevel', precisionLevel);
    }, [precisionLevel]);

    useEffect(() => {
        localStorage.setItem('weaknessFinder_inputMethod', inputMethod);
    }, [inputMethod]);

    useEffect(() => {
        localStorage.setItem('gameURLs', JSON.stringify(gameURLs));
    }, [gameURLs]);

    useEffect(() => {
        localStorage.setItem('weaknessFinder_showTable', showTable);
    }, [showTable]);

    useEffect(() => {
        setProcessing(false);  // Reset processing when toggling tabs
    }, [inputMethod]);


    useEffect(() => {
        localStorage.setItem('weaknessFinder_gamesProcessed', gamesProcessed);
    }, [gamesProcessed]);


    useEffect(() => {
        localStorage.setItem('weaknessFinder_openingStats', JSON.stringify(openingStats));
    }, [openingStats]);




    const handleReset = () => {
        // Reset state to default values
        setImportedGames(defaultState.importedGames);
        setGamesCount(defaultState.gamesCount);
        setCommonLines(defaultState.commonLines);
        setFilteredData(defaultState.filteredData);
        setThePgnList(defaultState.thePgnList);
        setGameURLs(defaultState.siteList);  // Store the URLs for later use
        setPreviousOutput(defaultState.previousOutput);
        setOpponentName(defaultState.opponentName);
        setOpponentColor(defaultState.opponentColor);
        setPrecisionLevel(defaultState.precisionLevel);
        setProcessing(defaultState.processing);
        setActiveDropdown(defaultState.activeDropdown);
        setInputMethod(defaultState.inputMethod);
        setOpeningStats(defaultState.openingStats);
        setGamesProcessed(defaultState.gamesProcessed);
        setShowTable(defaultState.showTable);

        // Clear localStorage
        localStorage.removeItem('weaknessFinder_importedGames');
        localStorage.removeItem('weaknessFinder_gamesCount');
        localStorage.removeItem('weaknessFinder_commonLines');
        localStorage.removeItem('weaknessFinder_filteredData');
        localStorage.removeItem('weaknessFinder_thePgnList');
        localStorage.removeItem('weaknessFinder_opponentName');
        localStorage.removeItem('weaknessFinder_opponentColor');
        localStorage.removeItem('weaknessFinder_precisionLevel');
        localStorage.removeItem('weaknessFinder_inputMethod');
        localStorage.removeItem('weaknessFinder_combinedPgn');
        localStorage.removeItem('weaknessFinder_gamesProcessed');
        localStorage.removeItem('weaknessFinder_processing');
        localStorage.removeItem('weaknessFinder_showTable');
        localStorage.removeItem('weaknessFinder_openingStats');
    };

    let stockfish = typeof STOCKFISH === "function" ? STOCKFISH() : new Worker("stockfish.js");
    stockfish.postMessage("uci");
    
  // This function handles the toggling logic
  const handleToggle = () => {
    setShowTable(prevShowTable => !prevShowTable);
  };
    

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const fullPgn = e.target.result;
            let rawGames = fullPgn.split(/\[Event/gi).filter(Boolean);
            let games = rawGames.map(game => '[Event' + game.trim());

            setImportedGames(games);
            setGamesCount(games.length);
        };
        reader.readAsText(file);
    };

    const openings = {
        
        // French Defense
       "e4 e6 d4 d5 exd5 exd5 Nc3": "French Defense: Exchange, Bogolyubov Variation",
       "e4 e6 d4 d5 exd5 exd5 Bd3": "French Defense: Exchange Variation",
       "e4 e6 d4 d5 Nf3": "French Defense: Two Knights",
       "e4 e6 d4 d5 Nc3 Bb4": "French Defense: Winawer",
       "e4 e6 d4 d5 Nc3 Nf6": "French Defense: Winawer Variation",
       "e4 e6 d4 d5 Nc3": "French Defense: Classical",
       "e4 e6 d4 d5 Nd2": "French Defense: Tarrasch",
       "e4 e6 d4 d5 e5 c5": "French Defense: Advance Variation",
       "e4 e6 d4 d5 e5": "French Defense: Advance Variation",
       "e4 e6 d4 d5": "French Defense: Main Line",
       "e4 e6 Nf3": "French Defense: Two Knights",
       "e4 e6 c4": "French Defense: Franco-Hiva Gambit",
       "e4 e6 d3": "French Defense: King's Indian Attack",
       "e4 e6 d4": "French Defense: Advance Variation",
       "e4 e6": "French Defense",
       
       // Caro-Kann Defense
       "e4 c6 g3": "Caro-Kann Defense: Fianchetto Variation",
       "e4 c6 d3": "Caro-Kann Defense: King's Indian Attack",
       "e4 c6 Nf3": "Caro-Kann Defense: Two Knights",
       "e4 c6 c4": "Caro-Kann Defense: Panov-Botvinnik Attack",
       "e4 c6 d4 d5 e5": "Caro-Kann Defense: Advance Variation",
       "e4 c6 d4 d5 Nc3 dxe4 Nxe4 Nf6 Ng5 h6 Nxf7": "Caro-Kann Defense: Witty Alien Gambit",
       "e4 c6 d4 d5 Nc3 dxe4 Nxe4 Nd7 Nf3 Ngf6": "Caro-Kann Defense: Smyslov Variation",
       "e4 c6 d4 d5 Nc3 dxe4 Nxe4 Nd7": "Caro-Kann Defense: Karpov Variation",
       "e4 c6 d4 d5 Nc3 dxe4 Nxe4 Bf5": "Caro-Kann Defense: Tartakower Variation",
       "e4 c6 d4 d5 Nc3 dxe4 Nxe4": "Caro-Kann Defense: Classical Variation",
       "e4 c6 d4 d5 Nc3": "Caro-Kann Defense: Advance",
       "e4 c6 d4 d5 Nd2": "Caro-Kann Defense: Tarrasch",
       "e4 c6 d4 d5 exd5 cxd5 c4": "Caro-Kann Defense: Panov-Botvinnik Attack",
       "e4 c6 d4 d5 exd5": "Caro-Kann Defense: Exchange",
       "e4 c6 d4 d5": "Caro-Kann Defense: Classical",
       "e4 c6 d4": "Caro-Kann Defense: Main Line",
       "e4 c6": "Caro-Kann Defense",
       
       
       // Pirc Defense and Modern Defense
       "e4 g6 d4 Bg7": "Modern Defense: Robatsch Defense",
       "e4 d6 d4 Nf6": "Pirc Defense: Classical",
       "e4 g6 d4": "Modern Defense",
       "e4 d6 d4": "Pirc Defense",
       "e4 g6": "Modern Defense",
       "e4 d6": "Pirc Defense",
       
       // Scandinavian Defense
       "e4 d5 Nf3": "Scandinavian Defense: Gambit",
       "e4 d5 exd5": "Scandinavian Defense: Main Line",
       "e4 d5": "Scandinavian Defense",
       
       // Alekhine's Defense
       "e4 Nf6 d3": "Alekhine's Defense: King's Indian Attack",
       "e4 Nf6 e5": "Alekhine's Defense: Chase Variation",
       "e4 Nf6": "Alekhine's Defense",
       
       // Nimzowitsch Defense
       "e4 Nc6 d4": "Nimzowitsch Defense: Main Line",
       "e4 Nc6": "Nimzowitsch Defense",
       
       
       
       // Sicilian Defense
       "e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 a6 Bg5": "Sicilian Defense: Najdorf, Main Line",
       "e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 a6": "Sicilian Defense: Najdorf, English Attack",
       "e4 c5 Nf3 Nc6 d4 cxd4 Nxd4 g6": "Sicilian Defense: Accelerated Dragon, Maroczy Bind",
       "e4 c5 Nf3 Nc6 d4 cxd4 Nxd4": "Sicilian Defense: Accelerated Dragon",
       "e4 c5 Nf3 Nc6 d4": "Sicilian Defense: Open",
       "e4 c5 Nf3 Nc6": "Sicilian Defense: Closed",
       "e4 c5 Nf3 e6 d4 cxd4 Nxd4 a6": "Sicilian Defense: Kan Variation",
       "e4 c5 Nf3 e6 d4 cxd4 Nxd4 Nc6": "Sicilian Defense: Taimanov, Bastrikov",
       "e4 c5 Nf3 e6": "Sicilian Defense: Taimanov",
       "e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3": "Sicilian Defense: Classical",
       "e4 c5 Nf3 d6 d4 cxd4 Nxd4": "Sicilian Defense: Najdorf Variation, 6.Bg5",
       "e4 c5 Nf3 d6 d4": "Sicilian Defense: Open, Najdorf",
       "e4 c5 Nf3 d6": "Sicilian Defense: Najdorf Variation",
       "e4 c5 Nf3": "Sicilian Defense: Open",
       "e4 c5 d3": "Sicilian Defense: King's Indian Attack",
       "e4 c5 g3": "Sicilian Defense: Fianchetto Variation",
       "e4 c5 b3": "Sicilian Defense: Nimzowitsch-Rossolimo Attack",
       "e4 c5 f4": "Sicilian Defense: Grand Prix Attack",
       "e4 c5 Nc3": "Sicilian Defense: Closed",
       "e4 c5 d4": "Sicilian Defense: Smith-Morra Gambit",
       "e4 c5 c3": "Sicilian Defense: Alapin Variation",
       "e4 c5": "Sicilian Defense",
       
       // King's Pawn Openings
       "e4 e5 d4 exd4 Qxd4": "Center Game: Danish Gambit",
       "e4 e5 d4": "Center Game",
       "e4 e5 d3": "King's Indian Attack",
       "e4 e5 Nf3 Nf6 Nxe5 Nc6": "Stafford Gambit",
       "e4 e5 Nc3 Nf6 g3": "Vienna Game: Mieses Variation",
       "e4 e5 Nc3 Nf6": "Vienna Game: Falkbeer Variation",
       "e4 e5 Nc3": "Vienna Game",
       "e4 e5 f4 d6": "King's Gambit Declined",
       "e4 e5 f4 exf4 Bc4": "King's Gambit Accepted, Bishop's Gambit",
       "e4 e5 f4 exf4 Nf3": "King's Gambit Accepted, King's Knight's Gambit",
       "e4 e5 f4 exf4": "King's Gambit Accepted",
       "e4 e5 f4": "King's Gambit",
       "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7 Re1 b5 Bb3 d6 c3 O-O": "Ruy Lopez: Closed, Chigorin Defense, 12.d4",
       "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7 Re1 b5 Bb3 d6 c3": "Ruy Lopez: Closed, Chigorin Defense",
       "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7 Re1": "Ruy Lopez: Closed, Morphy Defense",
       "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7": "Ruy Lopez: Closed, Morphy Defense",
       "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O": "Ruy Lopez: Morphy Defense, Closed",
       "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6": "Ruy Lopez: Morphy Defense, Closed",
       "e4 e5 Nf3 Nc6 Bb5 a6 Ba4": "Ruy Lopez: Morphy Defense",
       "e4 e5 Nf3 Nc6 Bb5 a6": "Ruy Lopez: Morphy Defense",
       "e4 e5 Nf3 Nc6 Bb5": "Ruy Lopez",
       "e4 e5 Nf3 Nc6 Bc4 Nd4": "Blackburne Shilling Gambit",
       "e4 e5 Nf3 Nc6 Bc4 Nf6": "Two Knights Defense",
       "e4 e5 Nf3 Nc6 Bc4 Bc5": "Italian Game: Giuoco Piano",
       "e4 e5 Nf3 Nc6 Bc4": "Italian Game",
       "e4 e5 Nf3 Nc6 d4 exd4 Nxd4 Bc5": "Scotch Game: Göring Gambit",
       "e4 e5 Nf3 Nc6 d4 exd4 Nxd4": "Scotch Game: Scotch Gambit",
       "e4 e5 Nf3 Nc6 d4": "Scotch Game",
       "e4 e5 Nf3 Nc6 d3": "King's Indian Attack",
       "e4 e5 Nf3 Nc6": "King's Knight Opening: Normal Variation",
       "e4 e5 Nf3 d6": "Philidor Defense",
       "e4 e5 Nf3": "King's Knight Opening",
       "e4 b5": "Polish Defense",
       "e4 b6": "Owen's Defense",
       "e4 g6": "Modern Defense",
       "e4 Nf6": "Alekhine's Defense",
       "e4 d5": "Scandinavian Defense",
       "e4 d6": "Pirc Defense",
       "e4 e5": "Open Game",
       "e4": "King's Pawn Opening",
       
       // King's Indian Defense
       "d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 Nf3 O-O Be2 e5 O-O Nbd7": "King's Indian Defense: Orthodox Variation, Classical System, 7...Nbd7",
       "d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 Nf3 O-O Be2 e5 O-O Nc6": "King's Indian Defense: Orthodox Variation, Classical System, 7...Nc6",
       "d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 Nf3 O-O Be2 e5 O-O": "King's Indian Defense: Orthodox Variation, Classical System, 7.O-O",
       "d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 Nf3 O-O Be2 e5": "King's Indian Defense: Orthodox Variation, Classical System",
       "d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 Be2 O-O Nf3": "King's Indian Defense: Orthodox Variation, Classical System",
       "d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 Be2 O-O": "King's Indian Defense: Orthodox Variation, Classical System",
       "d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 Be2": "King's Indian Defense: Orthodox Variation",
       "d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 f3": "King's Indian Defense: Saemisch Variation",
       "d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 Nf3 O-O": "King's Indian Defense: Mar del Plata",
       "d4 Nf6 c4 g6 Nc3 Bg7 e4 d6": "King's Indian Defense: Classical",
       "d4 Nf6 c4 g6 Nc3 Bg7": "King's Indian Defense: Fianchetto",
       "d4 Nf6 c4 g6": "King's Indian Defense",
       
       
       // Nimzo-Indian Defense
       "d4 Nf6 c4 e6 Nc3 Bb4 a3": "Nimzo-Indian Defense: Sämisch, Leningrad System",
       "d4 Nf6 c4 e6 Nc3 Bb4 Qb3": "Nimzo-Indian Defense: Sämisch Variation",
       "d4 Nf6 c4 e6 Nc3 Bb4 e3 O-O": "Nimzo-Indian Defense: Rubinstein, 4...O-O",
       "d4 Nf6 c4 e6 Nc3 Bb4 e3": "Nimzo-Indian Defense: Rubinstein",
       "d4 Nf6 c4 e6 Nc3 Bb4 Qc2": "Nimzo-Indian Defense: Classical, Capablanca Variation",
       "d4 Nf6 c4 e6 Nc3 Bb4": "Nimzo-Indian Defense: Classical",
       "d4 Nf6 c4 e6 Nc3": "Nimzo-Indian Defense",
       "d4 Nf6 c4 e6": "Indian Game",
       "d4 Nf6 Nf3": "King's Indian Attack",
       "d4 Nf6": "Indian Game",
       
       
       // Dutch Defense
       "d4 f5 c4": "Dutch Defense",
       "d4 c5": "Benoni Defense",
       "d4 e6": "Horwitz Defense",
       "d4 e5": "Englund Gambit",
       "d4 d6": "Old Indian Defense",
       "d4 Nc6": "Chigorin Defense",
       "d4 g6": "Modern Defense",
       "d4 f5": "Dutch Defense",
       "d4 d6": "Old Indian Defense",
       "d4 f5": "Dutch Defense",
       
       // Queen's Gambit
       "d4 d5 c4 e6 Nc3 Nf6 Nf3 Be7 Bf4": "Queen's Gambit Declined: Harrwitz Attack",
       "d4 d5 c4 e6 Nc3 Nf6 Nf3 Be7": "Queen's Gambit Declined: 7.Be7",
       "d4 d5 c4 e6 Nc3 Nf6 Nf3": "Queen's Gambit Declined: 6.Nf3",
       "d4 d5 c4 e6 Nc3 c5 cxd5 exd5 Nf3 Nc6": "Tarrasch Defense, Main Line",
       "d4 d5 c4 e6 Nc3 c5 cxd5 exd5": "Tarrasch Defense, Classical Variation",
       "d4 d5 c4 e6 Nc3 c5": "Tarrasch Defense, Closed Variation",
       "d4 d5 c4 e6 Nf3 c5": "Tarrasch Defense",
       "d4 d5 c4 e6 Nf3 Nf6": "Queen's Gambit Declined: 5.Nf3 Variation, Main Line",
       "d4 d5 c4 e6 Nf3": "Queen's Gambit Declined: 5.Nf3 Variation",
       "d4 d5 c4 e6 Nc3 Nf6 Bg5 h6": "Queen's Gambit Declined: Orthodox Defense, Lasker Defense",
       "d4 d5 c4 e6 Nc3 Nf6 Bg5 Be7": "Queen's Gambit Declined: Orthodox Defense, Main Line",
       "d4 d5 c4 e6 Nc3 Nf6 Bg5": "Queen's Gambit Declined: Orthodox Defense",
       "d4 d5 c4 e6 Nc3 Nf6": "Queen's Gambit Declined",
       "d4 d5 c4 dxc4": "Queen's Gambit Accepted",
       "d4 d5 c4 e6": "Queen's Gambit Declined",
       "d4 d5 c4 c6": "Slav Defense",
       "d4 d5 c4": "Queen's Gambit",
       "d4 d5 Nf3": "London System",
       "d4": "Queen's Pawn Opening",
       
       
       // English Opening
       "c4 e5 Nc3 Nc6": "English Opening: Four Knights",
       "c4 e5 Nc3 Nf6": "English Opening: Two Knights",
       "c4 e5 g3": "English Opening: Botvinnik System",
       "c4 e5": "English Opening: Reversed Sicilian",
       "c4 Nf6": "English Opening: Anglo-Indian",
       "c4 g6": "English Opening: Botvinnik System",
       "c4 c5": "English Opening: Symmetrical Variation",
       "c4": "English Opening",
   
       // Reti and Other Openings
       "a4": "Ware Opening",
       "f3": "Barnes Opening",
       "e3": "Van't Kruijs Opening",
       "Nh3": "Amar Opening",
       "Na3": "Sodium Attack",
       "g4": "Grob's Attack",
       "Nc3": "Van Geet Opening",
       "c3": "Saragossa Opening",
       "d3": "Mieses Opening",
       "h4": "Desprez Opening",
       "h3": "Clemenz Opening",
       "a3": "Anderssen's Opening",
       "e3": "Van 't Kruijs Opening",
       "b4 e5": "Polish Opening: Outflank Variation",
       "b4": "Polish Opening",
       "f4 e5": "From's Gambit",
       "f4 d5": "Bird's Opening: Dutch Variation",
       "f4": "Bird's Opening",
       "g3": "King's Fianchetto Opening",
       "b3": "Nimzowitsch-Larsen Attack",
       "Nf3 c5 c4": "Reti Opening: King's Indian Attack",
       "Nf3 c5": "Reti Opening: Anglo-Slav",
       "Nf3 d5": "Reti Opening: Main Line",
       "Nf3": "Reti Opening"
   };

    

    const detectOpening = (moves) => {
        const movesSequence = moves.join(" ");
        for (const opening in openings) {
            if (movesSequence.startsWith(opening)) {
                return openings[opening];
            }
        }
        return "Unknown Opening"; // Fallback if the opening is not in the book
    };

    const fetchLichessGames = async (username, maxGames = 1000, timeControls, oldestDate, newestDate, opponentColor) => {
        const timeClasses = [];
        if (timeControls.bullet) timeClasses.push('bullet');
        if (timeControls.blitz) timeClasses.push('blitz');
        if (timeControls.rapid) timeClasses.push('rapid');
        if (timeControls.classical) timeClasses.push('classical');
    
        const timeClassFilter = timeClasses.length > 0 ? `&perfType=${timeClasses.join(',')}` : '';
        let allFilteredGames = [];
        let fetchedGamesCount = 0;
        let currentPage = 1;
    
        // Fetch games in batches until we get enough games of the correct color
        while (allFilteredGames.length < maxGames) {
            const response = await fetch(`https://lichess.org/api/games/user/${username}?max=1000&moves=true&pgnInJson=false&page=${currentPage}${timeClassFilter}`);
            const data = await response.text();
    
            // Split and process the games from the fetched data
            let rawGames = data.split(/\[Event/gi).filter(Boolean);
            if (rawGames.length === 0) {
                // No more games to fetch, break the loop
                break;
            }
    
            // Filter games by color and date
            let filteredGames = rawGames.map(game => '[Event' + game.trim()).filter(gamePgn => {
                const dateMatch = gamePgn.match(/\[Date "(\d{4}\.\d{2}\.\d{2})"\]/);
                const isWithinRange = !dateMatch || (!oldestDate || new Date(dateMatch[1].replace(/\./g, '-')) >= new Date(oldestDate)) && 
                                                     (!newestDate || new Date(dateMatch[1].replace(/\./g, '-')) <= new Date(newestDate));
    
                // Filter by color
                const whitePlayerMatch = gamePgn.match(/\[White "(.*)"\]/);
                const blackPlayerMatch = gamePgn.match(/\[Black "(.*)"\]/);
                const isCorrectColor = (opponentColor === 'White' && whitePlayerMatch && whitePlayerMatch[1] === username) ||
                                       (opponentColor === 'Black' && blackPlayerMatch && blackPlayerMatch[1] === username);
                                       
                return isWithinRange && isCorrectColor;
            });
    
            // Add the filtered games to the result array
            allFilteredGames = allFilteredGames.concat(filteredGames);
    
            // Stop if we reached or exceeded the desired number of games
            if (allFilteredGames.length >= maxGames) {
                allFilteredGames = allFilteredGames.slice(0, maxGames); // Trim to the exact number of games
                break;
            }
    
            // Increment page and continue fetching
            currentPage++;
            fetchedGamesCount += rawGames.length;
        }
    
        return allFilteredGames;
    };
    
    
    
    const fetchChessComGames = async (username, maxGames = 1000, timeControls, oldestDate, newestDate, opponentColor) => {
        const fetchGamesBatch = async (archiveUrl) => {
            try {
                const response = await fetch(archiveUrl);
                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Error fetching data: ${response.statusText} - ${errorText}`);
                }
    
                const data = await response.json();
                const filteredGames = data.games.filter(game => {
                    // Check for matching time control
                    const isCorrectTimeClass = (timeControls.bullet && game.time_class === 'bullet') ||
                                               (timeControls.blitz && game.time_class === 'blitz') ||
                                               (timeControls.rapid && game.time_class === 'rapid') ||
                                               (timeControls.classical && game.time_class === 'classical');
    
                    // Check for matching color
                    const isCorrectColor = (opponentColor === 'White' && game.white.username === username) ||
                                           (opponentColor === 'Black' && game.black.username === username);
    
                    // Check for date range
                    const gameDate = new Date(game.end_time * 1000); // Convert Unix timestamp to JS Date
                    const isWithinDateRange = (!oldestDate || gameDate >= new Date(oldestDate)) &&
                                              (!newestDate || gameDate <= new Date(newestDate));
    
                    return isCorrectTimeClass && isCorrectColor && isWithinDateRange;
                });
    
                return filteredGames;
            } catch (error) {
                displayErrorBanner('ERROR: Invalid Search');
                return []; // Return an empty array if there's an error
            }
        };
    
        try {
            const archivesResponse = await fetch(`https://api.chess.com/pub/player/${username}/games/archives`);
            if (!archivesResponse.ok) {
                const errorText = await archivesResponse.text();
                throw new Error(`Error fetching archives: ${archivesResponse.statusText} - ${errorText}`);
            }
    
            const archivesData = await archivesResponse.json();
            const archives = archivesData.archives.reverse(); // Reverse to start from the most recent
    
            const results = [];
            for (let archiveUrl of archives) {
                if (results.length >= maxGames) break;
    
                const games = await fetchGamesBatch(archiveUrl);
                results.push(...games);
    
                if (results.length >= maxGames) {
                    results.length = maxGames; // Trim to the maxGames limit
                    break;
                }
            }
    
            return results;
        } catch (error) {
            displayErrorBanner('ERROR: Invalid Search');
        }
    };
    
    
    function displayErrorBanner(message) {
        console.log(2);
        // Clear any existing banners first
        const existingBanners = document.querySelectorAll('.error-banner');
        existingBanners.forEach(banner => banner.remove());
        console.log(3);
        // Create and style banner
        const banner = document.createElement('div');
        banner.className = 'error-banner';
        banner.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: #ff4444;
            color: white;
            padding: 15px;
            text-align: center;
            z-index: 10000;
            font-size: 16px;
            font-weight: bold;
            animation: slideIn 0.3s ease-out;
        `;
        console.log(4);
      
        // Add keyframe animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                0% { transform: translateY(-100%); }
                100% { transform: translateY(0); }
            }
        `;
        document.head.appendChild(style);
      
        banner.innerHTML = `<p>${message}</p>`;
        document.body.prepend(banner);
      
        // Reload after 3 seconds
        setTimeout(() => {
            banner.remove();
            style.remove();
            window.location.reload();
        }, 3000);
      };

    
    
    

    
    const handleStart = async () => {
        setProcessing(true);
        setShowTable(false);
        setFilteredData([]);
        setOpeningStats({});  // Holds stats for each opening
        setGamesProcessed(0);
        let games = [];
        const { maxGames, timeControls, oldestDate, newestDate } = filterParams || {
            maxGames: 1000,
            timeControls: { bullet: true, blitz: true, rapid: true, classical: true },
            oldestDate: null,
            newestDate: null,
        };
        try{
        if (inputMethod === 'lichess') {
            const data = await fetchLichessGames(opponentName, maxGames, timeControls, oldestDate, newestDate, opponentColor);
            games = data;
        } else if (inputMethod === 'chesscom') {
            const data = await fetchChessComGames(opponentName, maxGames, timeControls, oldestDate, newestDate, opponentColor);
            games = data.map(game => game.pgn); // Map the results to PGN format
        } else {
            games = importedGames;
        }
        if(games.length>0){
        setGamesCount(games.length);
        processGames(games);}
        else{displayErrorBanner('ERROR: No Games Found');}}
     catch(error) {
        displayErrorBanner('ERROR: Invalid Search');
    }
    };
    
    
    

    const toggleDropdown = (dropdown) => {
        setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
    };

    const createPgnFromGameIDs = (gameIDs, pgnList) => {
        // Ensure each PGN game is properly formatted
        const combinedPgn = gameIDs.map(id => {
            const gamePgn = pgnList[id];
            if (gamePgn){
    
            // Ensure that the game has all required headers and follows the PGN structure
            if (!gamePgn.includes('[Event')) {
                console.error(`Missing [Event] tag for game with ID ${id}`);
                return ''; // Skip invalid games
            }
            return gamePgn.trim(); // Clean up any extra spaces around the PGN
        }
        else{return '';}
    
        }).filter(Boolean).join('\n\n'); // Join games with a double newline separating them
    
        return combinedPgn;
    };
    
    
    const handleLineClick = (gameIDs) => {
        const combinedPgn = createPgnFromGameIDs(gameIDs, thePgnList);
    
        // Store the combined PGN in localStorage
        localStorage.setItem('combinedPgn', combinedPgn);
    
        // Clear imported games
        localStorage.removeItem('importedGames');
    
        // Redirect to analysis board
        window.location.href = '/analysis-board';
    };
    
    const handleFilterClick = () => {
        setShowAdvancedFilter(true);
    };
    const handleSaveFilter = (params) => {
        setFilterParams(params);
        setShowAdvancedFilter(false);
        // Apply the filters directly to the games list or during game fetching
    };
    
    const formatMovesWithNumbers = (line) => {
        const moves = line.Line.split("*").filter(Boolean);
        const opening = detectOpening(moves);
        const formattedMoves = moves.map((move, index) => {
            const moveNumber = Math.floor(index / 2) + 1;
            return index % 2 === 0 ? `${moveNumber}. ${move}` : `${moveNumber}...${move}`;
        }).join(" ");
    
        return `${opening}: ${formattedMoves}`;
    };

    const categorizeLines = (finalLongDF) => {
        return finalLongDF.map(row => {
            const avgPointsColumn = "AvgPoints";
            const avgPoints = row[avgPointsColumn];
    
                if (avgPoints <= 0) {
                    row.MistakeType = "Fatal Bafflement";
                } else if (avgPoints <= 0.2) {
                    row.MistakeType = "Major Incompetence";
                } else if (avgPoints <= 0.4) {
                    row.MistakeType = "Slight Inconsistency";
                } else {
                    row.MistakeType = "None";
                }
            
            return row;
        }).filter(row => row.MistakeType !== "None");
    };

    const processGames = async (games) => {
        setProcessing(true);
        const eventList = [];
        const siteList = [];
        const whiteList = [];
        const blackList = [];
        const resultList = [];
        const dateList = [];
        const whiteEloList = [];
        const blackEloList = [];
        const fullValList = [];
        const initialColnames = [];
        const movesList = [];
        const pgnList = [];
        const chess = new Chess();
        const minProbability = filterParams ? filterParams.minProbability : 0.2; // Default to 0.2
        let updatedStats = {};
        let totalWins = 0;
        let totalLosses = 0;
        let totGames = 0;
        let totalScore = 0;
        


    
        games.forEach((game, index) => {
            try {
                chess.loadPgn(game);
                let gameURL = chess.header()['Site']; 
                chess.deleteComments();
                let moves = chess.history();
                movesList.push(moves);
                const opening = detectOpening(moves);
                const result = chess.header()["Result"];


                if (!updatedStats[opening]) {
                    updatedStats[opening] = { numGames: 0, wins: 0, losses: 0, score: 0 };
                  }
                  // Update stats based on game result (simplified example)
                  updatedStats[opening].numGames += 1;
                  if ((result === '1-0' )&(opponentColor=="White")) {
                    totalWins += 1;
                    totGames  +=1;
                    totalScore +=1;
                    updatedStats[opening].wins += 1;
                    updatedStats[opening].score += 1;
                } else if ((result === '1-0' )&(opponentColor=="Black")) {
                    totalLosses += 1;
                    totGames  +=1;
                    updatedStats[opening].losses += 1;
                } else if ((result === '0-1' )&(opponentColor=="Black")) {
                    totalWins += 1;
                    totGames  +=1;
                    totalScore +=1;
                    updatedStats[opening].wins += 1;
                    updatedStats[opening].score += 1;
                } else if ((result === '0-1' )&(opponentColor=="White")) {
                    totalLosses += 1;
                    totGames +=1;
                    updatedStats[opening].losses += 1;
                } else if (result === '1/2-1/2') {
                    totGames  +=1;
                    totalScore +=0.5;
                    updatedStats[opening].draws += 1;
                    updatedStats[opening].score += 0.5;
                }

            
                  // Increment games processed counter
                  setGamesProcessed(prev => prev + 1);
                  setOpeningStats({...updatedStats});
                
    
                const valList = [];
                let triangle = String(moves[0]) + "*";
                valList.push(triangle);
    
                pgnList.push(chess.pgn());
                siteList.push(gameURL); // Store the game URL here
                eventList.push(chess.header()["Event"]);
                siteList.push(chess.header()["Site"]);
                whiteList.push(chess.header()["White"]);
                blackList.push(chess.header()["Black"]);
                resultList.push(chess.header()["Result"]);
                dateList.push(chess.header()["Date"]);
                whiteEloList.push(chess.header()["WhiteElo"]);
                blackEloList.push(chess.header()["BlackElo"]);
    
                for (let i = 1; i < 25 && i < moves.length; i++) {
                    triangle += String(moves[i]) + "*";
                    valList.push(triangle);
                }
                fullValList.push(valList);

                
                
            } catch (error) {
                console.error(`Error processing game at index ${index}:`, error.message);
                // Skip this game and continue with the next one
            }
            
        });
        setShowTable(true);
        setProcessing(false);
    
        console.log(fullValList);

        setThePgnList(pgnList); // Set the pgnList to the state variable thePgnList
        setGameURLs(siteList);  // Store the URLs for later use
        


        for (let j = 1; j <= 25; j++) {
            initialColnames.push("Line" + String(j));
        }

        const dataFrame = fullValList.map((row, index) => ({
            ...row.reduce((acc, val, i) => ({ ...acc, [initialColnames[i]]: val }), {}),
            Event: eventList[index],
            Site: siteList[index],
            White: whiteList[index],
            Black: blackList[index],
            WhiteResult1: resultList[index] === '1-0' ? 1 : (resultList[index] === '1/2-1/2' ? 0.5 : 0),
            Date: dateList[index],
            WhiteElo: whiteEloList[index],
            BlackElo: blackEloList[index],
            Pgn: pgnList[index],
            GameID: index
        }));
        console.log("dataFrame");
        console.log(dataFrame);

        const filteredDF = dataFrame.filter(row => row[opponentColor] === opponentName);
        console.log(1);
        console.log(filteredDF);

        const moveProb1 = filteredDF.reduce((acc, row) => {
            acc[row.Line1] = (acc[row.Line1] || 0) + 1;
            return acc;
        }, {});
        const totalGames = filteredDF.length;

        filteredDF.forEach(row => {
            row.MoveProbability1 = moveProb1[row.Line1] / totalGames;
        });
        console.log(2);
        console.log(filteredDF);

        for (let i = 1; i < 25; i++) {
            filteredDF.forEach(row => {
                row[`WhiteResult${i + 1}`] = row.WhiteResult1;
            });

            const moveProb = filteredDF.reduce((acc, row) => {
                const key = `${row[`Line${i}`]}|${row[`Line${i + 1}`]}`;
                acc[key] = (acc[key] || 0) + 1;
                return acc;
            }, {});

            const lineCount = filteredDF.reduce((acc, row) => {
                acc[row[`Line${i}`]] = (acc[row[`Line${i}`]] || 0) + 1;
                return acc;
            }, {});

            filteredDF.forEach(row => {
                const key = `${row[`Line${i}`]}|${row[`Line${i + 1}`]}`;
                row[`MoveProbability${i + 1}`] = moveProb[key] / lineCount[row[`Line${i}`]];
            });
        }
        console.log(3);
        console.log(filteredDF);

        filteredDF.forEach(row => {
            let pw = 1;
            let pb = 1;
            for (let i = 1; i <= 25; i++) {
                if (i % 2 === 1) {
                    pw *= row[`MoveProbability${i}`] || 1;
                } else {
                    pb *= row[`MoveProbability${i}`] || 1;
                }
                row[`LineProbability(W)${i}`] = pw;
                row[`LineProbability(B)${i}`] = pb;
            }
        });
        console.log(4);
        console.log("filteredDF");
        console.log(filteredDF);

        const longDF = [];
        filteredDF.forEach(row => {
            for (let i = 1; i <= 25; i++) {
                longDF.push({
                    GameID: row.GameID,
                    Ply: i,
                    Line: row[`Line${i}`],
                    EVAL: row[`EVAL${i}`],
                    WhiteResult: row[`WhiteResult${i}`],
                    MoveProbability: row[`MoveProbability${i}`],
                    LineProbabilityW: row[`LineProbability(W)${i}`],
                    LineProbabilityB: row[`LineProbability(B)${i}`],
                    Pgn: row.Pgn
                });
            }
        });
        console.log("longDF");
        console.log(longDF);
        // Step to create LineProbability column
        longDF.forEach(row => {
    // If opponentColor is 'Black', use LineProbabilityB; otherwise, use LineProbabilityW
    row.LineProbability = opponentColor === 'Black' ? row.LineProbabilityB : row.LineProbabilityW;
});


        // Add #Games column
        const lineCounts = longDF.reduce((acc, row) => {
            acc[row.Line] = (acc[row.Line] || 0) + 1;
            return acc;
        }, {});

        longDF.forEach(row => {
            row['#Games'] = lineCounts[row.Line];
        });

        // Calculate lower limit based on Min Flaw Frequency
        let minGames = 1; // Default for At Least One Game
        if (precisionLevel === '0.5% of Games') {
            minGames = Math.max(1,Math.round(games.length/200));
        } else if (precisionLevel === '0.3% of Games') {
            minGames = Math.max(1,Math.round(games.length/333));
        }
        //These percentages are wrong since total game counter is flawed
        //Need to update

        console.log("minGames");
        console.log(minGames);

         // Filter for lines which meet minimum number of games
         const minGameFilteredDF = longDF.filter(row => 
            (row["#Games"] >= minGames)
        );
        // Filter for lines with probability greater than 0.2
        const filteredLongDF = minGameFilteredDF.filter(row => 
            (opponentColor === 'Black' && row.LineProbabilityB > minProbability) ||
            (opponentColor === 'White' && row.LineProbabilityW > minProbability)
        );
        console.log("filteredLongDF");
        console.log(filteredLongDF);

        const groupedByLine = filteredLongDF.reduce((acc, row) => {
            if (!acc[row.Line]) {
                acc[row.Line] = {
                    Line: row.Line,
                    TotalGames: 0,
                    TotalWhitePoints: 0,
                    TotalLosses: 0,
                    AverageWhitePoints: 0,
                    GameIDs: [],
                    TotalLineProbability: 0, // Track total probability for averaging later
            AverageLineProbability: 0 // To store the average probabil
                };
            }
            acc[row.Line].TotalGames += 1;
            acc[row.Line].TotalWhitePoints += row.WhiteResult;
            acc[row.Line].TotalLosses += (1 - row.WhiteResult);
            acc[row.Line].AverageWhitePoints = acc[row.Line].TotalWhitePoints / acc[row.Line].TotalGames;
            acc[row.Line].GameIDs.push(row.GameID);
            acc[row.Line].TotalLineProbability += row.LineProbability; // Sum the probabilities for the line
            acc[row.Line].AverageLineProbability = acc[row.Line].TotalLineProbability / acc[row.Line].TotalGames; // Calculate average LineProbability
            return acc;
        }, {});

        

      

        Object.values(groupedByLine).forEach(row => {
            row['AvgPoints'] = opponentColor === "White" ? row.AverageWhitePoints : 1 - row.AverageWhitePoints;
        });

        console.log("groupedByLine");
        console.log(groupedByLine);
        


        // Convert groupedByLine to an array and sort by WinPercentage
        const groupedLongDF = Object.values(groupedByLine);
        const sortedLongDF = groupedLongDF.sort((a, b) => {
        return a.AvgPoints - b.AvgPoints;
    });
        

        console.log("sortedLongDF");
        console.log(sortedLongDF);
        

    const definedDF = sortedLongDF.filter(row => row.Line !== undefined);
    console.log("definedDF");
        console.log(definedDF);
 
        let fullLinesStr = "//";
        let partialLinesStr = "//";
    const nonSubsetLongDF = definedDF.filter(row => {
        const subsets = [];
        const lineMoves = row.Line.split("*").filter(Boolean);
        
// SUBSET CHECK
        // Check if value already in partialLinesStr
        if (partialLinesStr.includes("//" + row.Line +"//")) {
                return false;
            }
        


        // SUPERSET CHECK
        // Check if any subset is already in fullLinesStr

        // Generate all possible subsets of the current line
        for (let i = 1; i <= lineMoves.length; i++) {
            const subset = lineMoves.slice(0, i).join("*") + "*"; 
            if (fullLinesStr.includes("//" + subset+ "//")) {
                return false;
            }
            partialLinesStr += subset + "//";
    };
        fullLinesStr += row.Line+ "//";
        return true;
    });

    console.log("nonSubsetLongDF");
    console.log(nonSubsetLongDF);
        const categorizedLines = categorizeLines(nonSubsetLongDF);
        setFilteredData(categorizedLines);
        console.log("filteredData");
    console.log(filteredData);

        const commonLines = findCommonLines(movesList);
        setCommonLines(commonLines);

        setProcessing(false); // Stop processing
    };

    const findCommonLines = (movesList) => {
        const lineCounts = {};

        movesList.forEach(moves => {
            moves.forEach((move, index) => {
                const line = moves.slice(0, index + 1).join(' ');
                if (!lineCounts[line]) {
                    lineCounts[line] = 0;
                }
                lineCounts[line]++;
            });
        });

        const sortedLines = Object.entries(lineCounts).sort((a, b) => b[1] - a[1]);
        return sortedLines.slice(0, 5);
    };
    const handleCancelFilter = () => {
        setShowAdvancedFilter(false);
    };
    
    const sortedStats = Object.entries(openingStats).sort(([, a], [, b]) => b.numGames - a.numGames);


    return (
        <div className="weakness-finder">
            <header>
                <nav>
                    <ul>
                        <li
                            onMouseEnter={() => setIsLogoHovered(true)}
                            onMouseLeave={() => setIsLogoHovered(false)}
                        >
                            <Link to="/">
                                <img src={isLogoHovered ? logoWhite : logo} alt="Home" style={{ height: '39px' }} />
                            </Link>
                        </li>
                        {isMobile ? (
                            <div className="navdropdown-container">
                                <div
                                    className={`${isDropdownOpen ? 'navdropdown' : 'navdropdown'}`}
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                >
                                    <li
                                        className="navdropdown-header"
                                        style={{
                
                                            lineHeight: '1.78',
                                            padding: '10px 20px',
                
                                            fontSize: '22px',
                                            color: 'white',
                                        }}
                                        
                                    >
                                        ☰ Menu
                                    </li>
                                    {isDropdownOpen && (
                                        <ul>
                                            <li>
                                                <Link
                                                    to="/blunder-punisher"
                                                    className="nav-link"
                                                    onClick={() => setIsDropdownOpen(false)}
                                                >
                                                    Blunder Punisher
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    to="/weakness-finder"
                                                    className="nav-link"
                                                    onClick={() => setIsDropdownOpen(false)}
                                                >
                                                    Weakness Finder
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    to="/analysis-board"
                                                    className="nav-link"
                                                    onClick={() => setIsDropdownOpen(false)}
                                                >
                                                    Analysis Board
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    to="/feedback"
                                                    className="nav-link"
                                                    onClick={() => setIsDropdownOpen(false)}
                                                >
                                                    Your Feedback
                                                </Link>
                                            </li>
                                        </ul>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <ul>
                                <li>
                                    <Link to="/blunder-punisher" className="prepare-link">
                                        Blunder Punisher
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/weakness-finder">Weakness Finder</Link>
                                </li>
                                <li>
                                    <Link to="/analysis-board">Analysis Board</Link>
                                </li>
                                <li>
                                    <Link to="/feedback">Your Feedback</Link>
                                </li>
                            </ul>
                        )}
                    </ul>
                </nav>
            </header>
            <main>
                <section className="hero3">
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
    <h1 className="title" style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>Weakness Finder</h1>
    <p style={{ fontStyle: 'italic', fontSize: 20, marginLeft: 'auto' }}>Punish your opponent's strategic flaws!</p>
</div>
                    {!showAdvancedFilter ? (
                        <div className="filter-container">
                            <button onClick={handleFilterClick} className="adv-filter-button">🔍</button>
                            <div className="tab-container">
                                <div className="tab">
                                    <button className={inputMethod === 'chesscom' ? 'tablinks active' : 'tablinks'} onClick={() => setInputMethod('chesscom')}>Chess.com</button>
                                    <button className={inputMethod === 'lichess' ? 'tablinks active' : 'tablinks'} onClick={() => setInputMethod('lichess')}>Lichess</button>
                                    <button className={inputMethod === 'pgn' ? 'tablinks active' : 'tablinks'} onClick={() => setInputMethod('pgn')}>PGN</button>
                                </div>
                                <div className="tabcontent" style={{ display: inputMethod === 'pgn' ? 'block' : 'none' }}>
                                    <div className="form-group">
                                        <input type="file" onChange={handleFileSelect} />
                                        <label htmlFor="opponentName">Player Name:</label>
                                        <input
                                            type="text"
                                            id="opponentName"
                                            value={opponentName}
                                            onChange={(e) => setOpponentName(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="tabcontent" style={{ display: inputMethod === 'lichess' ? 'block' : 'none' }}>
                                    <div className="form-group">
                                        <label htmlFor="opponentUsername">Player Username:</label>
                                        <input
                                            type="text"
                                            id="opponentUsername"
                                            value={opponentName}
                                            onChange={(e) => setOpponentName(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="tabcontent" style={{ display: inputMethod === 'chesscom' ? 'block' : 'none' }}>
                                    <div className="form-group">
                                        <label htmlFor="opponentUsername">Player Username:</label>
                                        <input
                                            type="text"
                                            id="opponentUsername"
                                            value={opponentName}
                                            onChange={(e) => setOpponentName(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="opponentColor">Piece Color:</label>
                                    <select
                                        id="opponentColor"
                                        value={opponentColor}
                                        onChange={(e) => setOpponentColor(e.target.value)}
                                    >
                                        <option value="White">White</option>
                                        <option value="Black">Black</option>
                                    </select>
                                </div>
                                <button onClick={handleStart} className="spec-button" style={{ marginTop: 6.5, marginLeft: 10 }}>Start</button>
                                <button onClick={handleReset} className="spec-button" style={{ marginTop: 6.5, marginLeft: 10 }}>Reset</button>
                            </div>
                            
                            {processing ? (
        // Rotating white king while games are being processed
        <div className="rotating-king">
          <img src={"https://upload.wikimedia.org/wikipedia/commons/4/42/Chess_klt45.svg"} alt="Rotating King" className="king-icon" />
        </div>
      ) : (
        // Toggle button after processing is complete
        <div className="arrow-button" onClick={handleToggle}>
          <img  
          src={rightArrow }
            alt="Toggle View" 
            className={`arrow-icon ${showTable ? '' : 'rotate'}`}
          />
        </div>
      )}
        {showTable && gamesProcessed > 0 &&
        <div className="table-container">
        <table className="scrollable-table">
          <thead>
            <tr>
              <th>Opening</th>
              <th>Games</th>
              <th>Score %</th>
              <th>Wins</th>
              <th>Losses</th>
            </tr>
          </thead>
          <tbody>
            {sortedStats.map(([opening, stats], index) => (
              <tr key={index}>
                <td>{opening}</td>
                <td>{stats.numGames}</td>
                <td>{((stats.score / stats.numGames) * 100).toFixed(2)}%</td>
                <td>{stats.wins}</td>
                <td>{stats.losses}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
        <tr>
          <td>Total</td>
          <td>{sortedStats.reduce((total, [, stats]) => total + stats.numGames, 0)}</td>
          <td>{((sortedStats.reduce((total, [, stats]) => total + stats.score, 0) / sortedStats.reduce((total, [, stats]) => total + stats.numGames, 0)) * 100).toFixed(2)}%</td>
          <td>{sortedStats.reduce((total, [, stats]) => total + stats.wins, 0)}</td>
          <td>{sortedStats.reduce((total, [, stats]) => total + stats.losses, 0)}</td>
        </tr>
      </tfoot>
          
        </table>
        </div>
        
      }
                            
                            {showTable ? (
                                <div className="common-lines">
                                </div>
                            ) : (
                                <div>
                                <div className="dropdown-container">
                                    <div className="dropdown">
                                        <button onClick={() => toggleDropdown('Fatal Bafflements')}>
                                            Fatal Bafflements: ({filteredData.filter(line => line.MistakeType === 'Fatal Bafflement').length})
                                        </button>
                                        {activeDropdown === 'Fatal Bafflements' && (
                                            <ul>
                                                {filteredData.filter(line => line.MistakeType === 'Fatal Bafflement').map((line, index) => (
                                                    <li key={index} className='line-item' onClick={() => handleLineClick(line.GameIDs)}>
                                                        {formatMovesWithNumbers(line)}
                                                        <p>Score: {Math.round(line.AvgPoints * 100)}% w/ Trap Probability: {Math.round(line.AverageLineProbability * 100)}%</p>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                    <div className="dropdown">
                                        <button onClick={() => toggleDropdown('Major Incompetencies')}>
                                            Major Incompetencies: ({filteredData.filter(line => line.MistakeType === 'Major Incompetence').length})
                                        </button>
                                        {activeDropdown === 'Major Incompetencies' && (
                                            <ul>
                                                {filteredData.filter(line => line.MistakeType === 'Major Incompetence').map((line, index) => (
                                                    <li key={index} className='line-item' onClick={() => handleLineClick(line.GameIDs)}>
                                                        {formatMovesWithNumbers(line)}
                                                        <p>Score: {Math.round(line.AvgPoints * 100)}% w/ Trap Probability: {Math.round(line.AverageLineProbability * 100)}%</p>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                    <div className="dropdown">
                                        <button onClick={() => toggleDropdown('Slight Inconsistencies')}>
                                            Slight Inconsistencies: ({filteredData.filter(line => line.MistakeType === 'Slight Inconsistency').length})
                                        </button>
                                        {activeDropdown === 'Slight Inconsistencies' && (
                                            <ul>
                                                {filteredData.filter(line => line.MistakeType === 'Slight Inconsistency').map((line, index) => (
                                                    <li key={index} className='line-item' onClick={() => handleLineClick(line.GameIDs)}>
                                                        {formatMovesWithNumbers(line)}
                                                        <p>Score: {Math.round(line.AvgPoints * 100)}% w/ Trap Probability: {Math.round(line.AverageLineProbability * 100)}%</p>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <AdvancedFilter onSave={handleSaveFilter} onCancel={handleCancelFilter} />
                    )}
                </section>
            </main>
            <footer>
            <p>&copy; 2025 CheckmateWizard.com All rights reserved.</p>
            </footer>
        </div>
    );
};

export default WeaknessFinder;
