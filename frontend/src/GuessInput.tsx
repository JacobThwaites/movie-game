import { useState } from "react"
import { CoordinatesType } from "./utils/CoordinatesType";

interface GuessInputProps {
    activeSquare: CoordinatesType,
    disabled: boolean,
    setGuess(guess: string, row: number, col: number): void,
}

export default function GuessInput(props: GuessInputProps) {
    const [curr, setCurr] = useState("");

    function onClick() {
        if (props.disabled || props.activeSquare[0] < 0 || props.activeSquare[1] < 0) {
            return;
        }

        props.setGuess(curr, props.activeSquare[0], props.activeSquare[1]);
        setCurr("");
    }

    return (
        <div>
            <input
                disabled={props.disabled}
                type="text"
                onChange={e => setCurr(e.target.value)}
                value={curr}
            />
            <button disabled={props.disabled} onClick={() => onClick()}>Submit</button>
        </div>
    )
}
