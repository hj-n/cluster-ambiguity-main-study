import Trial from "./components/Trial";
import "./App.css";
import { useState, useRef } from "react";
import Introduction from "./components/Introduction";
import Closing from "./components/Closing";
import Ready from "./components/Ready";

function Wrapper() {

	const datasetList = require("./sampled_datasets_manual_sample.json")
	const trainingList = require("./sampled_datasets_training.json")
	const testList = datasetList.filter((d) => !trainingList.includes(d))
	
	
	testList.sort(() => Math.random() - 0.5)

	return (
		<App trainingList={trainingList} testList={testList}/>
	)
}

function App(props) {

	// experiment data
	const ambiguity = useRef({});
	const lassoResult = useRef({});


	// updateData
	const updateAmbiguity = (dataset, ambiguityTrial) => {
		ambiguity.current[dataset] = ambiguityTrial;
	}
	const updateLassoResult = (dataset, lassoResultTrial) => {
		// lassoResult[dataset] = lassoResult;
		lassoResult.current[dataset] = lassoResultTrial;
		
	}
	
	const [phase, setPhase] = useState("intro");
	const [train, setTrain] = useState(0);
	const [test, setTest] = useState(0);

	const trainingList = props.trainingList;
	const testList = props.testList;

	const trainingNum = trainingList.length
	const testNum     = testList.length

	// update phase
	function updatePhase() {
		if (phase === "train") {
			if (train < trainingNum - 1) {
				setTrain(train + 1)
			} else {
				setPhase("ready")
			}
		} else if (phase === "test") {
			if (test < testNum - 1) {
				setTest(test + 1)
			} else {
				setPhase("finish");
				// save data
				(async () => {
					const blob = await new Blob([JSON.stringify({
						ambiguity: ambiguity.current,
						lassoResult: lassoResult.current
					})], { type: "text/plain;charset=utf-8" })
					const href = await URL.createObjectURL(blob)
					const link = document.createElement("a")
					link.href = href
					link.download = "result.json"
					document.body.appendChild(link)
					link.click()
					document.body.removeChild(link)
				})();
			}
		}
	}



  return (
    <div className="App">
      {phase === "intro" && <Introduction/>}
			{phase === "ready" && <Ready/>}
			{phase === "train" && <Trial 
				type={"Training session"} trial={train} trialNum={trainingNum} dataset={trainingList[train]}
				updatePhase={updatePhase}
			/>}
			{phase === "test"  && <Trial 
				type={"Experiment"} trial={test} trialNum={testNum} dataset={testList[test]}
				updatePhase={updatePhase} updateAmbiguity={updateAmbiguity} updateLassoResult={updateLassoResult}
				/>}
			{phase === "finish" && <Closing/>}
			<div id="startButton">
				{phase === "intro" && <button onClick={() => setPhase("train")}>Start Training!!</button>}
				{phase === "ready" && <button onClick={() => setPhase("test")}>Start Experiment!!</button>}
			</div>
    </div>
  );
}

export default Wrapper;
