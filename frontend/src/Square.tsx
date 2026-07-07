import { useRef } from 'react';
import { MovieAnswer } from './services/wikidataGameSetup';
import './Square.css'


interface SquareProps {
  value: MovieAnswer | null,
  column: number,
  setSquareValue(squareNum: any, col: number): void,
  className: string,
  setActiveSquare: any,
  isActiveSquare: boolean
}

export default function Square(props: SquareProps) {
  const ref = useRef(null);
  const displayValue = props.value ? props.value.title : '';

  return (
    <>
      <input
        data-testid="square"
        className={props.className}
        type="text"
        value={displayValue}
        title={props.value ? props.value.id : ''}
        ref={ref}
        onClick={props.setActiveSquare}
        readOnly
      />
    </>
  );
}
