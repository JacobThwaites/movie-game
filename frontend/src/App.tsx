import { useRef, useState, useEffect } from "react";
import { emptyGrid } from "./utils/emptyRowGenerator";
import './App.css';
import GameGrid from './Grid';
import GuessInput from "./GuessInput";
import { CoordinatesType } from "./utils/CoordinatesType";

function App() {
  const [rows, setRows] = useState(emptyGrid);
  const [startingPosition, setStartingPosition] = useState(emptyGrid);
  const [invalidCoordinates, setInvalidCoordinates] = useState<Set<string>>(new Set());
  const [guess, setGuess] = useState<string>("");
  const [activeSquare, setActiveSquare] = useState<CoordinatesType>([-1, -1]);


  function setSquareValue(answer: any, row: number, col: number): void {
    const newRows = [...rows];
    newRows[row][col] = answer;
    setRows(newRows);
  };

  return (
    <div className="App">
      <h1>Movie Game</h1>
      <GameGrid
        setSquareValue={setSquareValue}
        rows={rows}
        startingPosition={startingPosition}
        invalidCoordinates={invalidCoordinates}
        activeSquare={activeSquare}
        setActiveSquare={setActiveSquare}
      />
      <GuessInput
        setGuess={setSquareValue}
        activeSquare={activeSquare}
      />
    </div>
  );
}

export default App;
