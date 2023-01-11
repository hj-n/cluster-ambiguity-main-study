import Trial from "./components/Trial";
import "./App.css";
import { useState, useRef } from "react";
import Introduction from "./components/Introduction";

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
	const ambiguity = useRef();
	const lassoResult = useRef();
	ambiguity.current = {};
	lassoResult.current = {};

	// updateData
	const updateAmbiguity = (dataset, ambiguityTrial) => {
		ambiguity.current[dataset] = ambiguityTrial;
	}
	const updateLassoResult = (dataset, lassoResultTrial) => {
		// lassoResult[dataset] = lassoResult;
		lassoResult.current[dataset] = lassoResultTrial;
		console.log(lassoResult.current)
		
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
				setPhase("test")
			}
		} else if (phase === "test") {
			if (test < testNum - 1) {
				setTest(test + 1)
			} else {
				setPhase("finish")
			}
		}
	}



  return (
    <div className="App">
      {phase === "intro" && <Introduction/>}
			{phase === "train" && <Trial 
				type={"Training session"} trial={train} trialNum={trainingNum} dataset={trainingList[train]}
				updatePhase={updatePhase}
			/>}
			{phase === "test"  && <Trial 
				type={"Experiment"} trial={test} trialNum={testNum} dataset={testList[test]}
				updatePhase={updatePhase} updateAmbiguitiy={updateAmbiguity} updateLassoResult={updateLassoResult}
				/>}
			<div id="startButton">
				{phase === "intro" && <button onClick={() => setPhase("train")}>Start Experiment!!</button>}
			</div>
    </div>
  );
}

export default Wrapper;
