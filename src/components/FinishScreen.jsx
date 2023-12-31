import React from "react";
import { useQuiz } from "../context/QuizContext";

function FinishScreen() {
	const { points, totalPoints, highScore, dispatch } = useQuiz();
	const percentage = Math.ceil((points / totalPoints) * 100);
	return (
		<>
			<p className="result">
				You scored <strong>{points}</strong> out of {totalPoints} points (
				{percentage}%)
			</p>
			<p className="highscore"> Highscore: {highScore} points</p>
			<button
				className="btn btn-ui"
				onClick={() => dispatch({ type: "restart" })}
			>
				Restart
			</button>
		</>
	);
}

export default FinishScreen;
