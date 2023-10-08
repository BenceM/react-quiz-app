/* eslint-disable no-unused-vars */
import { useEffect, useReducer, useState } from "react";
import Header from "./Header";
import Body from "./Body";

const initialState = {
	questions: [],
	//loading, error, ready, active, finished
	status: "loading",
};
function reducer(state, action) {
	switch (action.type) {
		case "dataReceived":
			return { ...state, questions: action.payload, status: "ready" };
		case "error":
			return { ...state, status: "error" };
		default:
			throw new Error("Unknown action");
	}
}

function App() {
	const [state, dispatch] = useReducer(reducer, initialState);
	useEffect(() => {
		async function fetchData() {
			try {
				const res = await fetch("http://localhost:8000/questions");
				if (!res.ok) throw new Error("something not right");
				const data = await res.json();
				console.log(data);
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
				<p>1/15</p>
				<p>question</p>
			</Body>
		</div>
	);
}

export default App;
