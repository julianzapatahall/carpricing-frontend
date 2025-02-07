import React, { Component } from "react";
import axios from 'axios';
import PropTypes from "prop-types";
import { Chess } from "chess.js";
//import { Chessboard } from 'react-chessboard';

import EditBoard from "./EditBoard";
import Chessboard from "chessboardjsx";

const STOCKFISH = window.STOCKFISH;
const game = new Chess();

// Debounce utility to delay Stockfish evaluations
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}


class AnalysisBoard extends Component {
  static propTypes = {
    children: PropTypes.func,
    fen: PropTypes.string,
    pgn: PropTypes.string,
  };
  
  state = {
    orientation: "white",
    evaluation: "",
    bestLine: "",
    currentPly: 0,
    future: [],
    ply0Game:true,
    showEvaluation: false,
    moveHistory: [],
    fullGame: [],
    importedGames: JSON.parse(localStorage.getItem('importedGames')) || [],
    showDropdown: false,
    selectedGame: null,
    gamesDetails: [],
    showEditBoard: false,
    fen: this.props.fen || 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    startFen: this.props.fen || 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    fileInputKey: Date.now(), // To reset the file input
    showImportTabs: false,
    inputMethod: 'chesscom',
    opponentName: '',
    topLines: Array(3).fill(""),
    topEvaluations: Array(3).fill(""),
    showEvaluation: false
  };

