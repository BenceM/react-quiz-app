/* eslint-disable no-unused-vars */
import { useEffect, useReducer, useState } from "react";
import Header from "./Header";
import Body from "./Body";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";
const initialState = {
	questions: [],
	//loading, error, ready, active, finished
	status: "loading",
	index: 0,
	answer: null,
	points: 0,
};
function reducer(state, action) {
	switch (action.type) {
		case "dataReceived":
			return { ...state, questions: action.payload, status: "ready" };
		case "error":
			return { ...state, status: "error" };
		case "start":
			return { ...state, status: "active" };
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
		default:
			throw new Error("Unknown action");
	}
}

function App() {
	const [{ questions, status, index, answer }, dispatch] = useReducer(
		reducer,
		initialState,
	);
	const numQuestions = questions.length;
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
					<Question
						question={questions[index]}
						dispatch={dispatch}
						answer={answer}
					/>
				)}
			</Body>
		</div>
	);
}

export default App;
