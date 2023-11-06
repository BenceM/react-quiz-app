/* eslint-disable no-unused-vars */
import { useEffect } from "react";
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
import { useQuiz } from "./context/QuizContext";

function App() {
	const { status } = useQuiz();

	return (
		<div className="app">
			<Header />
			<Body>
				{status === "loading" && <Loader />}
				{status === "error" && <Error />}
				{status === "ready" && <StartScreen />}
				{status === "active" && (
					<>
						<Progress />
						<Question />
						<Footer>
							<Timer />
							<NextQuestion />
						</Footer>
					</>
				)}
				{status === "finished" && <FinishScreen />}
			</Body>
		</div>
	);
}

export default App;
