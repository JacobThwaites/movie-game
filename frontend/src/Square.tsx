import { useRef } from 'react';
import './Square.css'


interface SquareProps {
  value: any,
  column: number,
  setSquareValue(squareNum: any, col: number): void,
  className: string,
  setActiveSquare: any,
  isActiveSquare: boolean
}

export default function Square(props: SquareProps) {
  const ref = useRef(null);

  return (
    <>
      <input
        data-testid="square"
        className={props.className}
        type="text"
        value={props.value ? props.value : ''}
        ref={ref}
        onClick={props.setActiveSquare}
        readOnly
      />
    </>
  );
}
