import React, { useState, useEffect } from 'react';
import Chessboard from 'chessboardjsx';
import { Link, useNavigate } from 'react-router-dom';
import { Chess, validateFen } from 'chess.js'; // Import chess.js for FEN validation

const EditBoard = ({ in_fen, updateFenAndClose }) => {
    const [fen, setFen] = useState(in_fen || 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
  const [orientation, setOrientation] = useState('white');
  const navigate = useNavigate(); // Using useNavigate for navigation

  // Chess instance for validation
  const chess = new Chess();
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
    setFen(in_fen);
  }, [in_fen]);

  const handleFlipBoard = () => {
    setOrientation(orientation === 'white' ? 'black' : 'white');
  };

  const toggleTurn = () => {
    const parts = fen.split(' ');
    parts[1] = parts[1] === 'w' ? 'b' : 'w';
    setFen(parts.join(' '));
  };

  const changeCastling = (castling) => {
    const parts = fen.split(' ');
    parts[2] = castling;
    setFen(parts.join(' '));
  };

  const handleDrop = ({ sourceSquare, targetSquare, piece }) => {
    console.log(`Dropping piece: ${piece} from ${sourceSquare} to ${targetSquare}`);
  
    if (!sourceSquare || !targetSquare || !piece) {
      console.error('Missing drop data');
      return;
    }

    // This function will update the FEN string based on the source and target squares
    const updateFen = (fen, source, target, piece) => {
      const rows = fen.split(' ');
      const position = rows[0].split('/');
      const pieceCode = piece[0] === 'b' ? piece[1].toLowerCase() : piece[1].toUpperCase(); // convert piece to FEN notation
  
      const sourceRank = 8 - parseInt(source[1]);
      const sourceFile = source.charCodeAt(0) - 'a'.charCodeAt(0);
      const targetRank = 8 - parseInt(target[1]);
      const targetFile = target.charCodeAt(0) - 'a'.charCodeAt(0);
      if (source !== "spare"){
      // Remove the piece from the source square
      position[sourceRank] = replaceCharInRank(position[sourceRank], sourceFile, '1');
      }
      // Add the piece to the target square
      position[targetRank] = replaceCharInRank(position[targetRank], targetFile, pieceCode);
  
      // Recompose the FEN string
      rows[0] = position.join('/');
      return rows.join(' ');
    };
  
    // Function to replace character in a rank with piece or empty
    const replaceCharInRank = (rank, fileIndex, newChar) => {
      const expandedRank = expandRank(rank); // expand the rank to 8 characters
      const updatedRank = expandedRank.substring(0, fileIndex) + newChar + expandedRank.substring(fileIndex + 1);
      return compressRank(updatedRank); // compress the rank back into FEN format
    };
  
    // Expands a FEN rank string
    const expandRank = (rank) => {
      return rank.replace(/[1-8]/g, (match) => ''.padStart(parseInt(match), '1'));
    };
  
    // Compresses a FEN rank string
    const compressRank = (rank) => {
      return rank.replace(/1{1,8}/g, (match) => match.length);
    };
  
    try {
      const newFen = updateFen(fen, sourceSquare, targetSquare, piece);
      console.log(`New FEN: ${newFen}`);
      setFen(newFen);
    } catch (error) {
      console.error('Error processing move:', error);
    }
  };

  const handleStartingPosition = () => {
    setFen('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
  };

  const handleClearBoard = () => {
    setFen('8/8/8/8/8/8/8/8 w - - 0 1');
  };

  const isValidFen = () => {
    return validateFen(fen).ok;
  };

  const handleAnalyze = () => {
    if (isValidFen()) {
      navigate('/analysis-board', { state: { fen } });
    } else {
      console.error('Invalid FEN');
    }
  };

  return (
    <div>
      <div className='edit-buttons1'>
      <button onClick={handleFlipBoard}>Flip Board</button>
      <button onClick={toggleTurn}>Toggle Turn</button>
      <button onClick={() => changeCastling('KQ')}>Enable White Castling</button>
      <button onClick={() => changeCastling('kq')}>Enable Black Castling</button>
      <button onClick={() => changeCastling('KQkq')}>Enable All Castling</button>
      <button onClick={() => changeCastling('-')}>Disable Castling</button>
      </div>

      <Chessboard
        position={fen}
        onDrop={handleDrop}
        width={340}
        sparePieces={true}
        orientation={orientation}
      />

      <div className='edit-buttons2'>
        <button onClick={handleStartingPosition}>Starting Position</button>
        <button onClick={handleClearBoard}>Clear Board</button>
        {isValidFen() ? (
          <button onClick={() => updateFenAndClose(fen)}>Close Edit and Analyze</button>
        ) : (
          <p style={{ color: 'red' }}>Invalid FEN, please correct the position.</p>
        )}
      </div>
    </div>
  );
};

export default EditBoard;
