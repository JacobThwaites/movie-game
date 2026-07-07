import { useRef, useEffect } from 'react';
import { isArrowKeyPress, isBackspacePress, isNumberKeyPress } from './utils/keypressValidation';
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
        // onChange={e => handleChange(e.target.value)}
        // onKeyDown={handleKeyDown(val)}
        onClick={props.setActiveSquare}
      />
    </>
  );
}