import React, { Component } from "react";
import Chessboard from "chessboardjsx";
import Stockfish from "./integrations/Stockfish.js";



class PlayStockfish extends Component {
  render() {
    return (
      <div style={boardsContainer}>
        <Stockfish>
          {({ position, onDrop }) => (
            <Chessboard
              id="stockfish"
              position={position}
              width={540}
              onDrop={onDrop}
              boardStyle={boardStyle}
              orientation="black"
            />
          )}
        </Stockfish>
      </div>
    );
  }
}

export default PlayStockfish;


const boardsContainer = {
  display: "flex",
  justifyContent: "space-around",
  alignItems: "center"
};

const boardStyle = {
  borderRadius: "5px",
  boxShadow: `0 5px 15px rgba(0, 0, 0, 0.5)`
};