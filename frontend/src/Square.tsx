import { useRef, useEffect } from 'react';
import { isArrowKeyPress, isBackspacePress, isNumberKeyPress } from './utils/keypressValidation';
import './Square.css'


interface SquareProps {
  value: any,
  column: number,
  setSquareValue(squareNum: any, col: number): void,
  handleArrowKey: Function,
  className: string,
  setActiveSquare: any,
  isActiveSquare: boolean
}

export default function Square(props: SquareProps) {
  const ref = useRef(null);

  useEffect(() => {
    if (props.isActiveSquare) {
      // Move element into view when it is focused
      // if (ref.current) {
      //   ref?.current?.focus();
      // }
    }
  }, [props.isActiveSquare]);

  function handleChange(val: any) {
    props.setSquareValue(val, props.column);
  }

  return (
    <>
      <input
        data-testid="square"
        className={props.className}
        type="text"
        value={props.value ? props.value : ''}
        // maxLength={1}
        ref={ref}
        onChange={e => handleChange(e.target.value)}
        // onKeyDown={handleKeyDown(val)}
        onClick={props.setActiveSquare}
      />
    </>
  );
}