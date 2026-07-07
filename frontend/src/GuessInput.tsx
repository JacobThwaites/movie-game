import { useState } from "react"

export default function GuessInput(props: any) {
    const [curr, setCurr] = useState("");

    function onClick() {
        props.setGuess(curr, props.activeSquare[0], props.activeSquare[1]);
        setCurr("");
    }

    return (
        <div>
            <input type="text" onChange={e => setCurr(e.target.value)} value={curr}/>
            <button onClick={() => onClick()}>Submit</button>
        </div>
    )
}