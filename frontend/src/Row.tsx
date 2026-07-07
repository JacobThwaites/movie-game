import Square from "./Square";
import { getSquareClassname } from "./utils/squareClassnameGenerator";
import { CoordinatesType } from "./utils/CoordinatesType";
import { areCoordinatesEqual } from "./utils/utils";
import './Row.css';

interface RowProps {
  rowIndex: number,
  answers: Array<any>,
  setSquareValue: Function,
  rowStartingPosition: Array<any>,
  activeSquare: CoordinatesType,
  setActiveSquare: Function,
  invalidCoordinates: Set<string>,
  label: any,
  colLabels: any
}

export default function Row(props: RowProps) {
  function setSquareValue(guess: string, column: number) {
    props.setSquareValue(guess, props.rowIndex, column);
  }

  function setActiveSquare(column: number) {
    const newActiveSquare: CoordinatesType = [props.rowIndex, column];
    props.setActiveSquare(newActiveSquare);
  }

  return (
    <>
      {props.rowIndex === 0 && (
        <div className="row column-header">
          <div className="row-label"></div>

          {props.answers.map((_, column: number) => (
            <div key={column} className="column-label">
              {props.colLabels[column]}
            </div>
          ))}
        </div>
      )}

      <div className="row">
        <div className="row-label">
          {props.label}
        </div>

        {props.answers.map((answer: string, column: number) => {
          const isActiveSquare = areCoordinatesEqual(
            [props.rowIndex, column],
            props.activeSquare
          );

          return (
            <Square
              className={getSquareClassname(
                props.rowIndex + 1,
                column + 1,
                isActiveSquare
              )}
              isActiveSquare={isActiveSquare}
              key={column}
              column={column}
              value={answer}
              setSquareValue={setSquareValue}
              setActiveSquare={() => setActiveSquare(column)}
            />
          );
        })}
      </div>
    </>
  );
}
