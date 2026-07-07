import { useRef, useState, useEffect } from "react";
import { emptyGrid } from "./utils/emptyRowGenerator";
import './App.css';
import GameGrid from './Grid';

function App() {
  const [rows, setRows] = useState(emptyGrid);
  const [startingPosition, setStartingPosition] = useState(emptyGrid);
  const [invalidCoordinates, setInvalidCoordinates] = useState<Set<string>>(new Set())


  function setSquareValue(num: number, row: number, col: number): void {
    const newRows = [...rows];
    newRows[row][col] = num;
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
      />
    </div>
  );
}

export default App;
