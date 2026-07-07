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
  const [guessesRemaining, setGuessesRemaining] = useState(9);
  const [answers, setAnswers] = useState<Array<any>>([]);
  const rowLabels = ["Morgan Freeman", "Cameron Diaz", "Martin Scorsese"];
  const colLabels = ["One word title", "Two Word Title", "3 or more word Title"];

  useEffect(() => {
    const data = getAnswers();
    setAnswers(data);
  }, []);

  function getAnswers() {
    return [
      [
        ['a', 'b'],
        ['a', 'b'],
        ['a', 'b'],
      ],
      [
        ['a', 'b'],
        ['a', 'b'],
        ['a', 'b'],
      ],
      [
        ['a', 'b'],
        ['a', 'b'],
        ['a', 'b'],
      ]
    ];
  }

  function setSquareValue(guess: any, row: number, col: number): void {
    const allowedAnswers = answers[col][row];

    if (!allowedAnswers.includes(guess)) {
      setGuess("");
      setGuessesRemaining(guessesRemaining - 1);
      return;
    }

    setGuess("");
    const newRows = [...rows];
    newRows[row][col] = guess;
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
        rowLabels={rowLabels}
        colLabels={colLabels}
      />
      <GuessInput
        setGuess={setSquareValue}
        activeSquare={activeSquare}
      />
      <p>{guessesRemaining} Guesses Remaining</p>
    </div>
  );
}

export default App;
