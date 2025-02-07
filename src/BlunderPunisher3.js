import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Chess } from 'chess.js';
import AdvancedFilter from './AdvancedFilter'; // Import the new component

import './styles.css';


// Import both logo images
import logo from './checkmatewizard_transparent.png'; // Adjust the path as needed
import logoWhite from './checkmatewizard_no_black.png'; // Adjust the path as needed

const STOCKFISH = window.STOCKFISH;
const defaultState = {
    importedGames: [],
    gamesCount: 0,
    commonLines: [],
    filteredData: [],
    thePgnList: [],
    previousOutput: "",
    opponentName: '',
    opponentColor: 'White',
    precisionLevel: '3% of Games',
    processing: false,
    activeDropdown: null,
    inputMethod: 'chesscom',
    isLogoHovered: false
};
const BlunderPunisher = () => {
    const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [filterParams, setFilterParams] = useState(null);
    const [finalLongDF, setFinalLongDF] = useState([]);
    const [evaluation, setEvaluation] = useState("");
    const [bestLine, setBestLine] = useState("");
    const [filter, setFilter] = useState('blunderPunisher_all'); // Default filter is 'All Games'
    const [totalGames, setTotalGames] = useState(0);
    const [gameCounts, setGameCounts] = useState({});
    const [oldestGame, setOldestGame] = useState('');
    const [newestGame, setNewestGame] = useState('');
    const [winLossRecord, setWinLossRecord] = useState('');
    const [highestRatedWin, setHighestRatedWin] = useState('');
    const [lowestRatedLoss, setLowestRatedLoss] = useState('');
    const [gameLengthData, setGameLengthData] = useState([]);
    const [isLogoHovered, setIsLogoHovered] = useState(defaultState.isLogoHovered);
    const [importedGames, setImportedGames] = useState(() => JSON.parse(localStorage.getItem('blunderPunisher_importedGames')) || defaultState.importedGames);
    const [gamesCount, setGamesCount] = useState(() => Number(localStorage.getItem('blunderPunisher_gamesCount')) || defaultState.gamesCount);
    const [commonLines, setCommonLines] = useState(() => JSON.parse(localStorage.getItem('blunderPunisher_commonLines')) || defaultState.commonLines);
    const [filteredData, setFilteredData] = useState(() => JSON.parse(localStorage.getItem('blunderPunisher_filteredData')) || defaultState.filteredData);
    const [thePgnList, setThePgnList] = useState(() => JSON.parse(localStorage.getItem('blunderPunisher_thePgnList')) || defaultState.thePgnList);
    const [previousOutput, setPreviousOutput] = useState(defaultState.previousOutput);
    const [opponentName, setOpponentName] = useState(() => localStorage.getItem('blunderPunisher_opponentName') || defaultState.opponentName);
    const [opponentColor, setOpponentColor] = useState(() => localStorage.getItem('blunderPunisher_opponentColor') || defaultState.opponentColor);
    const [precisionLevel, setPrecisionLevel] = useState(() => localStorage.getItem('blunderPunisher_precisionLevel') || defaultState.precisionLevel);
    const [processing, setProcessing] = useState(defaultState.processing);
    const [activeDropdown, setActiveDropdown] = useState(defaultState.activeDropdown);
    const [inputMethod, setInputMethod] = useState(() => localStorage.getItem('blunderPunisher_inputMethod') || defaultState.inputMethod);

    useEffect(() => {
        localStorage.setItem('blunderPunisher_importedGames', JSON.stringify(importedGames));
    }, [importedGames]);

    useEffect(() => {
        localStorage.setItem('blunderPunisher_gamesCount', gamesCount);
    }, [gamesCount]);

    useEffect(() => {
        localStorage.setItem('blunderPunisher_commonLines', JSON.stringify(commonLines));
    }, [commonLines]);

    useEffect(() => {
        localStorage.setItem('blunderPunisher_filteredData', JSON.stringify(filteredData));
    }, [filteredData]);

    useEffect(() => {
        localStorage.setItem('blunderPunisher_thePgnList', JSON.stringify(thePgnList));
    }, [thePgnList]);

    useEffect(() => {
        localStorage.setItem('blunderPunisher_opponentName', opponentName);
    }, [opponentName]);

    useEffect(() => {
        localStorage.setItem('blunderPunisher_opponentColor', opponentColor);
    }, [opponentColor]);

    useEffect(() => {
        localStorage.setItem('blunderPunisher_precisionLevel', precisionLevel);
    }, [precisionLevel]);

    useEffect(() => {
        localStorage.setItem('blunderPunisher_inputMethod', inputMethod);
    }, [inputMethod]);

    const handleReset = () => {
        // Reset state to default values
        setImportedGames(defaultState.importedGames);
        setGamesCount(defaultState.gamesCount);
        setCommonLines(defaultState.commonLines);
        setFilteredData(defaultState.filteredData);
        setThePgnList(defaultState.thePgnList);
        setPreviousOutput(defaultState.previousOutput);
        setOpponentName(defaultState.opponentName);
        setOpponentColor(defaultState.opponentColor);
        setPrecisionLevel(defaultState.precisionLevel);
        setProcessing(defaultState.processing);
        setActiveDropdown(defaultState.activeDropdown);
        setInputMethod(defaultState.inputMethod);

        // Clear localStorage
        localStorage.removeItem('blunderPunisher_importedGames');
        localStorage.removeItem('blunderPunisher_gamesCount');
        localStorage.removeItem('blunderPunisher_commonLines');
        localStorage.removeItem('blunderPunisher_filteredData');
        localStorage.removeItem('blunderPunisher_thePgnList');
        localStorage.removeItem('blunderPunisher_opponentName');
        localStorage.removeItem('blunderPunisher_opponentColor');
        localStorage.removeItem('blunderPunisher_precisionLevel');
        localStorage.removeItem('blunderPunisher_inputMethod');
        localStorage.removeItem('blunderPunisher_combinedPgn');
    };

    let stockfish = typeof STOCKFISH === "function" ? STOCKFISH() : new Worker("stockfish.js");
    stockfish.postMessage("uci");

    useEffect(() => {}, [thePgnList]);

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
    
    const handleFilterClick = () => {
        setShowAdvancedFilter(true);
    };
    const handleSaveFilter = (params) => {
        setFilterParams(params);
        setShowAdvancedFilter(false);
        // Apply the filters directly to the games list or during game fetching
    };

    const handleCancelFilter = () => {
        setShowAdvancedFilter(false);
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
                console.error('Error fetching games batch:', error.message);
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
            console.error('Error fetching games from Chess.com:', error.message);
            throw error;
        }
    };


    const handleLoadGames = () => {
        // Logic to load games based on the selected filter (all or last 1000 games)
        // Update the state variables such as totalGames, gameCounts, oldestGame, newestGame, etc.
        console.log(`Loading games with filter: ${filter}`);
    };

    const openings = {
        // King's Pawn Openings
        "e4": "King's Pawn Opening",
        "e4 e5": "Open Game",
        "e4 e5 Nf3": "King's Knight Opening",
        "e4 e5 Nf3 Nc6": "King's Knight Opening: Normal Variation",
        "e4 e5 Nf3 Nc6 Bb5": "Ruy Lopez",
        "e4 e5 Nf3 Nc6 Bc4": "Italian Game",
        "e4 e5 Nf3 Nc6 Bc4 Bc5": "Italian Game: Giuoco Piano",
        "e4 e5 Nf3 Nc6 Bc4 Nf6": "Two Knights Defense",
        "e4 e5 Nf3 Nc6 d4": "Scotch Game",
        "e4 e5 Nf3 Nc6 d4 exd4 Nxd4": "Scotch Game: Scotch Gambit",
        "e4 e5 Nf3 Nc6 d4 exd4 Nxd4 Bc5": "Scotch Game: Göring Gambit",
        "e4 e5 Nf3 Nc6 Bb5 a6": "Ruy Lopez: Morphy Defense",
        "e4 e5 Nf3 Nc6 Bb5 a6 Ba4": "Ruy Lopez: Morphy Defense",
        "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6": "Ruy Lopez: Morphy Defense, Closed",
        "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O": "Ruy Lopez: Morphy Defense, Closed",
        "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7": "Ruy Lopez: Closed, Morphy Defense",
        "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7 Re1 b5 Bb3 d6 c3": "Ruy Lopez: Closed, Chigorin Defense",
        "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7 Re1 b5 Bb3 d6 c3 O-O": "Ruy Lopez: Closed, Chigorin Defense, 12.d4",
        "e4 e5 Nf3 d6": "Philidor Defense",
        "e4 e5 f4": "King's Gambit",
        "e4 e5 f4 exf4": "King's Gambit Accepted",
        "e4 e5 f4 exf4 Nf3": "King's Gambit Accepted, King's Knight's Gambit",
        "e4 e5 f4 exf4 Bc4": "King's Gambit Accepted, Bishop's Gambit",
        "e4 e5 f4 d6": "King's Gambit Declined",
        "e4 e5 Nf3 d6": "Philidor Defense",
        "e4 e5 Nc3": "Vienna Game",
        "e4 e5 Nc3 Nf6": "Vienna Game: Falkbeer Variation",
        "e4 e5 Nc3 Nf6 g3": "Vienna Game: Mieses Variation",
        "e4 e5 Nf3 Nc6 d3": "King's Indian Attack",
        "e4 e5 d4": "Center Game",
        "e4 e5 d4 exd4 Qxd4": "Center Game: Danish Gambit",
        
        // Sicilian Defense
        "e4 c5": "Sicilian Defense",
        "e4 c5 Nf3": "Sicilian Defense: Open",
        "e4 c5 Nf3 d6": "Sicilian Defense: Najdorf Variation",
        "e4 c5 Nf3 d6 d4": "Sicilian Defense: Open, Najdorf",
        "e4 c5 Nf3 d6 d4 cxd4 Nxd4": "Sicilian Defense: Najdorf Variation, 6.Bg5",
        "e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3": "Sicilian Defense: Classical",
        "e4 c5 Nf3 e6": "Sicilian Defense: Taimanov",
        "e4 c5 Nf3 e6 d4 cxd4 Nxd4 Nc6": "Sicilian Defense: Taimanov, Bastrikov",
        "e4 c5 Nf3 e6 d4 cxd4 Nxd4 a6": "Sicilian Defense: Kan Variation",
        "e4 c5 Nf3 Nc6": "Sicilian Defense: Closed",
        "e4 c5 Nf3 Nc6 d4": "Sicilian Defense: Open",
        "e4 c5 Nf3 Nc6 d4 cxd4 Nxd4": "Sicilian Defense: Accelerated Dragon",
        "e4 c5 Nf3 Nc6 d4 cxd4 Nxd4 g6": "Sicilian Defense: Accelerated Dragon, Maroczy Bind",
        "e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 a6": "Sicilian Defense: Najdorf, English Attack",
        "e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 a6 Bg5": "Sicilian Defense: Najdorf, Main Line",
        
        // French Defense
        "e4 e6": "French Defense",
        "e4 e6 d4": "French Defense: Advance Variation",
        "e4 e6 d4 d5": "French Defense: Advance",
        "e4 e6 d4 d5 e5": "French Defense: Advance Variation",
        "e4 e6 d4 d5 Nd2": "French Defense: Tarrasch",
        "e4 e6 d4 d5 Nc3": "French Defense: Classical",
        "e4 e6 d4 d5 Nc3 Nf6": "French Defense: Winawer Variation",
        "e4 e6 d4 d5 Nc3 Bb4": "French Defense: Winawer",
        "e4 e6 d4 d5 exd5 exd5 Bd3": "French Defense: Exchange Variation",
        "e4 e6 d4 d5 exd5 exd5 Nc3": "French Defense: Exchange, Bogolyubov Variation",
        "e4 e6 d4 d5 e5 c5": "French Defense: Advance Variation",
        "e4 e6 d4 d5 Nf3": "French Defense: Two Knights",
        
        // Caro-Kann Defense
        "e4 c6": "Caro-Kann Defense",
        "e4 c6 d4 d5": "Caro-Kann Defense: Classical",
        "e4 c6 d4 d5 Nc3": "Caro-Kann Defense: Advance",
        "e4 c6 d4 d5 Nd2": "Caro-Kann Defense: Tarrasch",
        "e4 c6 d4 d5 exd5": "Caro-Kann Defense: Exchange",
        "e4 c6 d4 d5 e5": "Caro-Kann Defense: Advance Variation",
        "e4 c6 d4 d5 exd5 cxd5 c4": "Caro-Kann Defense: Panov-Botvinnik Attack",
        "e4 c6 d4 d5 Nc3 dxe4 Nxe4": "Caro-Kann Defense: Classical Variation",
        "e4 c6 d4 d5 Nc3 dxe4 Nxe4 Bf5": "Caro-Kann Defense: Tartakower Variation",
        "e4 c6 d4 d5 Nc3 dxe4 Nxe4 Nd7": "Caro-Kann Defense: Karpov Variation",
        "e4 c6 d4 d5 Nc3 dxe4 Nxe4 Nd7 Nf3 Ngf6": "Caro-Kann Defense: Smyslov Variation",
        
        // Queen's Gambit
        "d4": "Queen's Pawn Opening",
        "d4 d5 c4": "Queen's Gambit",
        "d4 d5 c4 c6": "Slav Defense",
        "d4 d5 c4 e6": "Queen's Gambit Declined",
        "d4 d5 c4 dxc4": "Queen's Gambit Accepted",
        "d4 d5 c4 e6 Nc3 Nf6": "Queen's Gambit Declined",
        "d4 d5 c4 e6 Nc3 Nf6 Bg5": "Queen's Gambit Declined: Orthodox Defense",
        "d4 d5 c4 e6 Nc3 Nf6 Bg5 Be7": "Queen's Gambit Declined: Orthodox Defense, Main Line",
        "d4 d5 c4 e6 Nc3 Nf6 Bg5 h6": "Queen's Gambit Declined: Orthodox Defense, Lasker Defense",
        "d4 d5 c4 e6 Nf3": "Queen's Gambit Declined: 5.Nf3 Variation",
        "d4 d5 c4 e6 Nf3 Nf6": "Queen's Gambit Declined: 5.Nf3 Variation, Main Line",
        "d4 d5 c4 e6 Nf3 c5": "Tarrasch Defense",
        "d4 d5 c4 e6 Nc3 c5": "Tarrasch Defense, Closed Variation",
        "d4 d5 c4 e6 Nc3 c5 cxd5 exd5": "Tarrasch Defense, Classical Variation",
        "d4 d5 c4 e6 Nc3 c5 cxd5 exd5 Nf3 Nc6": "Tarrasch Defense, Main Line",
        "d4 d5 c4 e6 Nc3 Nf6 Nf3": "Queen's Gambit Declined: 6.Nf3",
        "d4 d5 c4 e6 Nc3 Nf6 Nf3 Be7": "Queen's Gambit Declined: 7.Be7",
        "d4 d5 c4 e6 Nc3 Nf6 Nf3 Be7 Bf4": "Queen's Gambit Declined: Harrwitz Attack",
        
        // King's Indian Defense
        "d4 Nf6": "Indian Game",
        "d4 Nf6 c4 g6": "King's Indian Defense",
        "d4 Nf6 c4 g6 Nc3 Bg7": "King's Indian Defense: Fianchetto",
        "d4 Nf6 c4 g6 Nc3 Bg7 e4 d6": "King's Indian Defense: Classical",
        "d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 Nf3 O-O": "King's Indian Defense: Mar del Plata",
        "d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 f3": "King's Indian Defense: Saemisch Variation",
        "d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 Be2": "King's Indian Defense: Orthodox Variation",
        "d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 Be2 O-O": "King's Indian Defense: Orthodox Variation, Classical System",
        "d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 Be2 O-O Nf3": "King's Indian Defense: Orthodox Variation, Classical System",
        "d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 Nf3 O-O Be2 e5": "King's Indian Defense: Orthodox Variation, Classical System",
        "d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 Nf3 O-O Be2 e5 O-O": "King's Indian Defense: Orthodox Variation, Classical System, 7.O-O",
        "d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 Nf3 O-O Be2 e5 O-O Nc6": "King's Indian Defense: Orthodox Variation, Classical System, 7...Nc6",
        "d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 Nf3 O-O Be2 e5 O-O Nbd7": "King's Indian Defense: Orthodox Variation, Classical System, 7...Nbd7",
        
        // Nimzo-Indian Defense
        "d4 Nf6 c4 e6": "Indian Game",
        "d4 Nf6 c4 e6 Nc3": "Nimzo-Indian Defense",
        "d4 Nf6 c4 e6 Nc3 Bb4": "Nimzo-Indian Defense: Classical",
        "d4 Nf6 c4 e6 Nc3 Bb4 Qc2": "Nimzo-Indian Defense: Classical, Capablanca Variation",
        "d4 Nf6 c4 e6 Nc3 Bb4 e3": "Nimzo-Indian Defense: Rubinstein",
        "d4 Nf6 c4 e6 Nc3 Bb4 e3 O-O": "Nimzo-Indian Defense: Rubinstein, 4...O-O",
        "d4 Nf6 c4 e6 Nc3 Bb4 Qb3": "Nimzo-Indian Defense: Sämisch Variation",
        "d4 Nf6 c4 e6 Nc3 Bb4 a3": "Nimzo-Indian Defense: Sämisch, Leningrad System",
        
        // Ruy Lopez Variations
        "e4 e5 Nf3 Nc6 Bb5 a6": "Ruy Lopez: Morphy Defense",
        "e4 e5 Nf3 Nc6 Bb5 a6 Ba4": "Ruy Lopez: Morphy Defense",
        "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6": "Ruy Lopez: Closed",
        "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O": "Ruy Lopez: Closed",
        "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7": "Ruy Lopez: Closed, Morphy Defense",
        "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7 Re1": "Ruy Lopez: Closed, Morphy Defense",
        
        // English Opening
        "c4": "English Opening",
        "c4 e5": "English Opening: Reversed Sicilian",
        "c4 e5 Nc3 Nc6": "English Opening: Four Knights",
        "c4 e5 Nc3 Nf6": "English Opening: Two Knights",
        "c4 e5 g3": "English Opening: Botvinnik System",
        
        // Other Common Openings
        "Nf3": "Reti Opening",
        "b3": "Nimzowitsch-Larsen Attack",
        "d4 f5": "Dutch Defense",
        "f4": "Bird's Opening",
        "g3": "King's Fianchetto Opening",
        // King's Pawn Openings
    "e4 e5": "Open Game",
    "e4 c5": "Sicilian Defense",
    "e4 e6": "French Defense",
    "e4 c6": "Caro-Kann Defense",
    "e4 d6": "Pirc Defense",
    "e4 d5": "Scandinavian Defense",
    "e4 Nf6": "Alekhine's Defense",
    "e4 g6": "Modern Defense",
    "e4 b6": "Owen's Defense",
    "e4 Nc6": "Nimzowitsch Defense",
    "e4 b5": "Polish Defense",
    "e4 e5 Nf3": "King's Knight Opening",
    "e4 e5 Nc3": "Vienna Game",
    "e4 e5 f4": "King's Gambit",
    "e4 e5 d4": "Center Game",
    "e4 e5 Nf3 Nc6": "King's Knight Opening: Normal Variation",
    "e4 e5 Nf3 Nc6 Bb5": "Ruy Lopez",
    "e4 e5 Nf3 Nc6 Bc4": "Italian Game",
    "e4 e5 Nf3 Nc6 Bc4 Bc5": "Italian Game: Giuoco Piano",
    "e4 e5 Nf3 Nc6 Bc4 Nf6": "Two Knights Defense",
    "e4 e5 Nf3 Nc6 d4": "Scotch Game",
    "e4 e5 Nf3 Nc6 d4 exd4 Nxd4": "Scotch Game: Scotch Gambit",
    "e4 e5 Nf3 Nc6 d4 exd4 Nxd4 Bc5": "Scotch Game: Göring Gambit",
    "e4 e5 Nf3 Nc6 Bb5 a6": "Ruy Lopez: Morphy Defense",
    "e4 e5 Nf3 Nc6 Bb5 a6 Ba4": "Ruy Lopez: Morphy Defense",
    "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6": "Ruy Lopez: Morphy Defense, Closed",
    "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O": "Ruy Lopez: Morphy Defense, Closed",
    "e4 e5 Nf3 d6": "Philidor Defense",
    "e4 e5 f4": "King's Gambit",
    "e4 e5 f4 exf4": "King's Gambit Accepted",
    "e4 e5 f4 d6": "King's Gambit Declined",
    "e4 e5 Nc3": "Vienna Game",
    "e4 e5 Nc3 Nf6": "Vienna Game: Falkbeer Variation",
    "e4 e5 Nc3 Nf6 g3": "Vienna Game: Mieses Variation",
    "e4 e5 d3": "King's Indian Attack",
    "e4 e5 d4": "Center Game",
    "e4 e5 d4 exd4 Qxd4": "Center Game: Danish Gambit",
    
    // Sicilian Defense
    "e4 c5": "Sicilian Defense",
    "e4 c5 Nf3": "Sicilian Defense: Open",
    "e4 c5 c3": "Sicilian Defense: Alapin Variation",
    "e4 c5 d4": "Sicilian Defense: Smith-Morra Gambit",
    "e4 c5 Nc3": "Sicilian Defense: Closed",
    "e4 c5 f4": "Sicilian Defense: Grand Prix Attack",
    "e4 c5 b3": "Sicilian Defense: Nimzowitsch-Rossolimo Attack",
    "e4 c5 g3": "Sicilian Defense: Fianchetto Variation",
    "e4 c5 d3": "Sicilian Defense: King's Indian Attack",
    
    // French Defense
    "e4 e6": "French Defense",
    "e4 e6 d4": "French Defense: Advance Variation",
    "e4 e6 d3": "French Defense: King's Indian Attack",
    "e4 e6 c4": "French Defense: Franco-Hiva Gambit",
    "e4 e6 Nf3": "French Defense: Two Knights",
    "e4 e6 d4 d5": "French Defense: Main Line",
    "e4 e6 d4 d5 e5": "French Defense: Advance Variation",
    "e4 e6 d4 d5 Nd2": "French Defense: Tarrasch",
    "e4 e6 d4 d5 Nc3": "French Defense: Classical",
    "e4 e6 d4 d5 Nf3": "French Defense: Two Knights",
    "e4 e6 d4 d5 exd5 exd5 Bd3": "French Defense: Exchange Variation",
    
    // Caro-Kann Defense
    "e4 c6": "Caro-Kann Defense",
    "e4 c6 d4": "Caro-Kann Defense: Main Line",
    "e4 c6 c4": "Caro-Kann Defense: Panov-Botvinnik Attack",
    "e4 c6 Nf3": "Caro-Kann Defense: Two Knights",
    "e4 c6 d3": "Caro-Kann Defense: King's Indian Attack",
    "e4 c6 g3": "Caro-Kann Defense: Fianchetto Variation",
    
    // Pirc Defense and Modern Defense
    "e4 d6": "Pirc Defense",
    "e4 g6": "Modern Defense",
    "e4 d6 d4": "Pirc Defense",
    "e4 g6 d4": "Modern Defense",
    "e4 d6 d4 Nf6": "Pirc Defense: Classical",
    "e4 g6 d4 Bg7": "Modern Defense: Robatsch Defense",
    
    // Scandinavian Defense
    "e4 d5": "Scandinavian Defense",
    "e4 d5 exd5": "Scandinavian Defense: Main Line",
    "e4 d5 Nf3": "Scandinavian Defense: Gambit",
    
    // Alekhine's Defense
    "e4 Nf6": "Alekhine's Defense",
    "e4 Nf6 e5": "Alekhine's Defense: Chase Variation",
    "e4 Nf6 d3": "Alekhine's Defense: King's Indian Attack",
    
    // Nimzowitsch Defense
    "e4 Nc6": "Nimzowitsch Defense",
    "e4 Nc6 d4": "Nimzowitsch Defense: Main Line",
    
    // Dutch Defense
    "d4 f5": "Dutch Defense",
    "d4 d6": "Old Indian Defense",
    "d4 d5": "Queen's Gambit Declined",
    "d4 Nf6": "Indian Game",
    "d4 d5 c4": "Queen's Gambit",
    "d4 d5 Nf3": "London System",
    "d4 Nf6 Nf3": "King's Indian Attack",
    "d4 f5": "Dutch Defense",
    "d4 g6": "Modern Defense",
    "d4 Nc6": "Chigorin Defense",
    "d4 d6": "Old Indian Defense",
    "d4 e6": "Horwitz Defense",
    "d4 c5": "Benoni Defense",
    "d4 Nf6 c4": "Indian Game",
    "d4 f5 c4": "Dutch Defense",
    
    // English Opening
    "c4": "English Opening",
    "c4 c5": "English Opening: Symmetrical Variation",
    "c4 e5": "English Opening: Reversed Sicilian",
    "c4 Nf6": "English Opening: Anglo-Indian",
    "c4 g6": "English Opening: Botvinnik System",
    
    // Reti and Other Openings
    "Nf3": "Reti Opening",
    "Nf3 d5": "Reti Opening: Main Line",
    "Nf3 c5": "Reti Opening: Anglo-Slav",
    "Nf3 c5 c4": "Reti Opening: King's Indian Attack",
    "e4 e5 Nf3 Nc6 Bc4 Nd4": "Blackburne Shilling Gambit",
    "e4 c6 d4 d5 Nc3 dxe4 Nxe4 Nf6 Ng5 h6 Nxf7": "Witty Alien Gambit",
    "e4 e5 Nf3 Nf6 Nxe5 Nc6": "Stafford Gambit",
    "b3": "Nimzowitsch-Larsen Attack",
    "g3": "King's Fianchetto Opening",
    "f4": "Bird's Opening",
    "f4 d5": "Bird's Opening: Dutch Variation",
    "f4 e5": "From's Gambit",
    "b4": "Polish Opening",
    "b4 e5": "Polish Opening: Outflank Variation",
    "e3": "Van 't Kruijs Opening",
    "a3": "Anderssen's Opening",
    "h3": "Clemenz Opening",
    "h4": "Desprez Opening",
    "d3": "Mieses Opening",
    "c3": "Saragossa Opening",
    "Nc3": "Van Geet Opening",
    "g4": "Grob's Attack",
    "Na3": "Sodium Attack",
    "Nh3": "Amar Opening",
    "e3": "Van 't Kruijs Opening",
    "f3": "Barnes Opening",
    "a4": "Ware Opening",
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

    const handleStart = async () => {
        setProcessing(true);
        let games = [];
        const { maxGames, timeControls, oldestDate, newestDate } = filterParams || {
            maxGames: 1000,
            timeControls: { bullet: true, blitz: true, rapid: true, classical: true },
            oldestDate: null,
            newestDate: null,
        };
    
        if (inputMethod === 'lichess') {
            const data = await fetchLichessGames(opponentName, maxGames, timeControls, oldestDate, newestDate, opponentColor);
            games = data;
        } else if (inputMethod === 'chesscom') {
            const data = await fetchChessComGames(opponentName, maxGames, timeControls, oldestDate, newestDate, opponentColor);
            games = data.map(game => game.pgn); // Map the results to PGN format
        } else {
            games = importedGames;
        }
    
        setGamesCount(games.length);
        processGames(games);
    };



    
    const processGames = (games) => {
        console.log(4);
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
        console.log(5);
        const minProbability = filterParams ? filterParams.minProbability : 0.2; // Default to 0.2


        games.forEach((game, index) => {
            if (game){
            chess.loadPgn(game);
            chess.deleteComments();
            let moves = chess.history();
            movesList.push(moves);

            const valList = [];
            let triangle = String(moves[0]) + "*";
            valList.push(triangle);

            pgnList.push(chess.pgn());
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
        };
    });

        setThePgnList(pgnList); // Set the pgnList to the state variable thePgnList

        for (let j = 1; j <= 25; j++) {
            initialColnames.push("Line" + String(j));
        }
        console.log(6);

        const dataFrame = fullValList.map((row, index) => ({
            ...row.reduce((acc, val, i) => ({ ...acc, [initialColnames[i]]: val }), {}),
            Event: eventList[index],
            Site: siteList[index],
            White: whiteList[index],
            Black: blackList[index],
            WhiteResult1: resultList[index] === '1-0' ? 1 : 0,
            Date: dateList[index],
            WhiteElo: whiteEloList[index],
            BlackElo: blackEloList[index],
            Pgn: pgnList[index],
            GameID: index
        }));
        console.log("dataFrame");
        console.log(dataFrame);
        console.log(7);

        const filteredDF = dataFrame.filter(row => row[opponentColor] === opponentName);

        const moveProb1 = filteredDF.reduce((acc, row) => {
            acc[row.Line1] = (acc[row.Line1] || 0) + 1;
            return acc;
        }, {});
        const totalGames = filteredDF.length;

        filteredDF.forEach(row => {
            row.MoveProbability1 = moveProb1[row.Line1] / totalGames;
        });

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
        console.log("filteredDF");
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
        console.log("filteredDF");
        console.log(filteredDF);
        console.log(6);

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

        // Add #Games column
        const lineCounts = longDF.reduce((acc, row) => {
            acc[row.Line] = (acc[row.Line] || 0) + 1;
            return acc;
        }, {});

        longDF.forEach(row => {
            row['#Games'] = lineCounts[row.Line];
        });
        const filteredLongDF2 = longDF.filter(row => 
            (opponentColor === 'Black' && row.LineProbabilityB > minProbability) ||
            (opponentColor === 'White' && row.LineProbabilityW > minProbability)
        );

        //#
        // Calculate lower limit based on precision level
        let minGames = 1; // Default for At least 1
        if (precisionLevel === '10% of Games') {
            minGames = Math.ceil(totalGames / 10);
        } else if (precisionLevel === '3% of Games') {
            minGames = Math.ceil(totalGames / 35);
        }
        console.log("minGames");
        console.log(minGames);

        // Filter for lines with more than minGames played
        const filteredLongDFUnsorted = filteredLongDF2.filter(row => row.Line !== undefined && row['#Games'] > minGames);
        console.log("filteredLongDFUnsorted");
        console.log(filteredLongDFUnsorted);
        const filteredLongDF = filteredLongDFUnsorted.sort((a, b) => b.Ply - a.Ply);
        console.log("filteredLongDF");
        console.log(filteredLongDF);

        const sortedByLengthDF = filteredLongDFUnsorted.sort((a, b) => b.Line.length - a.Line.length);
        console.log("sortedByLengthDF");
        console.log(sortedByLengthDF);

        // Initialize a set to store lines that are not proper subsets
        let uniqueLinesStr = "//";

        // Filter out rows where Line is a proper subset of any other row
        const nonSubsetLongDF = sortedByLengthDF.filter(row => {
            if(uniqueLinesStr.includes( "//"+row.Line)){
                uniqueLinesStr += row.Line;
                uniqueLinesStr += "//";
                return false;}
            else{
                uniqueLinesStr += row.Line;
                uniqueLinesStr += "//";
                return true;
            }
        });
        console.log(7);

        console.log("nonSubsetLongDF");
        console.log(nonSubsetLongDF);

        const groupedByLine = nonSubsetLongDF.reduce((acc, row) => {
            if (!acc[row.Line]) {
                acc[row.Line] = {
                    Line: row.Line,
                    EVAL: !isNaN(row.EVAL) ? row.EVAL : -Infinity,
                    Ply: row.Ply,
                    WhiteResult: row.WhiteResult,
                    LineProbabilityB: row.LineProbabilityB,
                    LineProbabilityW: row.LineProbabilityW,
                    GameID: row.GameID,
                    GameIDs: [row.GameID]
                };
            } else {
                acc[row.Line].EVAL = Math.max(acc[row.Line].EVAL, !isNaN(row.EVAL) ? row.EVAL : -Infinity);
                acc[row.Line].Ply = Math.max(acc[row.Line].Ply, row.Ply);
                acc[row.Line].WhiteResult = Math.max(acc[row.Line].WhiteResult, row.WhiteResult);
                acc[row.Line].LineProbabilityB = Math.max(acc[row.Line].LineProbabilityB, row.LineProbabilityB);
                acc[row.Line].LineProbabilityW = Math.max(acc[row.Line].LineProbabilityW, row.LineProbabilityW);
                acc[row.Line].GameID = Math.max(acc[row.Line].GameID, row.GameID);
                acc[row.Line].GameIDs.push(row.GameID);
            }
            return acc;
        }, {});
        
        // Replace -Infinity back with NaN if no valid EVAL was found
        Object.values(groupedByLine).forEach(row => {
            if (row.EVAL === -Infinity) {
                row.EVAL = NaN;
            }
        });
        console.log("groupedByLine");
        console.log(groupedByLine);
        
        // Convert groupedByLine to an array and sort
        const groupedLongDF = Object.values(groupedByLine);
        const sortedLongDF = groupedLongDF.sort((a, b) => {
            if (opponentColor === "Black") {
                return b.EVAL - a.EVAL;
            } else {
                return a.EVAL - b.EVAL;
            }
        });
        
        // Consolidate LineProbability and drop irrelevant columns
        sortedLongDF.forEach(row => {
            if (opponentColor === "Black") {
                row.LineProbability = row.LineProbabilityB;
                delete row.LineProbabilityW;
                delete row.LineProbabilityB;
            } else {
                row.LineProbability = row.LineProbabilityW;
                delete row.LineProbabilityB;
                delete row.LineProbabilityW;
            }
        });
        
        console.log("sortedLongDF");
        console.log(sortedLongDF);
        
        const categorizedLines = categorizeLines(sortedLongDF, opponentColor);
        setFilteredData(categorizedLines);

        const commonLines = findCommonLines(movesList);
        setCommonLines(commonLines);

        evaluateAndAnnotateGames(sortedLongDF, pgnList); // Pass pgnList as an argument
    };

    const evaluateAndAnnotateGames = async (minimalGroupedDF, pgnList) => {
        const chess = new Chess();
        const evaluatedGames = [];
        const maxPly = Math.max(...minimalGroupedDF.map(row => row.Ply));
        console.log("maxPly");
        console.log(maxPly);

        const uniqueGameIDs = [...new Set(minimalGroupedDF.map(row => row.GameID))];
        console.log(uniqueGameIDs);
        for (let gameID = 0; gameID < pgnList.length; gameID++) {
            if (uniqueGameIDs.includes(gameID)) {
                const pgn = pgnList[gameID]; // Assuming all rows for the same game have the same PGN
                chess.loadPgn(pgn);
                const chess2 = new Chess();
                chess2.loadPgn(pgn);
                chess2.load("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", { preserveHeaders: true });
                const moves = chess.history();

                for (let i = 0; i < maxPly && i < moves.length; i++) {
                    chess2.move(moves[i]);
                    const fen = chess2.fen();
                    const origevaluation = await evaluatePosition(fen);
                    const evaluation = i%2==0?String(parseFloat(origevaluation)*(-1)):String(parseFloat(origevaluation));

                    chess2.setComment(evaluation);
                }

                evaluatedGames.push(chess2.pgn());
            } else {
                evaluatedGames.push(pgnList[gameID]);
            }

        }

        processEvaluatedGames(evaluatedGames, maxPly);
    };

    const processEvaluatedGames = (evaluatedPGNs, maxPly) => {
        const chess = new Chess();
        const movesList = [];
        const fullValList = [];
        const eventList = [];
        const siteList = [];
        const whiteList = [];
        const blackList = [];
        const resultList = [];
        const dateList = [];
        const whiteEloList = [];
        const blackEloList = [];
        const initialColnames = [];
        chess.loadPgn(evaluatedPGNs[0]);


        evaluatedPGNs.forEach((pgn, index) => {
            console.log("pgn");
            console.log(pgn);
            try{
            chess.loadPgn(pgn);
            console.log('a')
            let moves = chess.history();
            console.log('b')

            movesList.push(moves);
            console.log('c')
            const commentsWithFens = chess.getComments();
            const comments = commentsWithFens.map(item => item.comment);

            const valList = [];
            let triangle = String(moves[0]) + "*";
            valList.push(triangle);
            valList.push(parseFloat(comments[0]));

            eventList.push(chess.header()["Event"]);
            siteList.push(chess.header()["Site"]);
            whiteList.push(chess.header()["White"]);
            blackList.push(chess.header()["Black"]);
            resultList.push(chess.header()["Result"]);
            dateList.push(chess.header()["Date"]);
            whiteEloList.push(chess.header()["WhiteElo"]);
            blackEloList.push(chess.header()["BlackElo"]);

            for (let i = 1; i < maxPly && i < moves.length; i++) {
                triangle += String(moves[i]) + "*";
                valList.push(triangle);
                valList.push(parseFloat(comments[i]));
            }
            fullValList.push(valList);
        }catch(error){
            fullValList.push([]);
            eventList.push("");
            siteList.push("");
            whiteList.push("");
            blackList.push("");
            resultList.push("");
            dateList.push("");
            whiteEloList.push("");
            blackEloList.push("");}
        });

        console.log("fullValList");
        console.log(fullValList);
        console.log("fullValList");
        console.log(fullValList);

        for (let j = 1; j <= maxPly; j++) {
            initialColnames.push("Line" + String(j));
            initialColnames.push("EVAL" + String(j));
        }

        const dataFrame = fullValList.map((row, index) => ({
            ...row.reduce((acc, val, i) => ({ ...acc, [initialColnames[i]]: val }), {}),
            Event: eventList[index],
            Site: siteList[index],
            White: whiteList[index],
            Black: blackList[index],
            WhiteResult1: resultList[index] === '1-0' ? 1 : 0,
            Date: dateList[index],
            WhiteElo: whiteEloList[index],
            BlackElo: blackEloList[index],
            GameID: index
        }));

        console.log("dataFrame");
        console.log(dataFrame);

        const filteredDF = dataFrame.filter(row => row[opponentColor] === opponentName);

        const moveProb1 = filteredDF.reduce((acc, row) => {
            acc[row.Line1] = (acc[row.Line1] || 0) + 1;
            return acc;
        }, {});
        const totalGames = filteredDF.length;

        filteredDF.forEach(row => {
            row.MoveProbability1 = moveProb1[row.Line1] / totalGames;
        });

        for (let i = 1; i < maxPly; i++) {
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

        filteredDF.forEach(row => {
            let pw = 1;
            let pb = 1;
            for (let i = 1; i <= maxPly; i++) {
                if (i % 2 === 1) {
                    pw *= row[`MoveProbability${i}`] || 1;
                } else {
                    pb *= row[`MoveProbability${i}`] || 1;
                }
                row[`LineProbability(W)${i}`] = pw;
                row[`LineProbability(B)${i}`] = pb;
            }
        });

        const longDF = [];
        filteredDF.forEach(row => {
            for (let i = 1; i <= maxPly; i++) {
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

        // Add #Games column
        const lineCounts = longDF.reduce((acc, row) => {
            acc[row.Line] = (acc[row.Line] || 0) + 1;
            return acc;
        }, {});

        longDF.forEach(row => {
            row['#Games'] = lineCounts[row.Line];
        });

        // Calculate lower limit based on precision level
        let minGames = 1; // Default for At least 1
        if (precisionLevel === '10% of Games') {
            minGames = Math.ceil(totalGames / 10);
        } else if (precisionLevel === '3% of Games') {
            minGames = Math.ceil(totalGames / 35);
        }
        console.log("minGames");
        console.log(minGames);

        // Filter for lines with more than minGames played
        const filteredLongDFUnsorted = longDF.filter(row => row['#Games'] > minGames);
        console.log("filteredLongDFUnsorted");
        console.log(filteredLongDFUnsorted);
        const filteredLongDF = filteredLongDFUnsorted.sort((a, b) => b.Ply - a.Ply);
        console.log("filteredLongDF");
        console.log(filteredLongDF);

        const groupedByLine = filteredLongDF.reduce((acc, row) => {
            if (!acc[row.Line]) {
                acc[row.Line] = {
                    Line: row.Line,
                    EVAL: !isNaN(row.EVAL) ? row.EVAL : -Infinity,
                    Ply: row.Ply,
                    WhiteResult: row.WhiteResult,
                    LineProbabilityB: row.LineProbabilityB,
                    LineProbabilityW: row.LineProbabilityW,
                    GameIDs: [row.GameID]
                };
            } else {
                acc[row.Line].EVAL = Math.max(acc[row.Line].EVAL, !isNaN(row.EVAL) ? row.EVAL : -Infinity);
                acc[row.Line].Ply = Math.max(acc[row.Line].Ply, row.Ply);
                acc[row.Line].WhiteResult = Math.max(acc[row.Line].WhiteResult, row.WhiteResult);
                acc[row.Line].LineProbabilityB = Math.max(acc[row.Line].LineProbabilityB, row.LineProbabilityB);
                acc[row.Line].LineProbabilityW = Math.max(acc[row.Line].LineProbabilityW, row.LineProbabilityW);
                acc[row.Line].GameIDs.push(row.GameID);
            }
            return acc;
        }, {});
        
        // Replace -Infinity back with NaN if no valid EVAL was found
        Object.values(groupedByLine).forEach(row => {
            if (row.EVAL === -Infinity) {
                row.EVAL = NaN;
            }
        });
        
        console.log("groupedByLine");
        console.log(groupedByLine);

        // Convert groupedByLine to an array and sort
        const groupedLongDF = Object.values(groupedByLine);
        const sortedLongDF = groupedLongDF.sort((a, b) => {
            if (opponentColor === "Black") {
                return b.EVAL - a.EVAL;
            } else {
                return a.EVAL - b.EVAL;
            }
        });

        // Consolidate LineProbability and drop irrelevant columns
        sortedLongDF.forEach(row => {
            if (opponentColor === "Black") {
                row.LineProbability = row.LineProbabilityB;
                delete row.LineProbabilityW;
                delete row.LineProbabilityB;
            } else {
                row.LineProbability = row.LineProbabilityW;
                delete row.LineProbabilityB;
                delete row.LineProbabilityW;
            }
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
    
        const categorizedLines = categorizeLines(nonSubsetLongDF, opponentColor);
        setFilteredData(categorizedLines);

        const commonLines = findCommonLines(movesList);
        setCommonLines(commonLines);
        setProcessing(false); // Stop processing
    };
    const evaluatePosition = (fen) => {
        return new Promise((resolve) => {
            stockfish.postMessage(`position fen ${fen}`);
            stockfish.postMessage("go depth 16");

            stockfish.onmessage = (event) => {
                const line = event.data;
                const depthMatch = line.match(/depth (\d+)/);
                const evalMatch = line.match(/score cp (-?\d+)/);

                if (depthMatch && evalMatch) {
                    const depth = parseInt(depthMatch[1], 10);
                    if (depth === 15) {
                        const evaluation = (parseInt(evalMatch[1], 10) / 100).toFixed(2);
                        resolve(evaluation);
                    }
                }
            };
        });
    };

    const createPgnFromGameIDs = (gameIDs, pgnList) => {
        return gameIDs.map(id => pgnList[id]).join('\n\n');
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
    
    

    const categorizeLines = (finalLongDF, opponentColor) => {
        return finalLongDF.map(row => {
            const evalColumn = "EVAL";
            const evaluation = row[evalColumn];

            if (opponentColor === "Black") {
                if (evaluation >= 2) {
                    row.MistakeType = "Fatal Blunder";
                } else if (evaluation >= 1.0) {
                    row.MistakeType = "Major Mistake";
                } else if (evaluation >= 0.6) {
                    row.MistakeType = "Slight Inaccuracy";
                } else {
                    row.MistakeType = "None";
                }
            } else {
                if (evaluation <= -1.6) {
                    row.MistakeType = "Fatal Blunder";
                } else if (evaluation <= -0.6) {
                    row.MistakeType = "Major Mistake";
                } else if (evaluation <= -0.2) {
                    row.MistakeType = "Slight Inaccuracy";
                } else {
                    row.MistakeType = "None";
                }
            }

            return row;
        }).filter(row => row.MistakeType !== "None" && row.LineProbability > 0.2);
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

    const toggleDropdown = (dropdown) => {
        setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
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

    return (
        <div className="blunder-punisher">
            <header>
                <nav>
                    <ul>
                        <li onMouseEnter={() => setIsLogoHovered(true)}
                            onMouseLeave={() => setIsLogoHovered(false)}>
                            <Link to="/">
                                <img src={isLogoHovered ? logoWhite : logo} alt="Home" style={{ height: '39px' }} />
                            </Link>
                        </li>
                        <li><Link to="/blunder-punisher" className="prepare-link">Blunder Punisher</Link></li>
                        <li><Link to="/weakness-finder">Weakness Finder</Link></li>
                        <li><Link to="/analysis-board">Analysis Board</Link></li>
                        <li><Link to="/about-player">About Player</Link></li>
                    </ul>
                </nav>
            </header>
            <main>
                <section className="hero4">
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
    <h1 className="title" style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>Blunder Punisher</h1>
    <p style={{ fontStyle: 'italic', fontSize: 20, marginLeft: 'auto' }}>Punish your opponent's mistakes!</p>
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
                                <label htmlFor="opponentName">Opponent Name:</label>
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
                                <label htmlFor="opponentUsername">Opponent Username:</label>
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
                                <label htmlFor="opponentUsername">Opponent Username:</label>
                                <input 
                                    type="text" 
                                    id="opponentUsername" 
                                    value={opponentName} 
                                    onChange={(e) => setOpponentName(e.target.value)} 
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="opponentColor">Opponent Color:</label>
                            <select 
                                id="opponentColor" 
                                value={opponentColor} 
                                onChange={(e) => setOpponentColor(e.target.value)}
                            >
                                <option value="White">White</option>
                                <option value="Black">Black</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="precisionLevel">Min Mistake Frequency:</label>
                            <select 
                                id="precisionLevel" 
                                value={precisionLevel} 
                                onChange={(e) => setPrecisionLevel(e.target.value)}
                            >
                                <option value="10% of Games">10% of Games (5s-1min)</option>
                                <option value="3% of Games">3% of Games (30s-4min)</option>
                                <option value="At Least 1 Game">At Least 1 Game (1-30min)</option>
                            </select>
                        </div>
                        
                        <button onClick={handleStart} className="spec-button" style={{marginTop:6.5, marginLeft:10}}>Start</button>
                        <button onClick={handleReset}  className="spec-button" style={{marginTop:6.5, marginLeft:10}} >Reset</button>
                    </div>
                    {processing && <p>Please wait, do not refresh or close the tab...</p>}
                    
                    {processing ? (
                        <div className="common-lines">
                        </div>
                    ) : (
                        <div>
                            <p>Total Games: {gamesCount}</p>
                        <div className="dropdown-container">
                            <div className="dropdown">
                                <button onClick={() => toggleDropdown('Fatal Blunders')}>
                                    Fatal Blunders: ({filteredData.filter(line => line.MistakeType === 'Fatal Blunder').length})
                                </button>
                                {activeDropdown === 'Fatal Blunders' && (
                                    <ul>
                                        {filteredData.filter(line => line.MistakeType === 'Fatal Blunder').map((line, index) => (
                                            <li key={index} className='line-item' onClick={() => handleLineClick(line.GameIDs)}>
                                            {formatMovesWithNumbers(line)}
                                            <p>Evaluation: {Math.round(line.EVAL * 100) / 100} w/ Trap Probability: {Math.round(line.LineProbability * 100)}%</p>
                                        </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            <div className="dropdown">
                                <button onClick={() => toggleDropdown('Major Mistakes')}>
                                    Major Mistakes: ({filteredData.filter(line => line.MistakeType === 'Major Mistake').length})
                                </button>
                                {activeDropdown === 'Major Mistakes' && (
                                    <ul>
                                        {filteredData.filter(line => line.MistakeType === 'Major Mistake').map((line, index) => (
                                           <li key={index} className='line-item' onClick={() => handleLineClick(line.GameIDs)}>
                                           {formatMovesWithNumbers(line)}
                                           <p>Evaluation: {Math.round(line.EVAL * 100) / 100} w/ Trap Probability: {Math.round(line.LineProbability * 100)}%</p>
                                           </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            <div className="dropdown">
                                <button onClick={() => toggleDropdown('Slight Inaccuracies')}>
                                    Slight Inaccuracies: ({filteredData.filter(line => line.MistakeType === 'Slight Inaccuracy').length})
                                </button>
                                {activeDropdown === 'Slight Inaccuracies' && (
                                    <ul>
                                        {filteredData.filter(line => line.MistakeType === 'Slight Inaccuracy').map((line, index) => (
                                           <li key={index} className='line-item' onClick={() => handleLineClick(line.GameIDs)}>
                                           {formatMovesWithNumbers(line)}
                                           <p>Evaluation: {Math.round(line.EVAL * 100) / 100} w/ Trap Probability: {Math.round(line.LineProbability * 100)}%</p>
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
                <p>&copy; 2024 CheckmateWizard.com All rights reserved.</p>
            </footer>
        </div>
    );
};

export default BlunderPunisher;
