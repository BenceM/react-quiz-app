import React from "react";

const Question = ({ question, dispatch, answer }) => {
	const hasAnswered = answer !== null;
	return (
		<div>
			<h4>{question.question}</h4>
			<div className="options">
				{question.options.map((el, i) => (
					<button
						className={`btn btn-option ${i === answer ? "answer" : ""}${
							hasAnswered
								? i === question.correctOption
									? "correct"
									: "wrong"
								: ""
						}`}
						disabled={hasAnswered}
						key={el}
						onClick={() => dispatch({ type: "newAnswer", payload: i })}
					>
						{el}
					</button>
				))}
			</div>
		</div>
	);
};

export default Question;
