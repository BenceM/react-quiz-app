import React from "react";

function FinishScreen({ points, totalPoints, highScore, dispatch }) {
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
