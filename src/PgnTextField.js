import React, { useState } from 'react';

const PgnTextField = ({ pgn, onPrevMove, onNextMove }) => {
  const [currentMoveIndex, setCurrentMoveIndex] = useState(0);

  const handlePrevMove = () => {
    if (currentMoveIndex > 0) {
      setCurrentMoveIndex(currentMoveIndex - 1);
      onPrevMove(currentMoveIndex - 1);
    }
  };

  const handleNextMove = () => {
    if (currentMoveIndex < pgn.length - 1) {
      setCurrentMoveIndex(currentMoveIndex + 1);
      onNextMove(currentMoveIndex + 1);
    }
  };

  return (
    <div>
      <div>
        <button onClick={handlePrevMove}>&lt;</button>
        <button onClick={handleNextMove}>&gt;</button>
      </div>
      <textarea value={pgn[currentMoveIndex]} readOnly />
    </div>
  );
};

export default PgnTextField;
