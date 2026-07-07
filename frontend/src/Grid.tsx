import { useState } from "react";
import Row from './Row';
import { SudokuGridType } from "./SudokuGridType";
import { CoordinatesType } from "./utils/CoordinatesType";
import { getNewActiveSquare } from "./utils/getNewActiveSquare";
import './GameGrid.css';

interface GameGridProps {
  rows: SudokuGridType,
  setSquareValue: Function,
  startingPosition: SudokuGridType,
  invalidCoordinates: Set<string>
}

export default function GameGrid(props: GameGridProps) {
  const [activeSquare, setActiveSquare] = useState<CoordinatesType>([-1, -1]);

  function handleArrowKey(keyCode: number) {
    const newActiveSquare = getNewActiveSquare(activeSquare, keyCode);
    setActiveSquare(newActiveSquare);
  }

  return (
    <div id='sudoku'>
      {props.rows.map((row, index) => {
        return (
          <Row
            key={index}
            rowIndex={index}
            answers={row}
            setSquareValue={props.setSquareValue}
            handleArrowKey={handleArrowKey}
            rowStartingPosition={props.startingPosition[index]}
            activeSquare={activeSquare}
            setActiveSquare={setActiveSquare}
            invalidCoordinates={props.invalidCoordinates}
          />
        )
      })
    }
    </div>
  );
}