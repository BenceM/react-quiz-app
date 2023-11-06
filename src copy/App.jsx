/* eslint-disable no-unused-vars */
import { useEffect, useReducer, useState } from "react";
import Header from "./components/Header";
import Body from "./components/Body";
import Loader from "./components/Loader";
import Error from "./components/Error";
import StartScreen from "./components/StartScreen";
import Question from "./components/Question";
import NextQuestion from "./components/NextQuestion";
import Progress from "./components/Progress";
import FinishScreen from "./components/FinishScreen";
import Footer from "./components/Footer";
import Timer from "./components/Timer";
const initialState = {
	questions: [],
	//loading, error, ready, active, finished
	status: "loading",
	index: 0,
	answer: null,
	points: 0,
	highScore: 0,
	secondsRemaining: 10,
};
const SECONDS_PER_QUESTION = 30;
function reducer(state, action) {
	switch (action.type) {
		case "dataReceived":
			return { ...state, questions: action.payload, status: "ready" };
		case "error":
			return { ...state, status: "error" };
		case "start":
			return {
				...state,
				status: "active",
				secondsRemaining: state.questions.length * SECONDS_PER_QUESTION,
			};
		case "newAnswer":
			const question = state.questions.at(state.index);
			return {
				...state,
				answer: action.payload,
				points:
					action.payload === question.correctOption
						? state.points + Number(question.points)
						: state.points,
			};
		case "nextQuestion":
			return { ...state, index: state.index++, answer: null };
		case "finish":
			return {
				...state,
				status: "finished",
				highScore:
					state.points > state.highScore ? state.points : state.highScore,
			};
		case "restart":
			return { ...initialState, questions: state.questions, status: ready };
		case "tick":
			return {
				...state,
				secondsRemaining: state.secondsRemaining - 1,
				status: state.secondsRemaining === 0 ? "finished" : state.status,
			};
		default:
			throw new Error("Unknown action");
	}
}

function App() {
	const [
		{ questions, status, index, answer, points, highScore, secondsRemaining },
		dispatch,
	] = useReducer(reducer, initialState);
	console.log(questions);
	const numQuestions = questions.length;
	const totalPoints = questions.reduce(
		(acc, question) => acc + question.points,
		0,
	);
	useEffect(() => {
		async function fetchData() {
			try {
				const res = await fetch("http://localhost:8000/questions");
				if (!res.ok) throw new Error("something not right");
				const data = await res.json();

				dispatch({ type: "dataReceived", payload: data });
			} catch (err) {
				dispatch({ type: "error" });
			}
		}
		fetchData();
	}, []);
	return (
		<div className="app">
			<Header />
			<Body>
				{status === "loading" && <Loader />}
				{status === "error" && <Error />}
				{status === "ready" && (
					<StartScreen numQuestions={numQuestions} dispatch={dispatch} />
				)}
				{status === "active" && (
					<>
						<Progress
							index={index}
							numQuestions={numQuestions}
							points={points}
							totalPoints={totalPoints}
							answer={answer}
						/>
						<Question
							question={questions[index]}
							dispatch={dispatch}
							answer={answer}
						/>
						<Footer>
							<Timer dispatch={dispatch} secondsRemaining={secondsRemaining} />
							<NextQuestion
								dispatch={dispatch}
								answer={answer}
								index={index}
								numQuestions={numQuestions}
							/>
						</Footer>
					</>
				)}
				{status === "finished" && (
					<FinishScreen
						points={points}
						totalPoints={totalPoints}
						highScore={highScore}
						dispatch={dispatch}
					/>
				)}
			</Body>
		</div>
	);
}

export default App;
