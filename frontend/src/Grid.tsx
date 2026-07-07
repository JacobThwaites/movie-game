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
  invalidCoordinates: Set<string>,
  activeSquare: any,
  setActiveSquare: any
}

export default function GameGrid(props: GameGridProps) {

  return (
    <div id='sudoku'>
      {props.rows.map((row, index) => {
        return (
          <Row
            key={index}
            rowIndex={index}
            answers={row}
            setSquareValue={props.setSquareValue}
            rowStartingPosition={props.startingPosition[index]}
            activeSquare={props.activeSquare}
            setActiveSquare={props.setActiveSquare}
            invalidCoordinates={props.invalidCoordinates}
          />
        )
      })
    }
    </div>
  );
}