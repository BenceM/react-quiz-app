import { createContext, useContext, useReducer } from "react";

const QuizContext = createContext();

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
			return { ...initialState, questions: state.questions, status: "ready" };
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

function QuizProvider({ children }) {
	const [
		{ questions, status, index, answer, points, highScore, secondsRemaining },
		dispatch,
	] = useReducer(reducer, initialState);
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
		<QuizContext.Provider
			value={{
				questions,
				status,
				index,
				answer,
				points,
				highScore,
				secondsRemaining,
				dispatch,
				numQuestions,
				totalPoints,
			}}
		>
			{children}
		</QuizContext.Provider>
	);
}

function useQuiz() {
	const context = useContext(QuizContext);
	if (context === undefined) throw new Error("Context is out of scope");
	return context;
}

export { QuizProvider, useQuiz };
