import { useEffect, useState } from "react"
import { CoordinatesType } from "./utils/CoordinatesType";
import { formatMovieOption, MovieAnswer } from "./services/wikidataGameSetup";

interface GuessInputProps {
    activeSquare: CoordinatesType,
    disabled: boolean,
    movieOptions: MovieAnswer[],
    setGuess(guess: string, row: number, col: number): void,
}

export default function GuessInput(props: GuessInputProps) {
    const [curr, setCurr] = useState("");
    const datalistId = `movie-options-${props.activeSquare[0]}-${props.activeSquare[1]}`;

    useEffect(() => {
        setCurr("");
    }, [props.activeSquare]);

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
                list={datalistId}
                type="text"
                placeholder="Choose a Wikidata movie"
                onChange={e => setCurr(e.target.value)}
                value={curr}
            />
            <datalist id={datalistId}>
                {props.movieOptions.map((movie) => (
                    <option key={movie.id} value={formatMovieOption(movie)} />
                ))}
            </datalist>
            <button disabled={props.disabled} onClick={() => onClick()}>Submit</button>
        </div>
    )
}
