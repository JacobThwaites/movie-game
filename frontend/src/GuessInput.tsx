import { useState } from "react"

export default function GuessInput(props: any) {
    const [curr, setCurr] = useState("");
    return (
        <div>
            <input type="text" onChange={e => setCurr(e.target.value)}/>
            <button onClick={() => props.setGuess(curr, props.activeSquare[0], props.activeSquare[1])}>Submit</button>
        </div>
    )
}