  componentDidMount() {
    const combinedPgn = localStorage.getItem('combinedPgn');
    if (combinedPgn) {
      this.processCombinedPgn(combinedPgn);
      localStorage.removeItem('combinedPgn');
      this.future = [];
    } else if (this.props.pgn) {
      game.loadPgn(this.props.pgn);
      this.future = [];
      this.moveHistory = game.history();
      this.fullGame = this.moveHistory.concat(this.future);
      this.importedGames = [];
    } else {
      game.reset();
      this.future = [];
      this.moveHistory = [];
      this.fullGame = [];
      this.setState({ fen: this.props.fen });
    }
  
    // Initialize the debounced function for preparing moves
    this.debouncedPrepareMove = debounce(this.engineGame().prepareMove, 300);
  
    this.engineGame().prepareMove();
    document.addEventListener("keydown", this.handleKeyDown);
  }
  
  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyDown);
  }
  

  processCombinedPgn(combinedPgn) {
    const rawGames = combinedPgn.split(/\[Event/gi).filter(Boolean);
    const games = rawGames.map(game => '[Event' + game.trim());
  
    const details = games.map(pgn => {
        const game = new Chess();
        game.loadPgn(pgn);
        const headers = game.header();
        let link = ''; // Add link based on the site
        if (headers.Site && headers.Site.includes('lichess.org')) {
            link = headers.Site; // Use the Lichess URL from the PGN header

        } else if (headers.Link && headers.Site.includes('Chess.com')) {
            link = headers.Link; // Use the Chess.com URL from the PGN header
        }
        return {
            pgn: pgn,
            details: `${headers.White} vs ${headers.Black}, ${headers.Result}, ${headers.Date}`,
            link: link, // Add the link to the game details
        };
    });
  
    this.setState({
        importedGames: details,
        selectedGame: null,
        showDropdown: true,
        fen: this.props.fen || "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
      });
  
    localStorage.setItem('importedGames', JSON.stringify(details));
  }
  
  handleKeyDown = (event) => {
    switch (event.key) {
      case "ArrowRight":
        this.goToNextMove();
        break;
      case "ArrowLeft":
        this.goToPreviousMove();
        break;
      case "ArrowDown":
        this.goToStart();
        break;
      case "ArrowUp":
        this.goToEnd();
        break;
      default:
        break;
    }
  };
  

  handleGameSelect = (pgn) => {
    console.log("handleGameSelect");
    this.setState({selectedGame:pgn});
  };
fetchLichessGames = async (username) => {
    const response = await fetch(`https://lichess.org/api/games/user/${username}?max=1000&moves=true&pgnInJson=false`);
    const data = await response.text(); // Get the response as text (PGN format)
    return data;
};


fetchChessComGames = async (username, maxGames = 1000) => {
  const fetchGamesBatch = async (archiveUrl) => {
      try {
          const response = await fetch(archiveUrl);
          if (!response.ok) {
              const errorText = await response.text();
              throw new Error(`Error fetching data: ${response.statusText} - ${errorText}`);
          }

          const data = await response.json();
          return data.games;
      } catch (error) {
          console.error('Error fetching games batch:', error.message);
          return []; // Return an empty array if there's an error
      }
  };

  try {
      // Fetch the archives (list of months)
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

  handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      return;
    }
  
    const reader = new FileReader();
    reader.onload = (e) => {
      const fullPgn = e.target.result;
      let rawGames = fullPgn.split(/\[Event/gi).filter(Boolean);
      let games = rawGames.map((game, index) => {
        return ('[Event' + game).trim();
      });
      const details = games.map(pgn => {
        const chess = new Chess();
        chess.loadPgn(pgn);
        const headers = chess.header();
        return {
          pgn: pgn,
          details: `${headers.White} vs ${headers.Black}, ${headers.Result}, ${headers.Date}`
        };
      });
  
      this.setState({
        importedGames: [...this.state.importedGames, ...details],
        selectedGame: null,
        fileInputKey: Date.now() // Reset the file input
      });
      localStorage.setItem('importedGames', JSON.stringify([...this.state.importedGames, ...details]));
    };
    reader.readAsText(file);
  };
  

  handleRemoveFile = () => {
    this.setState({
      importedGames: [],
      selectedGame: null,
      fileInputKey: Date.now() // Reset the file input
    });
    localStorage.removeItem('importedGames');
  };

  displayGameDetails = (pgn) => {
    const chess = new Chess();
    chess.loadPgn(pgn);
    const headers = chess.header();
    console.log(headers.Link);
    return `${headers.White} vs ${headers.Black}, ${headers.Result}, ${headers.Date}`;
  };

  handleFlipBoard = () => {
    this.setState(({ orientation }) => ({
      orientation: orientation === 'white' ? 'black' : 'white',
    }));
  };

  

  handleAddLichessGames = async () => {
    const { opponentName, importedGames } = this.state;
    const data = await this.fetchLichessGames(opponentName);
    let rawGames = data.split(/\[Event/gi).filter(Boolean);
    const games = rawGames.map(game => '[Event' + game.trim());
  
    this.setState({
      importedGames: [...importedGames, ...games.map(pgn => ({ pgn, details: this.displayGameDetails(pgn) }))],
      showImportTabs: false,
    });
  };

  
  handleAddChessComGames = async () => {
    const { opponentName, importedGames } = this.state;
    const data = await this.fetchChessComGames(opponentName);
    let games = data.map(game => game.pgn);
    games = games.filter(function( element ) {
      return element !== undefined;
   });
    
    this.setState({
      importedGames: [...importedGames, ...games.map(pgn => ({ pgn, details: this.displayGameDetails(pgn) }))],
      showImportTabs: false,
    });
  };

  
  downloadCombinedPgn = () => {
    const { importedGames } = this.state;
    const combinedPgn = importedGames.map(game => game.pgn).join('\n\n');
    
    const blob = new Blob([combinedPgn], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    
    // Suggest a default filename
    a.download = 'imported_games.pgn';
    
    document.body.appendChild(a);
    a.click();  // This triggers the "Save As" dialog in most browsers
    
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
};

  

  handleResetBoard = () => {
    console.log('Mistake');
    game.reset();
    this.setState(({ fen: game.fen() , selectedGame: null}));
    this.future = [];
    this.moveHistory = [];
    this.fullGame = [];
    this.state.currentPly=0;
    this.engineGame().prepareMove();
  };

  toggleStockfishEvaluation = () => {
    this.setState(prevState => ({
      showEvaluation: !prevState.showEvaluation
    }));
  };


  goToEnd = () => {
    if (game.fen()!=this.state.fen) {
      game.reset();
    }
    console.log(game.fen());
    console.log(game.history());
    const moves = game.history();
    const tmp = new Chess();
    tmp.load(this.state.startFen);
    const previous = moves.length + this.future.length - 1;
    if (previous >= 0) {
      if (moves.length > 0) {
        for (var i = 0; i < moves.length; i += 1) {
          tmp.move(moves[i]);
        }
      }

      if (this.future.length - 1 >= 0) {
        for (var i = 0; i < this.future.length; i += 1) {
          tmp.move(this.future[i]);
        }
        const previous_fen = tmp.fen();
        const previous_pgn = tmp.pgn();
        this.future = [];
        game.load(previous_fen);
        game.loadPgn(previous_pgn);
        this.setState(({ fen: game.fen() }));
        this.moveHistory = game.history();
        this.setState({currentPly: this.state.ply0Game?this.moveHistory.length:this.moveHistory.length+1});
        // Stop the current evaluation
  this.engineGame().stopEvaluation();

  // Prepare a new evaluation using the debounced function
  this.debouncedPrepareMove();
        
        
        
      } else {
        return;
      }
    } else {
      return;
    }
  };

  goToNextMove = () => {
    if (game.fen()!=this.state.fen) {
      game.reset();
    }
    console.log("goToNextMove");
    if (this.future.length > 0) {
      console.log("game.fen()");
      console.log(game.fen());
      game.move(this.future[0]);
      this.setState(({ fen: game.fen() }));
      this.future.shift();
      this.moveHistory = game.history();
      this.setState({currentPly: this.state.ply0Game?this.moveHistory.length:this.moveHistory.length+1});
      // Stop the current evaluation
  this.engineGame().stopEvaluation();

  // Prepare a new evaluation using the debounced function
  this.debouncedPrepareMove();
      
    }
    return;
  };

  goToPreviousMove = () => {
    console.log("game.history()")
    console.log(game.history())
    const moves = this.moveHistory; 
    const tmp = new Chess();
    tmp.load(this.state.startFen);
    const previous = moves.length - 1;
    if (previous >= 0) {
      for (var i = 0; i < previous; i += 1) {
        tmp.move(moves[i]);
      }
      const previous_fen = tmp.fen();

      const previous_pgn = tmp.pgn();
      this.future.unshift(moves[previous]);
      tmp.move(moves[previous]);
      game.load(previous_fen);
      game.loadPgn(previous_pgn);
      this.setState({ fen: previous_fen });
      this.moveHistory = game.history();
      this.setState({currentPly: this.state.ply0Game?this.moveHistory.length:this.moveHistory.length+1});
      // Stop the current evaluation
  this.engineGame().stopEvaluation();

  // Prepare a new evaluation using the debounced function
  this.debouncedPrepareMove();
      
    }
    return;
  };

  goToStart = () => {
    const moves = this.moveHistory; 
    const tmp = new Chess();
    tmp.load(this.state.startFen);
    const previous_fen = tmp.fen();
    const previous_pgn = tmp.pgn();
    const previous = moves.length - 1;
    if (previous >= 0) {
      for (var i = 0; i < previous; i += 1) {
        tmp.move(moves[i]);
      }
      this.future.unshift(...moves);
      game.load(previous_fen);
      game.loadPgn(previous_pgn);
      this.setState(({ fen: game.fen() }));
      this.moveHistory = [];
      this.setState({currentPly: this.state.ply0Game?this.moveHistory.length:this.moveHistory.length+1});
      // Stop the current evaluation
  this.engineGame().stopEvaluation();

  // Prepare a new evaluation using the debounced function
  this.debouncedPrepareMove();
      
    }
    return;
  };
  

  toggleDropdown = () => {
    this.setState((prevState) => ({
      showDropdown: !prevState.showDropdown,
    }));
  };
  

  goToMove = (moveIndex) => {
    const moves = this.fullGame;
    const tmp = new Chess();

    for (let i = 0; i <= moveIndex; i++) {
      tmp.move(moves[i]);
    }

    const previous_fen = tmp.fen();
    const previous_pgn = tmp.pgn();
    game.loadPgn(previous_pgn);
    this.setState({ fen: previous_fen });

    const newMoveHistory = tmp.history();
    this.moveHistory = newMoveHistory;
    this.future = moves.slice(moveIndex + 1);
    this.setState({currentPly: this.state.ply0Game?this.moveHistory.length:this.moveHistory.length+1});
    // Stop the current evaluation
  this.engineGame().stopEvaluation();

  // Prepare a new evaluation using the debounced function
  this.debouncedPrepareMove();
    
  };

  componentDidUpdate(prevProps, prevState) {
    console.log("componentDidUpdate");
    if (prevState.selectedGame !== this.state.selectedGame && this.state.selectedGame) {
      console.log("true");
    const game = new Chess();
    game.loadPgn(this.state.selectedGame);
    //this.future = tmp.history();
    this.future = game.history();
    this.moveHistory = [];
    this.fullGame = game.history();
    game.reset();
    this.state.fen = game.fen();
    console.log("after reset");
    console.log(game.fen());
    this.setState({ fen:game.fen(), currentPly:0});
    console.log("after reset");
    console.log(game.fen());
    this.engineGame().prepareMove();
      
    }
    if (prevProps.pgn !== this.props.pgn && this.props.pgn) {
      console.log('Mistake');
      game.reset();
      game.loadPgn(this.props.pgn);
      this.engineGame().prepareMove();
      this.setState({ fen: game.fen(), currentPly: 1, future: [] });
      this.moveHistory = game.history();
      
    }
  }

  engineGame = (options) => {
    console.log(this.state.fen);
    options = options || {};
  
    let engine = typeof STOCKFISH === "function" ? STOCKFISH() : new Worker(options.stockfishjs || "stockfish.js");
  
    // Error handling for the worker
    engine.onerror = (error) => {
      console.error('Worker Error:', error.message);
  
      // Send error to the main thread
      engine.postMessage({
        type: 'error',
        message: error.message || 'An error occurred in the Stockfish engine.',
      });
    };
  
    engine.postMessage("uci");
  
    engine.onmessage = (event) => {
      if (event && event.data) {
        if (event.data.type === 'error') {
          // Handle the error in the main thread
          displayErrorBanner(event.data.message);
          return;
        }
  
        let line = event.data;
        // Extract the line based on multipv value
        this.extractTopLines(line);
  
        const allTopLinesPresent = this.state.topLines.filter(Boolean).length === 3;
      }
    };
    
  
    const displayErrorBanner = (errorMessage) => {
      const existingBanner = document.querySelector('.error-banner');
      if (!existingBanner) {
        // Create a red banner
        const banner = document.createElement('div');
        banner.className = 'error-banner';
        banner.innerHTML = `
          <p>${errorMessage}</p>
        `;
  
        document.body.appendChild(banner);
  
        // Reload the page after 3 seconds
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      }
    };
  
    return { 
      prepareMove: () => {
        engine.postMessage("position fen " + this.state.fen);
        engine.postMessage("setoption name MultiPV value 3");
        engine.postMessage("go depth 17");
      },
      stopEvaluation: () => {
        engine.postMessage("stop");
      },
    };
  };
  
  
  

  handleEditBoard = () => {
    this.setState(prevState => ({
      showEditBoard: !prevState.showEditBoard
    }));
  };

  updateFenAndCloseEdit = (newFen) => {
    console.log('Mistake');
    game.reset();
    game.load(newFen);
    const parts = newFen.split(' ');
    const isWhitesTurn = parts[1] === 'w';
    this.setState({
      fen: newFen,
      showEditBoard: false,
      currentPly: isWhitesTurn ? 0 : 1,
      ply0Game:isWhitesTurn? true: false,
      startFen:newFen,
      selectedGame:null
    });
    this.future = [];
    this.moveHistory = [];
    this.fullGame = [];
    this.engineGame().prepareMove();
  };

  onDrop = ({ sourceSquare, targetSquare }) => {
    const legalMoves = game.moves({ verbose: true });
    const move = legalMoves.find(
      (move) => move.from === sourceSquare && move.to === targetSquare
    );

    if (!move) {
      console.log("Illegal move");
      return;
    }
    if (move.san === this.future[0]) {
      this.future.shift();
    } else {
      this.future = [];
    }

    game.move({ from: sourceSquare, to: targetSquare, promotion: "q" });
    this.moveHistory = game.history();
    this.setState({currentPly: this.state.ply0Game?this.moveHistory.length:this.moveHistory.length+1});
    this.fullGame = this.moveHistory.concat(this.future);
    this.setState((prevState) => ({
      fen: game.fen()
    }));

    // Cancel the current evaluation
    this.engineGame().stopEvaluation();

    // Prepare a new evaluation using the debounced function
    this.debouncedPrepareMove();
  };
  
  

  extractEvaluation = (line) => {
    const mateEvalMatch = line.match(/score mate (-?\d+)/);
    const evalMatch = line.match(/score cp (-?\d+)/);
  
    if (game.isCheckmate()) {
      return game.turn() === "w" ? "Mate on the board! Black wins!" : "Mate on the board! White wins!";
    }
  
    if (mateEvalMatch) {
      const evaluation = parseInt(mateEvalMatch[1], 10);
      if (evaluation > 0) {
        return game.turn() === "b" ? `Black Mate in ${evaluation}` : `White Mate in ${evaluation}`;
      }
      return game.turn() === "w" ? `Black Mate in ${-evaluation}` : `White Mate in ${-evaluation}`;
    }
  
    if (evalMatch) {
      const evaluation = Math.round(parseInt(evalMatch[1]) * 0.01 * 100) / 100;
      if (evaluation >= 0) {
        return game.turn() === "b" ? -evaluation : `+${evaluation}`;
      }
      return game.turn() === "w" ? evaluation : `+${-evaluation}`;
    }
  
    return null;
  };
  


  

extractTopLines = (line) => {
  const currentPly = this.state.currentPly;
  const multipvMatch = line.match(/multipv\s+(\d+)/);
  const evaluation = this.extractEvaluation(line);
  const pvMatch = line.match(/pvSan (.*) bmc/);

  if (multipvMatch && pvMatch && evaluation) {
    const multipv = parseInt(multipvMatch[1], 10) - 1; // multipv is 1-indexed, make it 0-indexed
    const moves = pvMatch[1].trim().split(" ");
    const sanMoves = moves.map((move, index) => {
        const moveNumber = currentPly + index + 1; // Adjust the move number based on the current ply
        return moveNumber % 2 === 1
            ? `${Math.floor((moveNumber + 1) / 2)}.${move}`
            : `${Math.floor((moveNumber + 1) / 2)}...${move}`;
    });

    // Slice the sanMoves array to get only the first 8 moves
    const limitedSanMoves = sanMoves.slice(0, 16);

    // Store the line and evaluation in the state based on multipv
    this.setState(prevState => {
        const topLines = [...prevState.topLines];
        const topEvaluations = [...prevState.topEvaluations];

        topLines[multipv] = limitedSanMoves.join(" ");
        topEvaluations[multipv] = evaluation;

        return {
            topLines,
            topEvaluations
        };
    });
}

};


  
  render() {
    const { fen, orientation, evaluation, bestLine, currentPly, future, showEvaluation, moveHistory, fullGame, importedGames, showDropdown, showEditBoard, fileInputKey, ply0Game, selectedGame,showImportTabs, 
      inputMethod,topLines, topEvaluations } = this.state;
    
    let headers = {};
    if (selectedGame) {
      const game = new Chess();
     game.loadPgn(selectedGame);
      headers = game.header();
    }
  
    const whiteResult = headers.Result === '1-0' ? 1 : (headers.Result === '1/2-1/2' ? 0.5 : 0);
    const blackResult = headers.Result === '0-1' ? 1 : (headers.Result === '1/2-1/2' ? 0.5 : 0);
  
    return (
      <div>
        <div className="analysis-toolkit" id="EditingOff" style={{ display: showEditBoard ? "none" : "block" }}>
          
          <div>
          {showImportTabs ? (
        <div className="import-tabs">
          <div className="tab-container" style={{width:"400px"}}>
            <div className="tab">
              <button className={inputMethod === 'chesscom' ? 'tablinks active' : 'tablinks'} onClick={() => this.setState({ inputMethod: 'chesscom' })}>Chess.com</button>
              <button className={inputMethod === 'lichess' ? 'tablinks active' : 'tablinks'} onClick={() => this.setState({ inputMethod: 'lichess' })}>Lichess</button>
              <button className={inputMethod === 'pgn' ? 'tablinks active' : 'tablinks'} onClick={() => this.setState({ inputMethod: 'pgn' })}>PGN</button>
            </div>

            <div className="tabcontent1" style={{ display: inputMethod === 'pgn' ? 'block' : 'none' }}>
              <div className="form-group">
                <input type="file" onChange={this.handleFileSelect} />
                <button onClick={() => this.setState({ showImportTabs: false })}>Add Game(s)</button>
              </div>
            </div>

            <div className="tabcontent1" style={{ display: inputMethod === 'lichess' ? 'block' : 'none' }}>
              <div className="form-group">
                <label htmlFor="opponentUsername">Lichess Username:</label>
                <input 
                  type="text" 
                  id="opponentUsername" 
                  value={this.state.opponentName} 
                  onChange={(e) => this.setState({ opponentName: e.target.value })} 
                />
                <button onClick={this.handleAddLichessGames}>Add Game(s)</button>
              </div>
            </div>

            <div className="tabcontent1" style={{ display: inputMethod === 'chesscom' ? 'block' : 'none' }}>
              <div className="form-group">
                <label htmlFor="opponentUsername">Chess.com Username:</label>
                <input 
                  type="text" 
                  id="opponentUsername" 
                  value={this.state.opponentName} 
                  onChange={(e) => this.setState({ opponentName: e.target.value })} 
                />
                <button onClick={this.handleAddChessComGames}>Add Game(s)</button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div>
          <div className="dropdown-header" onClick={this.toggleDropdown}>
            Imported Games: {importedGames.length}
          </div>
          {showDropdown && (
            <div className="games-list">
            {importedGames.length === 0 ? (
              <p>Click "Upload New Game(s)" to Import Games</p>
            ) : (
              <ul>
                {importedGames.map((game, index) => (
                  <li className="game-item" key={index} onClick={() => this.handleGameSelect(game.pgn)}>
                    {game.details}
                    {game.link && (
  <a href={game.link} target="_blank" rel="noopener noreferrer" className="clear-link">
    🔗
  </a>
)}


                  </li>
                ))}
              </ul>
            )}
          </div>
          )}
          </div>
          <div className="file-buttons">
  <button 
    className="upload-button" 
    onClick={() => this.setState({ showImportTabs: true })}
    style={{ backgroundColor: 'green', color: 'white', padding: '10px 15px', fontSize: '16px',position: 'absolute', marginTop: '386px' }}
  >
    Upload New Game(s)
  </button>
  <button 
    className="remove-file-button" 
    onClick={this.handleRemoveFile} 
    style={{ backgroundColor: 'red', color: 'white', padding: '10px 15px', fontSize: '16px', position: 'absolute',marginTop: '386px',marginLeft: '185px' }}
  >
    Clear Imported Game(s)
  </button>

  <button
  className="download-button"
  onClick={this.downloadCombinedPgn}
  style={{ backgroundColor: 'yellow', color: 'black', padding: '10px 86px', fontSize: '16px', position: 'absolute', marginTop: '427px',marginLeft: '0px' }}
>
  Download All Imported Games
</button>

  </div>
  </div>
      )}

          <div style={boardsContainer}>
            <div className="analysis-board-container" style={{ display: "block" }}>
              <Chessboard
                position={fen}
                width={520}
                pieces={customPieces({ squareWidth:65, isDragging: false })}
                onDrop={this.onDrop}
                orientation={orientation}
                boardStyle={boardStyle}
              />
            </div>
          </div>
          {selectedGame && (
  orientation === "white" ? (
    <div className="black-upper-info-bar">
      <span>{blackResult} {headers.Black} ({headers.BlackElo})</span>
    </div>
  ) : (
    <div className="white-upper-info-bar">
      <span>{whiteResult} {headers.White} ({headers.WhiteElo})</span>
    </div>
  )
)}

          <div className="move-history">
            <ul>
              {this.fullGame && this.fullGame.map((move, index) => (
                <li
                  key={index}
                  className={ply0Game ? (index === currentPly - 1 ? 'selected' : '') : (index === currentPly - 2 ? 'selected' : '')}
                  onClick={() => this.goToMove(index)}
                >
                  {ply0Game ? (
                    index % 2 === 0 ? `${index / 2 + 1}. ` : `${(index - 1) / 2 + 1}...`
                  ) : (
                    index % 2 === 0 ? `${index / 2 + 1}... ` : `${(index - 1) / 2 + 2}. `
                  )}
                  {move}
                </li>
              ))}
            </ul>
            
          </div>
          {selectedGame && (
  orientation === "white" ? (
    <div className="white-lower-info-bar">
      <span>{whiteResult} {headers.White} ({headers.WhiteElo})</span>
    </div>
    
  ) : (
    <div className="black-lower-info-bar">
      <span>{blackResult} {headers.Black} ({headers.BlackElo})</span>
    </div>
  )
)}

          <div className="control-panel">
            <button onClick={this.handleEditBoard}>Edit</button>
            <button onClick={this.handleFlipBoard}>Flip</button>
            <button onClick={this.handleResetBoard}>Reset</button>
            <button onClick={this.toggleStockfishEvaluation}>🐟</button>
            <button onClick={this.goToStart}>Start</button>
            <button onClick={this.goToPreviousMove}>⇦</button>
            <button onClick={this.goToNextMove}>⇨</button>
            <button onClick={this.goToEnd}>End</button>
            {showEvaluation && (
  <table>
    <thead>
      <tr>
        <th>Evaluation</th>
        <th>Line</th>
      </tr>
    </thead>
    <tbody style={{ fontSize: 13}}>
      {topEvaluations.map((evaluation, index) => (
        <tr key={index}>
          <td style={{ paddingBottom: '9px' }}>{evaluation}</td>
          <td style={{ paddingBottom: '9px' }}>{topLines[index]}</td>
        </tr>
      ))}
    </tbody>
  </table>
)}




          </div>
        </div>
        </div>
        {showEditBoard && (
          <div className="edit-board-container" id="EditingOn" style={{ display: "block" }}>
            <EditBoard in_fen={fen} updateFenAndClose={this.updateFenAndCloseEdit} />
          </div>
        )}
      </div>
    );
  }
}
export default AnalysisBoard;


const customPieces = ({ squareWidth, isDragging }) => ({
  wK: () => (
    <img
      style={{
        width: isDragging ? squareWidth * 1.75 : squareWidth,
        height: isDragging ? squareWidth * 1.75 : squareWidth
      }}
      src="https://upload.wikimedia.org/wikipedia/commons/4/42/Chess_klt45.svg"
      alt="White King"
    />
  ),
  wQ: () => (
    <img
      style={{
        width: isDragging ? squareWidth * 1.75 : squareWidth,
        height: isDragging ? squareWidth * 1.75 : squareWidth
      }}
      src="https://upload.wikimedia.org/wikipedia/commons/1/15/Chess_qlt45.svg"
      alt="White Queen"
    />
  ),
  wR: () => (
    <img
      style={{
        width: isDragging ? squareWidth * 1.75 : squareWidth,
        height: isDragging ? squareWidth * 1.75 : squareWidth
      }}
      src="https://upload.wikimedia.org/wikipedia/commons/7/72/Chess_rlt45.svg"
      alt="White Rook"
    />
  ),
  wB: () => (
    <img
      style={{
        width: isDragging ? squareWidth * 1.75 : squareWidth,
        height: isDragging ? squareWidth * 1.75 : squareWidth
      }}
      src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Chess_blt45.svg"
      alt="White Bishop"
    />
  ),
  wN: () => (
    <img
      style={{
        width: isDragging ? squareWidth * 1.75 : squareWidth,
        height: isDragging ? squareWidth * 1.75 : squareWidth
      }}
      src="https://upload.wikimedia.org/wikipedia/commons/7/70/Chess_nlt45.svg"
      alt="White Knight"
    />
  ),
  wP: () => (
    <img
      style={{
        width: isDragging ? squareWidth * 1.75 : squareWidth,
        height: isDragging ? squareWidth * 1.75 : squareWidth
      }}
      src="https://upload.wikimedia.org/wikipedia/commons/4/45/Chess_plt45.svg"
      alt="White Pawn"
    />
  ),
  bK: () => (
    <img
      style={{
        width: isDragging ? squareWidth * 1.75 : squareWidth,
        height: isDragging ? squareWidth * 1.75 : squareWidth
      }}
      src="https://upload.wikimedia.org/wikipedia/commons/f/f0/Chess_kdt45.svg"
      alt="Black King"
    />
  ),
  bQ: () => (
    <img
      style={{
        width: isDragging ? squareWidth * 1.75 : squareWidth,
        height: isDragging ? squareWidth * 1.75 : squareWidth
      }}
      src="https://upload.wikimedia.org/wikipedia/commons/4/47/Chess_qdt45.svg"
      alt="Black Queen"
    />
  ),
  bR: () => (
    <img
      style={{
        width: isDragging ? squareWidth * 1.75 : squareWidth,
        height: isDragging ? squareWidth * 1.75 : squareWidth
      }}
      src="https://upload.wikimedia.org/wikipedia/commons/f/ff/Chess_rdt45.svg"
      alt="Black Rook"
    />
  ),
  bB: () => (
    <img
      style={{
        width: isDragging ? squareWidth * 1.75 : squareWidth,
        height: isDragging ? squareWidth * 1.75 : squareWidth
      }}
      src="https://upload.wikimedia.org/wikipedia/commons/9/98/Chess_bdt45.svg"
      alt="Black Bishop"
    />
  ),
  bN: () => (
    <img
      style={{
        width: isDragging ? squareWidth * 1.75 : squareWidth,
        height: isDragging ? squareWidth * 1.75 : squareWidth
      }}
      src="https://upload.wikimedia.org/wikipedia/commons/e/ef/Chess_ndt45.svg"
      alt="Black Knight"
    />
  ),
  bP: () => (
    <img
      style={{
        width: isDragging ? squareWidth * 1.75 : squareWidth,
        height: isDragging ? squareWidth * 1.75 : squareWidth
      }}
      src="https://upload.wikimedia.org/wikipedia/commons/c/c7/Chess_pdt45.svg"
      alt="Black Pawn"
    />
  )
});




const boardStyle = {
  borderRadius: "5px",
  boxShadow: `0 5px 15px rgba(0, 0, 0, 0.5)`
};

const boardsContainer = {
  display: "flex",
  justifyContent: "space-around",
  alignItems: "center"
};