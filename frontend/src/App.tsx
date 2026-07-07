import { useEffect, useState } from "react";
import { getEmptyRowsWithNulls } from "./utils/emptyRowGenerator";
import './App.css';
import GameGrid from './Grid';
import GuessInput from "./GuessInput";
import { CoordinatesType } from "./utils/CoordinatesType";
import {
  createGameSetup,
  findMatchingMovieGuess,
  GameSetup,
  MovieAnswer,
} from "./services/wikidataGameSetup";

function App() {
  const [rows, setRows] = useState(getEmptyRowsWithNulls);
  const [startingPosition] = useState(getEmptyRowsWithNulls);
  const [invalidCoordinates, setInvalidCoordinates] = useState<Set<string>>(new Set());
  const [activeSquare, setActiveSquare] = useState<CoordinatesType>([-1, -1]);
  const [guessesRemaining, setGuessesRemaining] = useState(9);
  const [gameSetup, setGameSetup] = useState<GameSetup | null>(null);
  const [setupStatus, setSetupStatus] = useState<"loading" | "ready" | "error">("loading");
  const [setupError, setSetupError] = useState<string>("");

  useEffect(() => {
    let isMounted = true;

    async function loadGameSetup() {
      try {
        setSetupStatus("loading");
        const setup = await createGameSetup();

        if (!isMounted) {
          return;
        }

        setRows(getEmptyRowsWithNulls());
        setGameSetup(setup);
        setSetupStatus("ready");
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setSetupError(
          error instanceof Error ? error.message : "Could not build a game setup."
        );
        setSetupStatus("error");
      }
    }

    loadGameSetup();

    return () => {
      isMounted = false;
    };
  }, []);

  function setSquareValue(guess: string, row: number, col: number): void {
    if (!gameSetup || row < 0 || col < 0 || rows[row][col]) {
      return;
    }

    const answers = gameSetup.answers[row][col];
    const selectedMovie = findMatchingMovieGuess(guess, answers);

    if (!selectedMovie) {
      setGuessesRemaining((remaining) => Math.max(remaining - 1, 0));
      setInvalidCoordinates((coordinates) => {
        const nextCoordinates = new Set(coordinates);
        nextCoordinates.add(`${row},${col}`);
        return nextCoordinates;
      });
      return;
    }

    const newRows = [...rows];
    newRows[row] = [...newRows[row]];
    newRows[row][col] = selectedMovie;
    setRows(newRows);
  };

  const rowLabels = gameSetup?.actors.map((actor) => actor.label) ?? ["", "", ""];
  const colLabels =
    gameSetup?.categories.map((category) => category.label) ?? ["", "", ""];
  const activeMovieOptions: MovieAnswer[] =
    gameSetup && activeSquare[0] >= 0 && activeSquare[1] >= 0
      ? gameSetup.answers[activeSquare[0]][activeSquare[1]]
      : [];

  return (
    <div className="App">
      <h1>Movie Game</h1>
      {setupStatus === "loading" && <p>Building a Wikidata board...</p>}
      {setupStatus === "error" && <p>{setupError}</p>}
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
        disabled={setupStatus !== "ready"}
        movieOptions={activeMovieOptions}
      />
      <p>{guessesRemaining} Guesses Remaining</p>
    </div>
  );
}

export default App;
